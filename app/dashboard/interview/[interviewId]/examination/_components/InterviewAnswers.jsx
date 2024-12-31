"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import { useEffect , useState } from 'react';
import useSpeechToText from 'react-hook-speech-to-text';
import { Textarea } from '@/components/ui/textarea';
import { Mic } from 'lucide-react';
import { chatSession } from '@/utils/GeminiModel';
import { toast } from 'sonner';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { Loader } from 'lucide-react';
import Link from 'next/link';

const InterviewAnswers = ({mockInterviewQuestions,activeQuestionIndex, interviewData}) => {
  const { user } = useUser();

  const [answer, setAnswer] = useState('');
  const [manualEdit, setManualEdit] = useState(false);
  const [baseText, setBaseText] =useState('');
  const [micError , setMicError] = useState(false)
  const [completeAnswer, setCompleteAnswer] = useState('');
  const textareaRef = React.useRef(null);
  const [loading , setLoading] = useState(false)

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  React.useEffect(() => {
    if (error) {
      setMicError(true);
    }
  }, [error]);
  useEffect(() => {
    if (!manualEdit) {
      const latestTranscript = results[results.length - 1]?.transcript || '';
      
      if (latestTranscript && latestTranscript !== baseText) {
        const newBaseText = baseText 
          ? `${baseText} ${latestTranscript}` 
          : latestTranscript;
        
        const cursorPosition = textareaRef.current?.selectionStart;
        
        setBaseText(newBaseText.trim());
        setAnswer(newBaseText.trim());
        setCompleteAnswer(prev => {
          const newText = prev ? `${prev} ${latestTranscript}` : latestTranscript;
          return newText.trim();
        });

        if (textareaRef.current && cursorPosition !== undefined) {
          requestAnimationFrame(() => {
            textareaRef.current.selectionStart = cursorPosition;
            textareaRef.current.selectionEnd = cursorPosition;
          });
        }
      }
    }
  }, [results, manualEdit]);

  React.useEffect(() => {
    if (!manualEdit && interimResult) {
      const textToDisplay = `${baseText} ${interimResult}`.trim();
      const cursorPosition = textareaRef.current?.selectionStart;
      
      setAnswer(textToDisplay);

      if (textareaRef.current && cursorPosition !== undefined) {
        requestAnimationFrame(() => {
          textareaRef.current.selectionStart = cursorPosition;
          textareaRef.current.selectionEnd = cursorPosition;
        });
      }
    }
  }, [interimResult, baseText, manualEdit]);

  useEffect(() => {
    if (!isRecording && answer) {
      setCompleteAnswer(answer);
    }
  }, [isRecording, answer]);

  const handleTextareaChange = (e) => {
    if (!isRecording) {
      setManualEdit(true);
      const newValue = e.target.value;
      setAnswer(newValue);
      setBaseText(newValue);
      setCompleteAnswer(newValue);
      
    }
  };

  const handleStartRecording = () => {
    setManualEdit(false);
    results.length = 0;
    startSpeechToText();
  };
  useEffect(() => {
    setAnswer('');
    setBaseText('');
    setCompleteAnswer('');
    setManualEdit(false);
    if (results) results.length = 0;
    if (isRecording) stopSpeechToText();
  }, [activeQuestionIndex]);
  const handleFeedback =async()=>{
    setLoading(true)
    if(mockInterviewQuestions && mockInterviewQuestions.questions){
      const feedbackPrompt = "Question "+mockInterviewQuestions.questions[activeQuestionIndex].question +", user answer "+ completeAnswer+"depending on the question and user answer for given interview answer please give us rating for the answer out of 10 strictly based on the answer and the answer assessment resemble interview like situation , if the answer is irrelvent or semi-answered or repeats the question itself , then strictly give low rating and give feed back in 3 to 4 lines and if the user answer is code, check the code and tell them errors in the code, but give code in single line as well and give me the correct answer(not in json format , but in single line) for the question, in JSON format with rating field and feedback field and correct answer field "
      const result = await chatSession.sendMessage(feedbackPrompt)
      const feedbackJsonResp = (result.response.text()).replace('```json','').replace('```','')
      const JsonFeedbackResponse = JSON.parse(feedbackJsonResp)
      console.log(JsonFeedbackResponse)
      const response = await db.insert(UserAnswer)
      .values({
        mockIdRef: interviewData?.mockId,
        question : mockInterviewQuestions.questions[activeQuestionIndex].question,
        correctAns : JsonFeedbackResponse?.correct_answer ,
        userAns : completeAnswer,
        feedback : JsonFeedbackResponse?.feedback,
        rating :JsonFeedbackResponse?.rating,
        userEmail : interviewData?.createdBy,
        createdAt : moment().format('DD-MM-YYYY')
      })
      if(response){
        setLoading(false)
        toast('User Answer saved succesfully')
      }
    }
  }
  return (
    <div>
      {/* <label htmlFor="my-textarea" className="text-xl font-medium text-gray-700">
        Record or Type Your Answer
      </label> */}
      <div className='border rounded-lg my-7'>
      {micError ?
       <div className='flex justify-center p-3'>
          <div className='text-base text-red-600'>Recording is not available in your browser , type your answer</div>
       </div>
       :
       <div className='flex justify-center items-center mt-4'>
       <Button 
         onClick={isRecording ? stopSpeechToText : handleStartRecording}
         className='bg-primary text-white'
       >
         {isRecording ? <div className='flex justify-center items-center gap-3'>
          Stop Recording <Mic className='text-white' />
         </div> : 'Record Answer'}
       </Button>
     </div>
      }
        <Textarea
          ref={textareaRef}
          style={{ fontSize: "1.25rem" }}
          id='my-textarea'
          value={answer}
          onChange={handleTextareaChange}
          placeholder="Record or Type Your Answer"
          readOnly={isRecording}
          className={`${isRecording ? 'cursor-not-allowed bg-gray-50' : ''}p-3 w-full mt-4 h-[60vh] placeholder:text-lg`}
        />
      </div>
     
      {loading ? 
      <div className='flex justify-center items-center mt-7'>
      <Button className='flex justify-center items-center gap-3'>
        <Loader className='animate-spin text-white'></Loader>
      </Button>
    </div>
      :
      <div className='flex justify-center items-center mt-7'>
         <Button onClick={handleFeedback} className='flex justify-center items-center gap-3 dark:text-white'>Save Answer</Button>
       </div>
      }
        <div className='flex justify-end items-end mt-4'>
          <Link href={'/dashboard/interview/'+ interviewData?.mockId+'/feedback'}>
         <Button className='flex hover:bg-red-700 justify-center text-lg items-center gap-3 bg-red-500'> End Interview </Button>
          </Link>
          
       </div>
    </div>
  )
}

export default InterviewAnswers
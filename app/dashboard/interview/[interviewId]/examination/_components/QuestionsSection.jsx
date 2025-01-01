"use client"
import React, { useEffect, useState } from 'react';
import RecordAns from './VideoAnswerSection';
import { Loader, Volume2, VolumeOff } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const QuestionsSection = ({
  mockInterviewQuestions,
  activeQuestionIndex,
  setActiveQuestionIndex,
}) => {
  const [voice, setVoice] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const textToSpeech = (text) => {
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      setTimeout(() => {
        const speech = new SpeechSynthesisUtterance();
        speech.text = text;
        speech.volume = 1;
        speech.rate = 1;
        speech.pitch = 1;
        window.speechSynthesis.speak(speech);
      }, 100);
    } else {
      alert('Your browser does not support text to speech');
    }
  };

  useEffect(() => {
    if (isInitialLoad && mockInterviewQuestions?.questions?.length > 0) {
      const question = mockInterviewQuestions.questions[activeQuestionIndex]?.question;
      if (question) {
        setTimeout(() => {
          textToSpeech(question);
          setIsInitialLoad(false);
        }, 500);
      }
    }
  }, [mockInterviewQuestions, isInitialLoad, activeQuestionIndex]);

  useEffect(() => {
    if (mockInterviewQuestions?.questions?.length > 0) {
      const question = mockInterviewQuestions.questions[activeQuestionIndex]?.question;
      if (question && voice) {
        textToSpeech(question);
      }
    }
  }, [mockInterviewQuestions, activeQuestionIndex]);

  const handleQuestionChange = (newIndex) => {
    window.speechSynthesis.cancel();
    setActiveQuestionIndex(newIndex);
  };

  const offhandleVoice = () => {
    window.speechSynthesis.cancel();
    setVoice(false);
  };

  const onhandleVoice = () => {
    const question = mockInterviewQuestions.questions[activeQuestionIndex]?.question;
    if (question) {
      setVoice(true);
      textToSpeech(question);
    }
  };

  return (
    <div>
      {mockInterviewQuestions?.questions ? (
        <>
          <div className="p-5 border rounded-lg h-80 max-sm:h-96 my-7">
            <div>
              {mockInterviewQuestions.questions.map((item, index) => (
                <div key={index}>
                  {activeQuestionIndex === index && (
                    <div>
                      <div className="my-1 text-md md:text-lg font-medium">
                        <p className='font-bold'>Question {index + 1}</p>  {item.question}
                      </div>
                    </div>
                  )}
                </div>
              ))}
             
             <div
                className="bg-gray-200 rounded-full mt-5 p-3 h-12 w-12 cursor-pointer"
                onClick={voice ? offhandleVoice : onhandleVoice}
              >
                {voice ? <VolumeOff /> : <Volume2 />}
              </div> 
              
            </div>
            <div className="flex justify-end mt-3 gap-5">
              <div
                className="bg-primary p-2 lg:px-5 text-white lg:p-2 rounded-lg cursor-pointer"
                onClick={() => {
                  const newIndex = (activeQuestionIndex - 1 + mockInterviewQuestions.questions.length) %
                    mockInterviewQuestions.questions.length;
                  handleQuestionChange(newIndex);
                }}
              >
                Previous Question
              </div>
              <div
                className="bg-primary lg:px-5 p-2 text-white lg:p-2 rounded-lg cursor-pointer"
                onClick={() => {
                  const newIndex = (activeQuestionIndex + 1) %
                    mockInterviewQuestions.questions.length;
                  handleQuestionChange(newIndex);
                }}
              >
                Next Question
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="p-5 border rounded-lg min-h-72 my-7">
            <div>
              <div className="flex justify-center items-center h-72">
                <Loader className="animate-spin text-black " />
              </div>
            </div>
          </div>
        
          {/* <div className="p-5 border rounded-lg min-h-72 my-7">
              <div className=" h-72">
          <Skeleton className="w-[600px] h-[40px] rounded-full" />
          <Skeleton className="w-[600px] h-[40px] rounded-full" />
          <Skeleton className="w-[600px] h-[40px] rounded-full" />
          <Skeleton className="w-[600px] h-[40px] rounded-full" />
          </div>
          </div> */}
        </>
      )}
      <RecordAns />
    </div>
  );
};

export default QuestionsSection;

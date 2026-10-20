"use client"
import React, { useEffect, useState } from 'react'
import QuestionsSection from './_components/QuestionsSection';
import InterviewAnswers from './_components/InterviewAnswers';

const Examination = ({params}) => {
    const [interviewId, setInterviewId] = useState(null);
    const[interviewData, setInterviewData] = useState()
    const[mockInterviewQuestions,setMockInterviewQuestions]=useState()
    const[activeQuestionIndex,setActiveQuestionIndex]=useState(0)
  useEffect(()=>{
    
      const fetchParams= async()=>{
        const unwrappedParams = await params;
        if(unwrappedParams && unwrappedParams.interviewId){
           setInterviewId(unwrappedParams.interviewId)
           getInterviewDetails(unwrappedParams.interviewId)
      }
   }
     fetchParams()
  },[params])

  const getInterviewDetails =async(interviewId)=>{
    const res = await fetch('/api/interviews/' + interviewId)
    if (!res.ok) return
    const result = await res.json()
    const jsonResponse = JSON.parse(result.jsonMockResp)
    setMockInterviewQuestions(jsonResponse)
    setInterviewData(result)
  }
  return (
    <div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
           <QuestionsSection 
           mockInterviewQuestions={mockInterviewQuestions}
           activeQuestionIndex={activeQuestionIndex}
           setActiveQuestionIndex={setActiveQuestionIndex}
           ></QuestionsSection>
           <InterviewAnswers
           mockInterviewQuestions={mockInterviewQuestions}
           activeQuestionIndex={activeQuestionIndex}
           interviewData={interviewData}
           ></InterviewAnswers>

        </div>
    </div>
  )
}

export default Examination
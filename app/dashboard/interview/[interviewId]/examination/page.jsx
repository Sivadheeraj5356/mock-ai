"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
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
    const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId,interviewId))
    const jsonResponse = JSON.parse(result[0].jsonMockResp)
    setMockInterviewQuestions(jsonResponse)
    console.log(jsonResponse)
    setInterviewData(result[0])
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
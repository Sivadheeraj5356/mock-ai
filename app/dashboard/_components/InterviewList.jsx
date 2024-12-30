"use client"
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { desc, eq } from 'drizzle-orm';
import InterviewItemCard from './InterviewItemCard';

const InterviewList = () => {
    const { user } = useUser();
    const [interviewList, setInterviewList]= useState([])
     useEffect(()=>{
         user && GetInterviewList()
     },[user])
    const GetInterviewList=async()=>{
        const result = await db.select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(MockInterview.id))

        setInterviewList(result)
        console.log("result",result)
        console.log('user', user)
    }
  return (
    <div>
      {interviewList ?
      <>
           <h2 className='font-semibold text-xl text-primary'>Previous Mock Interview</h2>
           <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4'>
      {interviewList && interviewList.map((interview , index)=>(
        <InterviewItemCard
        interview={interview}
        key={index}/>
       
      ))}
    </div>
    </>
       :
       <></>
    }
    
    </div>
  )
}

export default InterviewList
"use client"
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs';
import InterviewItemCard from './InterviewItemCard';

const InterviewList = () => {
    const { user } = useUser();
    const [interviewList, setInterviewList]= useState([])
     useEffect(()=>{
         user && GetInterviewList()
     },[user])
    const GetInterviewList=async()=>{
        const res = await fetch('/api/interviews')
        if (!res.ok) return
        const result = await res.json()
        setInterviewList(result)
        console.log("result",result)
        console.log('user', user)
    }
  return (
    <div>
      {interviewList ?
      <>
           <h2 className='font-semibold text-xl'>Previous Mock Interview</h2>
           <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4'>
      {interviewList && interviewList.map((interview , index)=>(
        <InterviewItemCard
        interview={interview}
        key={index}/>
       
      ))}
    </div>
    </>
       :
       <>
       <div>
        </div></>
    }
    
    </div>
  )
}

export default InterviewList
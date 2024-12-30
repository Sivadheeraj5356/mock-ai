"use client"
import { db } from '@/utils/db'
import { Button } from '@/components/ui/button'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { ChevronsUpDown, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import { useRouter } from 'next/navigation'
  
const feedback = ({params}) => {
    const router = useRouter()
    const [feedbackList, setFeedbackList] = useState([])
    const [loading , setLoading] = useState(true)
    useEffect(()=>{
       Getfeeback()
    },[])
    const Getfeeback =async()=>{
       const unwrappedParams = await params

       const result = await db.select()
       .from(UserAnswer).where(eq(UserAnswer.mockIdRef, unwrappedParams.interviewId))
       .orderBy(UserAnswer.id)
    //    console.log(result)
    // const parsedResult = result.map(item => ({
    //     ...item,
    //     correctAns: JSON.parse(item.correctAns)
    //   }))

      setFeedbackList(result)
      setLoading(false)
    }
  return (
    <div className='p-8'>
        <h2 className='text-3xl font-bold'>Feedback of your Interview</h2>
        {/* <h2 className='text-2xl font-bold text-zinc-700'>Here is your Interview Feedback</h2> */}
        <h2 className='text-lg my-5'>
            Your overall interview rating
        </h2>
        <h2 className='text-base text-gray-500'>Find below Interview questions with correct answers, Your answers and feedback assesssed by AI </h2>
        {loading ? <>
          <div>
            <div className='h-20 w-full bg-secondary m-3 '></div>
            <div className='h-20 w-full bg-secondary m-3 '></div>
            <div className='h-20 w-full bg-secondary m-3 '></div>
            <div className='h-20 w-full bg-secondary m-3 '></div>
            <div className='h-20 w-full bg-secondary m-3 '></div>
            <div className='h-20 w-full bg-secondary m-3 '></div>
            <div className='h-20 w-full bg-secondary m-3 '></div>
          </div>
          
        </> 
        : 
        <>
        {feedbackList && feedbackList.map((item, index)=>(
          <Collapsible key={index} className='mt-6'>
          <CollapsibleTrigger className='p-2 bg-secondary rounded-lg my-2 text-left w-full'>
             <div className='flex justify-between gap-5'>
                {item?.question}
                <ChevronsUpDown className='h-7 w-5' />
             </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className='flex flex-col gap-2'>
                <h2 className='p-2 rounded-lg'> <strong>Your rating</strong> {item.rating}</h2>
                <h2 className='p-2 rounded-lg'> <strong>Your Feedback</strong> {item.feedback}</h2>               
                <h2 className='p-2 rounded-lg '><strong>Your Answer :</strong>{item.userAns}</h2>
                <h2 className='p-2 rounded-lg '><strong>Correct Answer :</strong>
                {item.correctAns?.description}
                {item.correctAns}   
                </h2>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        ))}
        </>
        }
        
        <Button onClick={()=>{
            router.replace('/dashboard')
        }}>Go Home</Button>
    </div>
  )
}

export default feedback
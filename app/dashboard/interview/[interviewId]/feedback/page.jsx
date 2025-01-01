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
    const [rating, setRating] = useState(0)
    useEffect(()=>{
       Getfeeback()
    },[])
    useEffect(() => {
      calculateRating();
    }, [feedbackList]);
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
    const calculateRating = () => {
      if (feedbackList.length > 0) {
        const totalRating = feedbackList.reduce(
          (acc, curr) => acc + Math.min(curr.rating || 0, 10), // Clamp each rating to a max of 10
          0
        );
        const overallRating = totalRating / feedbackList.length;
        setRating(Math.min(overallRating, 10).toFixed(1)); // Clamp overall rating to max 10
      }
    };
    
  return (
    <div className='max-sm:px-5 max-sm:pt-7 lg:p-8 h-max'>
        <h2 className='text-3xl font-bold'>Feedback of your Interview</h2>
        {/* <h2 className='text-2xl font-bold text-zinc-700'>Here is your Interview Feedback</h2> */}
        <h2 className='text-lg my-5'>
            Your overall interview rating is {rating}/ 10
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
        
        <Button className='dark:text-white text-lg p-7 mt-10' onClick={()=>{
            router.replace('/dashboard')
        }}>Go Home</Button>
    </div>
  )
}

export default feedback
import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
const InterviewItemCard = ({interview}) => {
    const router = useRouter()
  return (
    <div className='border shadow-sm rounded-lg p-4'>
     <h2 className='font-bold pt-1  uppercase'>Job Role : {interview?.jobPosition}</h2>
     <h2 className='text-base font-bold mt-1 text-gray-700 dark:text-white'>Years of Experience : {interview?.jobExperience}</h2>
     <h2 className='text-base mt-1 text-gray-500'>Job Description : {interview?.jobDesc}</h2>
     <h2 className='text-base mt-1 text-gray-500'>Created At : {interview.createdAt}</h2>
     
     <div className='flex justify-between mt-2 gap-5'>
        <Button size='sm'  className='w-full dark:bg-black text-white border-white'
        onClick={()=>{
            router.push("/dashboard/interview/"+interview?.mockId+"/feedback")
        }}
        >Feedback</Button>  
         <Button size='sm' className='w-full dark:bg-black text-white border-white'
         onClick={()=>{
            router.push("/dashboard/interview/"+interview?.mockId)
        }}
         > Start </Button>
        
     </div>
    </div>
  )
}

export default InterviewItemCard
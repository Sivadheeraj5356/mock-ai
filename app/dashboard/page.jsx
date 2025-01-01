import React from 'react'
import { UserButton, useUser } from '@clerk/nextjs'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'
import { redirect } from "next/navigation";

const Dashboard = () => {

  return (
    <div className='p-10 h-screen dark:bg-gray-900 dark:text-white '>
      <h2 className='font-bold text-2xl'>Dashboard</h2>
      <h2 className='text-gray-500'>Create and Start your AI Mockup Interview</h2>
       
       <div className='grid grid-cols-1 md:grid-cols-3 my-5'>
        <AddNewInterview></AddNewInterview>
       </div>
       <InterviewList></InterviewList>
    </div>
  )
}

export default Dashboard
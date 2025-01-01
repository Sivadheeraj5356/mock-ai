"use client"
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import React, { useEffect ,useState } from 'react'
import { eq } from 'drizzle-orm'
import Webcam from 'react-webcam'
import { LucideUserCircle, User2Icon, UserCheckIcon, UserCircle, UserCircle2, UserCircle2Icon, UserIcon, WebcamIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Loader } from 'lucide-react'
import { Lightbulb } from 'lucide-react'
import { useRouter } from 'next/navigation'

const Interview = ({params}) => {
  const router = useRouter();
  const [interviewId, setInterviewId] = useState(null);
  const[interviewData, setInterviewData] = useState()
  const [webcamEnabled , setWebcamEnabled] = useState(false)

  useEffect(() => {
    const fetchParams = async () => {
      const unwrappedParams = await params; 
      if (unwrappedParams && unwrappedParams.interviewId) {
        setInterviewId(unwrappedParams.interviewId);
        GetInterviewDetails(unwrappedParams.interviewId);
      }
    };
    fetchParams();
  }, [params]);

  const GetInterviewDetails=async(interviewId)=>{
    const result = await db.select().from(MockInterview)
    .where(eq(MockInterview.mockId,interviewId))
    setInterviewData(result[0])
  }

  return (
    <div className='h-screen my-10 px-16 dark:bg-gray-900 dark:text-white'> 
       <h2 className='font-bold text-2xl'>Lets Get Started</h2>
       <div className='grid grid-cols-1 md:grid-cols-2 gap-20'>
        
           {interviewData ?<div>
           <div className='flex flex-col my-5  gap-5'>
            <div className='flex flex-col p-5 rounded-lg border gap-5'>
           <h2 className='text-lg'><strong>Job Role/Position</strong><span className='capitalize font-bold'> : {interviewData.jobPosition}</span> </h2>
           <h2 className='text-lg'><strong>Job Description/Tech Stack</strong><span className='capitalize font-bold'> : {interviewData.jobDesc}</span> </h2>
           <h2 className='text-lg'><strong>Years of experience</strong><span className='capitalize font-bold'> : {interviewData.jobExperience}</span> </h2>
        </div>
        </div>
        <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100 dark:text-gray-900'>
           <h2 className='flex gap-2 items-center '> <Lightbulb></Lightbulb><strong>Information</strong></h2>
             <h2>Enable Video Web Cam and Microphone to the Interview
              <div> The Interview contains 10 questions and you will get report based upon your answers assesssed by AI </div>
              <div> You can also disable the webcam and microphone whenever you want</div>
              <div>Save your Answer before proceding to next question and you cant record or write answer at the same time</div>
              <div>Note : We never record your video , you can disable the webcam whenever you want</div>
           </h2>
        </div>
        </div>
        :
        <>
        <div className='flex flex-col my-7  gap-5'>
        <div className='flex justify-center items-center p-5 rounded-lg h-72 border gap-5'>
          <div>
         <div className='font-bold text-xl mt-10'>Loading Details ...</div>
         <div className='flex justify-center items-center'>
          <Loader className='animate-spin mt-5'></Loader>
         </div>
          </div>
          </div>
          </div>
        </>
      }
      <div>
             {webcamEnabled ?
             <div className='h-72 w-full my-7 p-20 relative bg-secondary overflow-hidden text-zinc-800 rounded-lg border'
                    style={{ width: '600px', height: '280px' }}>
                    <Webcam
                    onUserMediaError={() => {setWebcamEnabled(false)}}
                    mirrored={true}
                    onUserMedia={() => {setWebcamEnabled(true)}}
                    className="absolute inset-0"
                    style={{height:'100%', width:'100%', objectFit:'cover', transform: 'scale(-1,1)'}}
                    ></Webcam>
                    </div>
              : <> <UserCircle2 className='h-72 w-full my-7 p-20 bg-secondary text-zinc-800 rounded-lg border dark:text-white dark:bg-black' /> 
             
               </>
              }  
               {(!webcamEnabled) ? <Button className='md:ml-48 ml-10 dark:bg-black text-white border-white' onClick={()=>{setWebcamEnabled(true)}}>Enable Web Cam and Microphone</Button> 
              : <Button  className='ml-60 dark:bg-black text-white border-white'onClick={()=>{setWebcamEnabled(false)}}>Disable Web Cam</Button>} 
        </div>
      </div>    
      <div className='flex justify-end items-end'>
        <Button  onClick={()=>{
          router.push(`/dashboard/interview/${interviewId}/examination`)
        }} className='mt-10 text-xl p-7 dark:bg-black text-white border-white'>Start Interview</Button>
      </div>
    </div>
  )
}

export default Interview
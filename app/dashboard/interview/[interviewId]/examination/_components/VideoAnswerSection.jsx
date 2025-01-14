"use client"
import React from 'react'
import Webcam from 'react-webcam'
import { useState } from 'react'
import { UserCircle2 } from 'lucide-react'
import { IoVideocamOff } from "react-icons/io5";
import { CiVideoOn } from "react-icons/ci";
import { FaMicrophoneSlash ,FaMicrophone} from "react-icons/fa";

const RecordAns = () => {
    const[webcamEnabled , setWebcamEnabled] = useState(false)
  return (
    <div>
       { webcamEnabled ? 
       <>
       <div className='h-72 w-full my-7 p-20 relative bg-secondary overflow-hidden text-zinc-800 rounded-lg border'
       style={{ width: '600px', height: '280px' }}>
       <Webcam
       onUserMedia={() => {setWebcamEnabled(true)}}
       className="absolute inset-0"
       style={{height:'100%', width:'100%', objectFit:'cover', transform: 'scale(-1,1)'}}
       ></Webcam>
       </div>
      <div className='relative -top-20 left-[275px]'>
       <div className='bg-black text-white rounded-full p-2 w-12 h-12 cursor-pointer' onClick={()=>{setWebcamEnabled(false)}}>
       <CiVideoOn
       style={{height: 30, width: 30}}
       className='tex'></CiVideoOn>
       </div>
       </div>
      {/* <div className='relative -top-32 left-48'>
       <div className='bg-black text-white rounded-full p-2 w-12 h-12 cursor-pointer' onClick={()=>{}}>
       <FaMicrophone
       style={{height: 30, width: 30}}
       className='tex'></FaMicrophone>
       </div>
       </div> */}
       </>
        :
       <>
       <UserCircle2 className='h-72 w-full my-7 p-20 dark:text-white bg-secondary text-zinc-800 rounded-lg border' />
       <div className='relative -top-20 left-[275px]'>
       <div className='bg-red-600 rounded-full p-2 w-12 h-12 cursor-pointer' onClick={()=>{setWebcamEnabled(true)}}>
       <IoVideocamOff 
       style={{height: 30, width: 30}}
       className='text-black'></IoVideocamOff>
       </div>
       </div>
       {/* <div className='relative -top-32 left-48'>
       <div className='bg-red-600 rounded-full p-2 w-12 h-12 cursor-pointer' onClick={()=>{}}>
       <FaMicrophoneSlash
       style={{height: 30, width: 30}}
       className='text-black'></FaMicrophoneSlash>
       </div>
       </div> */}

       </>}
    </div>
  )
}

export default RecordAns
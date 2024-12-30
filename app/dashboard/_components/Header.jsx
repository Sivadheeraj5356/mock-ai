"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
const Header = () => {
    const path = usePathname();
    useEffect(()=>{
   console.log(path)
    },[])
  return (
    <div className='flex p-4 justify-between items-center bg-secondary shadow-md'>
       <div className='ml-10 flex gap-5'>
         {/* <Image src={'/logo.svg'} alt="logo" width={50} height={50} /> */}
         <div className='text-primary text-2xl font-bold'> Mock AI</div>
        </div>

        <ul className='hidden md:flex gap-12'>
            <li className={`hover:text-primary hover:font-bold transition-all text-lg cursor-pointer ${path =='/dashboard' && 'text-primary  font-bold'} `}>Dashboard</li>
            <li  className={`hover:text-primary hover:font-bold transition-all text-lg cursor-pointer ${path =='/dashboard/questions' && 'text-primary font-bold'} `}>Questions</li>
            <li className={`hover:text-primary hover:font-bold transition-all text-lg cursor-pointer ${path =='/dashboard/upgrade' && 'text-primary font-bold'} `}>Upgrade</li>
            <li className={`hover:text-primary hover:font-bold transition-all text-lg cursor-pointer ${path =='/dashboard/how-it-works' && 'text-primary font-bold'} `}>How it Works?</li>
        </ul>

        <UserButton></UserButton>
    </div>
  )
}

export default Header
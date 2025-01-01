"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { usePathname } from "next/navigation";
import Link from 'next/link';
import { ModeToggle } from '@/components/darkmode';

const Header = () => {
    const path = usePathname();
    useEffect(() => {
        console.log(path);
    }, []);

    return (
        <div className='flex p-4 justify-between items-center bg-secondary shadow-md dark:bg-gray-800'>
            <div className='ml-10 flex gap-5'>
                {/* <Image src={'/logo.svg'} alt="logo" width={50} height={50} /> */}
                <Link href={"/dashboard"}>
                    <div className='text-2xl font-bold cursor-pointer'>Mock AI</div>
                </Link>
            </div>

            <ul className='hidden md:flex gap-12'>
                <li className={`hover:font-bold transition-all text-lg cursor-pointer ${path == '/dashboard' && 'font-bold'}`}>
                    <Link href="/dashboard">Dashboard</Link>
                </li>
                <li className={`hover:font-bold transition-all text-lg cursor-pointer ${path == '/dashboard/questions' && 'font-bold'}`}>
                    <Link href="/#questions">Questions</Link>
                </li>
                <li className={`hover:font-bold transition-all text-lg cursor-pointer ${path == '/dashboard/upgrade' && 'font-bold'}`}>
                    <Link href="/dashboard/upgrade">Upgrade</Link>
                </li>
                <li className={`hover:font-bold transition-all text-lg cursor-pointer ${path == '/dashboard/how-it-works' && 'font-bold'}`}>
                    <Link href="/#how-it-works">How it Works?</Link>
                </li>
            </ul>
            <div className='flex justify-center items-center gap-10'>
                <ModeToggle />
                <UserButton />
            </div>
        </div>
    )
}

export default Header;
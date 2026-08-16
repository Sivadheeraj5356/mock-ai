"use client"
import React, { useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/utils/GeminiModel'
import { FileText, LoaderCircle, Upload, X } from 'lucide-react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { useRouter } from 'next/navigation'

const ACCEPTED_RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const ACCEPTED_RESUME_EXTENSIONS = '.pdf,.doc,.docx'
const MAX_RESUME_SIZE_MB = 5

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const AddNewInterview = () => {
  const [openDialog , setOpenDialog]= useState(false)
  const [jobPosition,setJobPosition]=useState();
  const [jobDesc,setJobDesc]=useState();
  const [jobExperience,setJobExperience]=useState();
  const [resumeFile, setResumeFile] = useState(null)
  const [resumeError, setResumeError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false);
  const [JsonResponse, setJsonResponse] = useState([])
  const resumeInputRef = useRef(null)
  
  const router =useRouter()
  const { user } = useUser()

  const resetForm = () => {
    setJobPosition(undefined)
    setJobDesc(undefined)
    setJobExperience(undefined)
    setResumeFile(null)
    setResumeError('')
    setIsDragging(false)
    if (resumeInputRef.current) resumeInputRef.current.value = ''
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    resetForm()
  }

  const validateAndSetResume = (file) => {
    if (!file) return

    const isAcceptedType =
      ACCEPTED_RESUME_TYPES.includes(file.type) ||
      /\.(pdf|doc|docx)$/i.test(file.name)

    if (!isAcceptedType) {
      setResumeError('Please upload a PDF, DOC, or DOCX file.')
      setResumeFile(null)
      return
    }

    if (file.size > MAX_RESUME_SIZE_MB * 1024 * 1024) {
      setResumeError(`File must be under ${MAX_RESUME_SIZE_MB} MB.`)
      setResumeFile(null)
      return
    }

    setResumeError('')
    setResumeFile(file)
  }

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0]
    validateAndSetResume(file)
  }

  const handleResumeDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    validateAndSetResume(file)
  }

  const clearResume = () => {
    setResumeFile(null)
    setResumeError('')
    if (resumeInputRef.current) resumeInputRef.current.value = ''
  }

  const onSubmit = async(e)=>{
    setLoading(true);
    e.preventDefault()
    console.log(jobPosition,jobDesc,jobExperience, resumeFile?.name)

    const InputPrompt = "job position - "+ jobPosition+", job description : data strucutres and algorithms"+jobDesc+" , job experience:"+jobExperience+" , depending on the above information give me total of "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+" questions from leetcode medium (2) and one leetcode hard(1) and job description related(7)(mix up the order of questions of both leetcode(and dont give me link of question, just give me the question , no need to say its from leetcode) and job description questions) interview style technical ,Generate a set of extremely challenging technical interview questions based on real-world problems that have appeared in actual software engineering interviews at top tech companies like Google, Meta, Amazon, Apple, and Microsoft. Each question should be designed to test deep understanding of algorithms, data structures, system design, or advanced computer science concepts. Ensure the problems require critical thinking and deep technical insight, with constraints and edge cases explicitly detailed. Focus on areas such as Advanced graph algorithms and theory Hard dynamic programming problems with optimization Distributed systems and scalability challenges Complex string manipulation and parsing problems Multi-threading and concurrency issues For each question, provide a brief problem statement, clear input/output format, and any relevant constraints. Ensure the problems are unique, non-trivial, and demand significant problem-solving skills to solve. questions mixing up the order with answers in json format and if the job description is sde-1 or sde-2 ask questions from topics oops, operating sysytem,computer networks, DBMS , give questions(total 10) and answers filled in json"
    const result = await chatSession.sendMessage(InputPrompt)
    const MockJsonResponse = (result.response.text()).replace('undefined','').replace('```json','').replace('```','')
    console.log(JSON.parse(MockJsonResponse))
    setJsonResponse(MockJsonResponse)
    setLoading(false)
    if(MockJsonResponse){
      const resp =await db.insert(MockInterview)
      .values({
           mockId:uuidv4(),
           jsonMockResp:MockJsonResponse,
           jobPosition :jobPosition,
           jobDesc : jobDesc ,
           jobExperience : jobExperience ,
           createdBy :user?.primaryEmailAddress?.emailAddress,
           createdAt: moment().format('DD-MM-YYYY')
      }).returning({mockId:MockInterview.mockId})
      console.log("Inserted Id:", resp)
      if(resp){
        setOpenDialog(false)
        resetForm()
        router.push('./dashboard/interview/'+resp[0]?.mockId)
      }
    }else{
      console.log("ERROR")
    }
   
  }
  return (
    <div>
        <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
         onClick={()=>
          setOpenDialog(true)
         }
        >
           <h2 className='font-bold text-lg'> + Start a New Interview</h2>
        </div>
         <Dialog open={openDialog} onOpenChange={(open) => {
           setOpenDialog(open)
           if (!open) resetForm()
         }}>
           <DialogContent className='max-w-2xl'>
             <DialogHeader>
               <DialogTitle className='font-bold text-2xl'> Tell us more about your job interview</DialogTitle>
               <DialogDescription>
                 Add details about your job position, experience, and optionally upload your resume
               </DialogDescription>
             </DialogHeader>
             <form onSubmit={onSubmit}>
                  <div>
                     <div className='mt-7 my-2'> 
                           <label>Job position/Job Role</label>
                           <Input placeholder='Ex. Full Stack Developer' required className='mt-2'
                           onChange={(e)=>{
                            setJobPosition(e.target.value)
                           }}
                           ></Input>
                     </div>
                     <div className='mt-5 my-2'> 
                           <label>Job Description</label>
                           <Textarea placeholder='Ex. Nextjs, React, Nodejs' required className='mt-2'
                           onChange={(e)=>{
                            setJobDesc(e.target.value)
                           }}
                           ></Textarea>
                     </div>
                     <div className='mt-5 my-2'> 
                           <label>Years of Experience</label>
                           <Input placeholder='Ex. 5' max='50' type='number' className='mt-2'
                           onChange={(e)=>{
                            setJobExperience(e.target.value)
                           }}
                           ></Input>
                     </div>
                     <div className='mt-5 my-2'>
                           <label className='flex items-center gap-2'>
                             Resume
                             <span className='text-xs font-normal text-muted-foreground'>(optional)</span>
                           </label>
                           <input
                             ref={resumeInputRef}
                             type='file'
                             accept={ACCEPTED_RESUME_EXTENSIONS}
                             className='hidden'
                             onChange={handleResumeChange}
                           />
                           {!resumeFile ? (
                             <div
                               role='button'
                               tabIndex={0}
                               onClick={() => resumeInputRef.current?.click()}
                               onKeyDown={(e) => {
                                 if (e.key === 'Enter' || e.key === ' ') {
                                   e.preventDefault()
                                   resumeInputRef.current?.click()
                                 }
                               }}
                               onDragOver={(e) => {
                                 e.preventDefault()
                                 setIsDragging(true)
                               }}
                               onDragLeave={() => setIsDragging(false)}
                               onDrop={handleResumeDrop}
                               className={`mt-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors ${
                                 isDragging
                                   ? 'border-primary bg-primary/5'
                                   : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100 dark:border-slate-600 dark:bg-gray-800/50 dark:hover:border-slate-500 dark:hover:bg-gray-800'
                               }`}
                             >
                               <div className='mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm dark:bg-gray-900'>
                                 <Upload className='h-5 w-5 text-slate-600 dark:text-slate-300' />
                               </div>
                               <p className='text-sm font-medium text-slate-700 dark:text-slate-200'>
                                 Drop your resume here, or{' '}
                                 <span className='underline underline-offset-2'>browse</span>
                               </p>
                               <p className='mt-1 text-xs text-muted-foreground'>
                                 PDF, DOC, or DOCX · up to {MAX_RESUME_SIZE_MB} MB
                               </p>
                             </div>
                           ) : (
                             <div className='mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-gray-900'>
                               <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-gray-800'>
                                 <FileText className='h-5 w-5 text-slate-600 dark:text-slate-300' />
                               </div>
                               <div className='min-w-0 flex-1'>
                                 <p className='truncate text-sm font-medium text-slate-800 dark:text-slate-100'>
                                   {resumeFile.name}
                                 </p>
                                 <p className='text-xs text-muted-foreground'>
                                   {formatFileSize(resumeFile.size)} · ready locally
                                 </p>
                               </div>
                               <Button
                                 type='button'
                                 variant='ghost'
                                 size='icon'
                                 className='shrink-0'
                                 onClick={clearResume}
                                 aria-label='Remove resume'
                               >
                                 <X className='h-4 w-4' />
                               </Button>
                             </div>
                           )}
                           {resumeError ? (
                             <p className='mt-2 text-xs text-red-500'>{resumeError}</p>
                           ) : null}
                     </div>
                  </div>
                 <div className='flex gap-5 justify-end mt-5'>
                   <Button type='button' className='font-semibold text-white dark:bg-gray-900 border-white border-2' onClick={handleCloseDialog}>Cancel</Button>
                   <Button type='submit' className='dark:bg-gray-900 text-white border-white border-2' disabled={loading}>
                    {loading ? <><LoaderCircle className='animate-spin'></LoaderCircle> Generating from AI</>:<div>Start Interview</div>}
                    </Button>
                 </div>
             </form>
           </DialogContent>
         </Dialog>

    </div>
  )
}

export default AddNewInterview
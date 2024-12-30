"use client"
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/utils/GeminiModel'
import { LoaderCircle } from 'lucide-react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { useRouter } from 'next/navigation'

const AddNewInterview = () => {
  const [openDialog , setOpenDialog]= useState(false)
  const [jobPosition,setJobPosition]=useState();
  const [jobDesc,setJobDesc]=useState();
  const [jobExperience,setJobExperience]=useState();
  const [loading, setLoading] = useState(false);
  const [JsonResponse, setJsonResponse] = useState([])
  
  const router =useRouter()
  const { user } = useUser()
  const onSubmit = async(e)=>{
    setLoading(true);
    e.preventDefault()
    console.log(jobPosition,jobDesc,jobExperience)

    const InputPrompt = "job position - "+ jobPosition+", job description : data strucutres and algorithms"+jobDesc+" , job experience:"+jobExperience+" , depending on the above information give me total of "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+" questions from leetcode medium (3) and one leetcode hard(2) and job description related(5) interview style questions mixing up the order with answers in json format and if the job description is sde-1 or sde-2 ask questions from topics oops, operating sysytem,computer networks, DBMS , give questions and answers filled in json"
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
           <h2 className='font-bold text-lg'> + Add New</h2>
        </div>
         <Dialog open={openDialog}>
           <DialogContent className='max-w-2xl'>
             <DialogHeader>
               <DialogTitle className='font-bold text-2xl'> Tell us more about your job interview</DialogTitle>
               <DialogDescription>
                <form onSubmit={onSubmit}>
                  <div>
                  <h2>Add Details about your job position , job description and years of experience</h2> 
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
                  </div>
                 <div className='flex gap-5 justify-end mt-5'>
                   <Button type='button' variant="ghost" className='font-bold text-black' onClick={()=>setOpenDialog(false)}>Cancel</Button>
                   <Button type='submit' disabled={loading}>
                    {loading ? <><LoaderCircle className='animate-spin'></LoaderCircle> Generating from AI</>:'Start Interview'}
                    </Button>
                 </div>
                 </form>
               </DialogDescription>
             </DialogHeader>
           </DialogContent>
         </Dialog>

    </div>
  )
}

export default AddNewInterview
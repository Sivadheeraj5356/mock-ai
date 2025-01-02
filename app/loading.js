import { Loader2 } from 'lucide-react'
import React from 'react'

const loading = () => {
  return (
    <div className='flex justify-center items-center min-h-screen'>
     <Loader2 className='animate-spin' size={100} />
    </div>
  )
}

export default loading
import React from 'react'
import Link from 'next/link'

const Upgrade = () => {
  return (
    <div className='p-10 dark:text-white min-h-screen'>
      <div className="mx-auto max-w-2xl text-center mt-16">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Paid plans are not available yet</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Mock AI is in an early test release. Everything currently on the site is free to use,
          and no payment methods are accepted. Paid plans will be announced here before any
          charge exists.
        </p>
        <Link href="/dashboard" className="inline-block mt-8 rounded-lg bg-primary px-6 py-3 text-white hover:opacity-90">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default Upgrade

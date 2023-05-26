'use client'
import Auth from '@/components/auth'
import Image from 'next/image'
import { useState } from 'react'

export default function Home() {

  //props drilling bad I know
  const [role, setRole] = useState<string>('')

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>hello world</h1>
      <Auth setRole={setRole}></Auth>
    </main>
  )
}

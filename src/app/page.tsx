'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Ana sayfayı search sayfasına yönlendir
    router.replace('/search')
  }, [router])

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-lg text-gray-300">Yönlendiriliyor...</div>
    </div>
  )
}

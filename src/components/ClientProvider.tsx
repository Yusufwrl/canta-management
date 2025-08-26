'use client'

import dynamic from 'next/dynamic'
import { ReactNode } from 'react'

const AppProvider = dynamic(
  () => import('@/contexts/AppContext').then(mod => ({ default: mod.AppProvider })),
  { ssr: false }
)

interface ClientProviderProps {
  children: ReactNode
}

export default function ClientProvider({ children }: ClientProviderProps) {
  return <AppProvider>{children}</AppProvider>
}

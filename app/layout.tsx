// app/layout.tsx
import '../styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Periskope Chat',
  description: 'Real-time chat app using Supabase, Next.js, and Tailwind CSS',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className + ' bg-gray-100 text-gray-900'}>
        {children}
      </body>
    </html>
  )
}

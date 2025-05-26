// app/page.tsx
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Link href="/login" className="text-blue-600 underline">
        Go to Login
      </Link>
    </div>
  )
}

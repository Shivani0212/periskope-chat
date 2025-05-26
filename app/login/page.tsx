'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) {
      setError(error.message)
    } else {
      alert('Check your email for the login link!')
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Login</h1>
      <input
        type="email"
        value={email}
        placeholder="you@example.com"
        onChange={(e) => setEmail(e.target.value)}
        className="border px-4 py-2"
      />
      <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 ml-2">
        Send Login Link
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}

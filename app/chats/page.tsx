'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import ChatList from '@/components/ChatList'
import ChatWindow from '@/components/ChatWindow'
import ChatInput from '@/components/ChatInput'
import { useRouter } from 'next/navigation'

export default function ChatsPage() {
  const [chatId, setChatId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        router.push('/login') // redirect to login if not authenticated
        return
      }

      setUserId(user.id)
    }

    fetchUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!userId) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 border-b border-gray-300 bg-white">
        <h1 className="text-xl font-semibold">Periskope Chat</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Main Chat Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat List */}
        <div className="w-1/3 border-r border-gray-300 overflow-y-auto">
          <ChatList onSelect={setChatId} selectedChatId={chatId} />
        </div>

        {/* Chat View */}
        <div className="flex flex-col flex-1">
          <ChatWindow chatId={chatId} userId={userId} />
          <ChatInput chatId={chatId} userId={userId} />
        </div>
      </div>
    </div>
  )
}

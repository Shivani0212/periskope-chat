'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import ChatList from '@/components/ChatList'
import ChatWindow from '@/components/ChatWindow'
import ChatInput from '@/components/ChatInput'
import NewChatForm from '@/components/NewChatForm'

export default function ChatsPage() {
  const [user, setUser] = useState<any>(null)
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      else setUser(user)
    })
  }, [router])

  if (!user) return <p>Loading...</p>

  return (
    <div className="flex h-screen">
      {/* Sidebar: List of Chats */}
      <div className="w-1/4 border-r">
        <ChatList onSelect={setSelectedChatId} />
        <NewChatForm currentUserId={user.id} onChatCreated={() => {}} />
      </div>

      {/* Chat Content Area */}
      <div className="flex flex-col flex-1">
        {selectedChatId ? (
          <>
            <div className="flex-1 overflow-y-auto">
              <ChatWindow chatId={selectedChatId} />
            </div>
            <ChatInput chatId={selectedChatId} senderId={user.id} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  )
}

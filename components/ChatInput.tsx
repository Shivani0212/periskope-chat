'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface ChatInputProps {
  chatId: string | null
  userId: string
}

export default function ChatInput({ chatId, userId }: ChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSend = async () => {
    if (!message.trim() || !chatId) return

    const { error } = await supabase.from('messages').insert([
      {
        chat_id: chatId,
        sender_id: userId,
        content: message.trim(),
      },
    ])

    if (!error) {
      setMessage('')
    } else {
      console.error('Send failed:', error.message)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  return (
    <div className="p-2 border-t border-gray-300 flex items-center">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-l focus:outline-none"
      />
      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
      >
        Send
      </button>
    </div>
  )
}

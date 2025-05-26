'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface ChatInputProps {
  chatId: string
  senderId: string
}

export default function ChatInput({ chatId, senderId }: ChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) return

    const { error } = await supabase.from('messages').insert([
      {
        content: message,
        sender_id: senderId,
        chat_id: chatId,
      },
    ])

    if (error) {
      console.error('Error sending message:', error)
    } else {
      setMessage('') // clear input
    }
  }

  return (
    <form onSubmit={handleSend} className="flex items-center border-t p-3 bg-white">
      <input
        type="text"
        className="flex-1 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Send
      </button>
    </form>
  )
}

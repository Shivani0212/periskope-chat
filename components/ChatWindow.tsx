'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Message {
  id: string
  content: string
  sender_id: string
  created_at: string
}

interface ChatWindowProps {
  chatId: string | null
  userId: string
}

export default function ChatWindow({ chatId, userId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!chatId) return

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })

      if (!error && data) {
        setMessages(data)
      }
    }

    fetchMessages()

    const channel = supabase
      .channel(`realtime:messages:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [chatId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a chat to view messages
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`mb-2 p-2 rounded-lg max-w-xs ${
            msg.sender_id === userId
              ? 'ml-auto bg-blue-500 text-white'
              : 'mr-auto bg-gray-200 text-black'
          }`}
        >
          <p className="text-sm">{msg.content}</p>
          <p className="text-xs text-right text-gray-400">{new Date(msg.created_at).toLocaleTimeString()}</p>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}

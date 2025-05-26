'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Message {
  id: string
  content: string
  sender_id: string
  created_at: string
}

interface ChatWindowProps {
  chatId: string
}

export default function ChatWindow({ chatId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    if (!chatId) return

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error loading messages:', error)
        return
      }

      setMessages(data || [])
    }

    loadMessages()

    const messageSubscription = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(messageSubscription)
    }
  }, [chatId])

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {messages.length === 0 ? (
        <p className="text-gray-400 text-center">No messages yet.</p>
      ) : (
        messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <p className="text-sm text-gray-500">
              {msg.sender_id} • {new Date(msg.created_at).toLocaleTimeString()}
            </p>
            <p className="text-base">{msg.content}</p>
          </div>
        ))
      )}
    </div>
  )
}

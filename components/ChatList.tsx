'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Chat {
  id: string
  title: string
}

interface ChatListProps {
  onSelect: (chatId: string) => void
  selectedChatId: string | null
}

export default function ChatList({ onSelect, selectedChatId }: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchChats = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) return

      const { data, error } = await supabase
        .from('chat_members')
        .select('chat_id, chats(title)')
        .eq('user_id', user.id)

      if (!error && data) {
        const formatted = data.map((item: any) => ({
          id: item.chat_id,
          title: item.chats?.title || 'Untitled Chat',
        }))
        setChats(formatted)
      }
    }

    fetchChats()

    const channel = supabase
      .channel('realtime:chat_members')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_members' },
        () => fetchChats()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="w-full p-3 border-r h-full overflow-y-auto">
      <input
        type="text"
        placeholder="Search chats"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <ul className="space-y-1">
        {filteredChats.map((chat) => (
          <li
            key={chat.id}
            onClick={() => onSelect(chat.id)}
            className={`cursor-pointer p-2 rounded hover:bg-gray-200 ${
              chat.id === selectedChatId ? 'bg-gray-300 font-semibold' : ''
            }`}
          >
            {chat.title}
          </li>
        ))}
      </ul>
    </div>
  )
}

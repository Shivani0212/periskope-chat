'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Chat {
  id: string
  title: string
}

interface ChatListProps {
  onSelect: (chatId: string) => void
}

export default function ChatList({ onSelect }: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>([])
  const [search, setSearch] = useState('')
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchChats = async () => {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser()
      if (userError || !user) return

      setUserId(user.id)

      const { data, error } = await supabase
        .from('chat_members')
        .select('chat_id, chats(title)')
        .eq('user_id', user.id)

      if (!error && data) {
        const formatted = data.map((item) => ({
          id: item.chat_id,
          title: item.chats?.title || 'Untitled Chat'
        }))
        setChats(formatted)
      }
    }

    fetchChats()
  }, [])

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="h-full flex flex-col p-2">
      <input
        type="text"
        placeholder="Search chats"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-2 p-2 border border-gray-300 rounded"
      />
      <ul className="space-y-1 overflow-y-auto">
        {filteredChats.map((chat) => (
          <li
            key={chat.id}
            onClick={() => onSelect(chat.id)}
            className="cursor-pointer p-2 hover:bg-gray-100 rounded"
          >
            {chat.title}
          </li>
        ))}
      </ul>
    </div>
  )
}

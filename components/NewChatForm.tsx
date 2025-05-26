'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Props {
  currentUserId: string
  onChatCreated: () => void
}

export default function NewChatForm({ currentUserId, onChatCreated }: Props) {
  const [title, setTitle] = useState('')
  const [creating, setCreating] = useState(false)

  const createChat = async () => {
    if (!title.trim()) return

    setCreating(true)

    const { data: chat, error } = await supabase
      .from('chats')
      .insert({ title })
      .select()
      .single()

    if (error || !chat) {
      console.error('Failed to create chat:', error)
      setCreating(false)
      return
    }

    const { error: memberError } = await supabase
      .from('chat_members')
      .insert({ chat_id: chat.id, user_id: currentUserId })

    if (memberError) {
      console.error('Failed to add member:', memberError)
    }

    setCreating(false)
    setTitle('')
    onChatCreated()
  }

  return (
    <div className="p-4 border-t border-gray-200">
      <h2 className="text-lg font-semibold mb-2">New Chat</h2>
      <input
        type="text"
        placeholder="Chat title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      <button
        onClick={createChat}
        disabled={creating}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {creating ? 'Creating...' : 'Create Chat'}
      </button>
    </div>
  )
}

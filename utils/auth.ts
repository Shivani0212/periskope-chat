// utils/auth.ts
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabaseClient'

export async function getCurrentUserId(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user?.id ?? ''
}

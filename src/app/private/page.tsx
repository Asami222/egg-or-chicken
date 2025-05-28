import { redirect } from 'next/navigation'
import { client as supabase } from 'libs/supabase/client';
export default async function PrivatePage() {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }
  return <p>Hello {data.user.email}</p>
}
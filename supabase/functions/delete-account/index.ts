import { createClient } from 'npm:@supabase/supabase-js'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }
  const authHeader = req.headers.get('Authorization') || ''
  const token = authHeader.replace(/^Bearer\s+/i, '')
  if (!token) {
    return new Response(JSON.stringify({ error: 'Missing authorization token' }), { status: 401 })
  }
  const { data: { user }, error: userError } = await supabase.auth.getUser(token)
  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Invalid or expired token' }), { status: 401 })
  }
  const { error } = await supabase.auth.admin.deleteUser(user.id)
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }
  return new Response(JSON.stringify({ ok: true }), { status: 200 })
})
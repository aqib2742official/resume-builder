import { auth } from '@/lib/auth'

export async function requireAdmin() {
  const session = await auth()
  if (!session) return { error: Response.json({ error: 'Unauthorized' }, { status: 401 }), session: null }
  if (session.user.role !== 'admin' && session.user.role !== 'super_admin') {
    return { error: Response.json({ error: 'Forbidden' }, { status: 403 }), session: null }
  }
  return { error: null, session }
}

export async function requireSuperAdmin() {
  const session = await auth()
  if (!session) return { error: Response.json({ error: 'Unauthorized' }, { status: 401 }), session: null }
  if (session.user.role !== 'super_admin') {
    return { error: Response.json({ error: 'Forbidden — super admin only' }, { status: 403 }), session: null }
  }
  return { error: null, session }
}

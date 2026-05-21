import { NextRequest, NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/adminAuth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

type Params = { params: Promise<{ id: string }> }

export async function PUT(_req: NextRequest, { params }: Params) {
  const { error, session } = await requireSuperAdmin()
  if (error) return error

  const { id } = await params

  if (id === session!.user.id) {
    return NextResponse.json({ error: 'Cannot change your own role' }, { status: 400 })
  }

  await connectDB()
  const user = await User.findById(id)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (user.role === 'super_admin') {
    return NextResponse.json({ error: 'Cannot change super admin role' }, { status: 403 })
  }

  user.role = user.role === 'admin' ? 'user' : 'admin'
  await user.save()

  return NextResponse.json({ role: user.role })
}

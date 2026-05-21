import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

type Params = { params: Promise<{ id: string }> }

export async function PUT(_req: NextRequest, { params }: Params) {
  const { error, session } = await requireAdmin()
  if (error) return error

  const { id } = await params

  if (id === session!.user.id) {
    return NextResponse.json({ error: 'Cannot disable your own account' }, { status: 400 })
  }

  await connectDB()
  const user = await User.findById(id)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (user.role === 'admin' || user.role === 'super_admin') return NextResponse.json({ error: 'Cannot disable admin accounts' }, { status: 403 })

  user.disabled = !user.disabled
  await user.save()

  return NextResponse.json({ disabled: user.disabled })
}

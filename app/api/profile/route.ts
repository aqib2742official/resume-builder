import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { z } from 'zod'

const UpdateSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  phone:    z.string().min(7).regex(/^[+\d\s\-()]{7,20}$/, 'Invalid phone number').optional(),
  gender:   z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  avatar:   z.string().optional(),
  location: z.string().optional(),
})

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const user = await User.findById(session.user.id).select('-password').lean()
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  return NextResponse.json({ user })
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = UpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Validation error' }, { status: 400 })
  }

  await connectDB()
  const user = await User.findByIdAndUpdate(
    session.user.id,
    { $set: parsed.data },
    { new: true }
  ).select('-password').lean()

  return NextResponse.json({ user })
}

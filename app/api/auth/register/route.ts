import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { logActivity } from '@/lib/activityLog'

const RegisterSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email:    z.email('Invalid email address'),
  phone:    z.string().min(7, 'Phone number is required').regex(/^[+\d\s\-()]{7,20}$/, 'Invalid phone number'),
  gender:   z.enum(['male', 'female', 'other', 'prefer_not_to_say']),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  avatar:   z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = RegisterSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Validation error' },
        { status: 400 }
      )
    }

    const { fullName, email, phone, gender, password, avatar } = parsed.data

    await connectDB()

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      phone,
      gender,
      password: hashed,
      avatar: avatar ?? '',
      role: 'user',
    })

    await logActivity(user._id.toString(), 'signup', { email: user.email })

    return NextResponse.json({
      message: 'Account created successfully',
      user: { id: user._id.toString(), email: user.email, fullName: user.fullName },
    }, { status: 201 })

  } catch (err) {
    console.error('[register]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

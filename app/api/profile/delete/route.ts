import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import Resume from '@/models/Resume'
import CoverLetter from '@/models/CoverLetter'
import Job from '@/models/Job'
import bcrypt from 'bcryptjs'

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (session.user.role === 'admin' || session.user.role === 'super_admin') {
    return NextResponse.json({ error: 'Admin accounts cannot be self-deleted. Contact another admin.' }, { status: 403 })
  }

  const { password } = await req.json()
  if (!password) return NextResponse.json({ error: 'Password is required to confirm deletion' }, { status: 400 })

  await connectDB()
  const user = await User.findById(session.user.id)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return NextResponse.json({ error: 'Password is incorrect' }, { status: 400 })

  await Promise.all([
    User.deleteOne({ _id: session.user.id }),
    Resume.deleteMany({ userId: session.user.id }),
    CoverLetter.deleteMany({ userId: session.user.id }),
    Job.deleteMany({ userId: session.user.id }),
  ])

  return NextResponse.json({ message: 'Account deleted' })
}

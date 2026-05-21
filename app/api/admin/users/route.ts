import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  await connectDB()

  const users = await User.find({})
    .select('-password')
    .sort({ createdAt: -1 })
    .lean()

  return NextResponse.json({ users })
}

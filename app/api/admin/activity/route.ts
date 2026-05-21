import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import { connectDB } from '@/lib/mongodb'
import ActivityLog from '@/models/ActivityLog'

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const { searchParams } = new URL(req.url)
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100)

  await connectDB()

  const activity = await ActivityLog.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'fullName email avatar')
    .lean()

  return NextResponse.json({ activity })
}

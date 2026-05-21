import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import Resume from '@/models/Resume'
import CoverLetter from '@/models/CoverLetter'
import Job from '@/models/Job'
import ActivityLog from '@/models/ActivityLog'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id } = await params
  await connectDB()

  const [user, resumes, coverLetters, jobs, activity] = await Promise.all([
    User.findById(id).select('-password').lean(),
    Resume.find({ userId: id }).select('name updatedAt completenessScore').sort({ updatedAt: -1 }).lean(),
    CoverLetter.find({ userId: id }).select('name updatedAt').sort({ updatedAt: -1 }).lean(),
    Job.find({ userId: id }).select('company role status appliedDate').sort({ createdAt: -1 }).lean(),
    ActivityLog.find({ userId: id }).sort({ createdAt: -1 }).limit(20).lean(),
  ])

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  return NextResponse.json({ user, resumes, coverLetters, jobs, activity })
}

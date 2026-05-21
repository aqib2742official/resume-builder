import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import Resume from '@/models/Resume'
import CoverLetter from '@/models/CoverLetter'
import Job from '@/models/Job'

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  await connectDB()

  const [totalUsers, totalResumes, totalCoverLetters, totalJobs] = await Promise.all([
    User.countDocuments(),
    Resume.countDocuments(),
    CoverLetter.countDocuments(),
    Job.countDocuments(),
  ])

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })

  return NextResponse.json({ totalUsers, totalResumes, totalCoverLetters, totalJobs, newUsersThisMonth })
}

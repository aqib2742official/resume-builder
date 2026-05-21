import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Job from '@/models/Job'
import { logActivity } from '@/lib/activityLog'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const jobs = await Job.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean()

  return NextResponse.json({ jobs })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  await connectDB()

  const job = await Job.create({
    userId: session.user.id,
    company:       body.company ?? '',
    role:          body.role ?? '',
    location:      body.location ?? '',
    appliedDate:   body.appliedDate ?? '',
    status:        body.status ?? 'wishlist',
    resumeId:      body.resumeId ?? null,
    coverLetterId: body.coverLetterId ?? null,
    notes:         body.notes ?? '',
    url:           body.url ?? '',
  })

  await logActivity(session.user.id, 'job_added', { company: job.company, role: job.role })

  return NextResponse.json({ job }, { status: 201 })
}

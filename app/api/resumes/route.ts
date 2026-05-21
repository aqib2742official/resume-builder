import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Resume from '@/models/Resume'
import { logActivity } from '@/lib/activityLog'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const resumes = await Resume.find({ userId: session.user.id })
    .sort({ updatedAt: -1 })
    .lean()

  return NextResponse.json({ resumes })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  await connectDB()

  const now = new Date()
  const resume = await Resume.create({
    userId: session.user.id,
    name: body.name ?? 'My Resume',
    template: body.template ?? 'classic',
    data: body.data ?? {},
    theme: body.theme ?? {},
    completenessScore: body.completenessScore ?? 0,
    versions: [{
      versionId: crypto.randomUUID(),
      label: 'v1',
      data: body.data ?? {},
      theme: body.theme ?? {},
      savedAt: now,
    }],
  })

  await logActivity(session.user.id, 'resume_saved', { name: resume.name })

  return NextResponse.json({ resume }, { status: 201 })
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Resume from '@/models/Resume'
import { logActivity } from '@/lib/activityLog'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await connectDB()

  const resume = await Resume.findOne({ _id: id, userId: session.user.id }).lean()
  if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ resume })
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  await connectDB()

  const existing = await Resume.findOne({ _id: id, userId: session.user.id })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Append new version if data changed
  if (body.data) {
    const MAX_VERSIONS = 10
    const newVersion = {
      versionId: crypto.randomUUID(),
      label: `v${(existing.versions?.length ?? 0) + 1}`,
      data: body.data,
      theme: body.theme ?? existing.theme,
      savedAt: new Date(),
    }
    const versions = [...(existing.versions ?? []), newVersion].slice(-MAX_VERSIONS)
    body.versions = versions
  }

  const updated = await Resume.findOneAndUpdate(
    { _id: id, userId: session.user.id },
    { $set: { ...body, updatedAt: new Date() } },
    { new: true }
  ).lean()

  return NextResponse.json({ resume: updated })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await connectDB()

  const result = await Resume.deleteOne({ _id: id, userId: session.user.id })
  if (result.deletedCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await logActivity(session.user.id, 'resume_deleted', { resumeId: id })

  return NextResponse.json({ message: 'Deleted' })
}

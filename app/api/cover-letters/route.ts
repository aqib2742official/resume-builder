import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import CoverLetter from '@/models/CoverLetter'
import { logActivity } from '@/lib/activityLog'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const letters = await CoverLetter.find({ userId: session.user.id })
    .sort({ updatedAt: -1 })
    .lean()

  return NextResponse.json({ letters })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  await connectDB()

  const letter = await CoverLetter.create({
    userId: session.user.id,
    resumeId: body.resumeId ?? null,
    name: body.name ?? 'Cover Letter',
    recipientName: body.recipientName ?? '',
    companyName: body.companyName ?? '',
    jobTitle: body.jobTitle ?? '',
    body: body.body ?? '',
  })

  await logActivity(session.user.id, 'cover_letter_saved', { name: letter.name })

  return NextResponse.json({ letter }, { status: 201 })
}

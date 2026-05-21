import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Resume from '@/models/Resume'

type Params = { params: Promise<{ id: string }> }

// POST — set this resume as the single favorite (unsets all others)
export async function POST(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await connectDB()

  const userId = session.user.id

  // Verify ownership
  const resume = await Resume.findOne({ _id: id, userId })
  if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Unset all favorites for this user, then set this one
  await Resume.updateMany({ userId }, { $set: { isFavorite: false } })
  await Resume.findByIdAndUpdate(id, { $set: { isFavorite: true } })

  return NextResponse.json({ ok: true })
}

// DELETE — remove favorite from this resume
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await connectDB()

  await Resume.findOneAndUpdate({ _id: id, userId: session.user.id }, { $set: { isFavorite: false } })

  return NextResponse.json({ ok: true })
}

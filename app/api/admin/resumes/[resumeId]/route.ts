import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import { connectDB } from '@/lib/mongodb'
import Resume from '@/models/Resume'

type Params = { params: Promise<{ resumeId: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { error } = await requireAdmin()
  if (error) return error

  const { resumeId } = await params
  await connectDB()

  const resume = await Resume.findById(resumeId).lean()
  if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ resume })
}

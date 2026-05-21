import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Job from '@/models/Job'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await connectDB()

  const job = await Job.findOne({ _id: id, userId: session.user.id }).lean()
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ job })
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  await connectDB()

  const updated = await Job.findOneAndUpdate(
    { _id: id, userId: session.user.id },
    { $set: { ...body, updatedAt: new Date() } },
    { new: true }
  ).lean()

  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ job: updated })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await connectDB()

  const result = await Job.deleteOne({ _id: id, userId: session.user.id })
  if (result.deletedCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ message: 'Deleted' })
}

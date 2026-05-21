import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import Resume from '@/models/Resume'
import CoverLetter from '@/models/CoverLetter'
import Job from '@/models/Job'

type Params = { params: Promise<{ id: string }> }

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { error, session } = await requireAdmin()
  if (error) return error

  const { id } = await params

  if (id === session!.user.id) {
    return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
  }

  await connectDB()

  const user = await User.findById(id)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Regular admins cannot delete other admins or super_admins
  if (session!.user.role === 'admin' && (user.role === 'admin' || user.role === 'super_admin')) {
    return NextResponse.json({ error: 'Cannot delete admin accounts' }, { status: 403 })
  }
  // Super admins cannot delete other super_admins
  if (user.role === 'super_admin') {
    return NextResponse.json({ error: 'Cannot delete super admin accounts' }, { status: 403 })
  }

  await Promise.all([
    User.deleteOne({ _id: id }),
    Resume.deleteMany({ userId: id }),
    CoverLetter.deleteMany({ userId: id }),
    Job.deleteMany({ userId: id }),
  ])

  return NextResponse.json({ message: 'User and all associated data deleted' })
}

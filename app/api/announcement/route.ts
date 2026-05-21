import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import SystemSettings from '@/models/SystemSettings'

export async function GET() {
  try {
    await connectDB()
    const row = await SystemSettings.findOne({ key: 'announcement' }).lean()
    const text = (row?.value as string) ?? ''
    return NextResponse.json({ announcement: text }, {
      headers: { 'Cache-Control': 'public, max-age=60' },
    })
  } catch {
    return NextResponse.json({ announcement: '' })
  }
}

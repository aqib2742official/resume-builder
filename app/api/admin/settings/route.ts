import { NextRequest, NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/adminAuth'
import { connectDB } from '@/lib/mongodb'
import SystemSettings from '@/models/SystemSettings'
import { DEFAULT_SETTINGS, type SettingsMap } from '@/models/SystemSettings'

async function getAllSettings(): Promise<SettingsMap> {
  const rows = await SystemSettings.find({}).lean()
  const result = { ...DEFAULT_SETTINGS } as SettingsMap
  for (const row of rows) {
    (result as unknown as Record<string, unknown>)[row.key] = row.value
  }
  return result
}

export async function GET() {
  const { error } = await requireSuperAdmin()
  if (error) return error

  await connectDB()
  const settings = await getAllSettings()
  return NextResponse.json({ settings })
}

export async function PUT(req: NextRequest) {
  const { error } = await requireSuperAdmin()
  if (error) return error

  const body: Partial<SettingsMap> = await req.json()
  await connectDB()

  await Promise.all(
    Object.entries(body).map(([key, value]) =>
      SystemSettings.findOneAndUpdate({ key }, { value }, { upsert: true, new: true })
    )
  )

  const settings = await getAllSettings()
  return NextResponse.json({ settings })
}

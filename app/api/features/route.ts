import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import SystemSettings from '@/models/SystemSettings'
import { DEFAULT_FEATURE_FLAGS, type FeatureFlags } from '@/lib/settingsTypes'

export async function GET() {
  try {
    await connectDB()
    const row = await SystemSettings.findOne({ key: 'features' }).lean() as { value?: FeatureFlags } | null
    const features: FeatureFlags = row?.value
      ? { ...DEFAULT_FEATURE_FLAGS, ...(row.value as object) }
      : DEFAULT_FEATURE_FLAGS
    return NextResponse.json({ features }, {
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' },
    })
  } catch {
    return NextResponse.json({ features: DEFAULT_FEATURE_FLAGS })
  }
}

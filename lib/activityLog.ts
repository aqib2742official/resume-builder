import { connectDB } from '@/lib/mongodb'
import ActivityLog, { type ActivityAction } from '@/models/ActivityLog'

export async function logActivity(
  userId: string,
  action: ActivityAction,
  meta: Record<string, unknown> = {}
): Promise<void> {
  try {
    await connectDB()
    await ActivityLog.create({ userId, action, meta })
  } catch {
    // Non-critical — never break the main request
  }
}

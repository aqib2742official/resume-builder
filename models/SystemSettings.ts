import mongoose, { Document, Model, Schema } from 'mongoose'

export type { SettingsMap } from '@/lib/settingsTypes'
export { DEFAULT_SETTINGS } from '@/lib/settingsTypes'

export interface ISystemSettings extends Document {
  key: string
  value: unknown
  updatedAt: Date
}

const SystemSettingsSchema = new Schema<ISystemSettings>(
  {
    key:   { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
)

const SystemSettings: Model<ISystemSettings> =
  mongoose.models.SystemSettings ??
  mongoose.model<ISystemSettings>('SystemSettings', SystemSettingsSchema)

export default SystemSettings

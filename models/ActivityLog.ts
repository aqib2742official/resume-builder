import mongoose, { Document, Model, Schema, Types } from 'mongoose'

export type ActivityAction =
  | 'signup'
  | 'resume_saved'
  | 'resume_deleted'
  | 'cover_letter_saved'
  | 'job_added'

export interface IActivityLog extends Document {
  userId: Types.ObjectId
  action: ActivityAction
  meta: Record<string, unknown>
  createdAt: Date
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    action: {
      type: String,
      enum: ['signup', 'resume_saved', 'resume_deleted', 'cover_letter_saved', 'job_added'],
      required: true,
    },
    meta: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

const ActivityLog: Model<IActivityLog> =
  mongoose.models.ActivityLog ?? mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema)
export default ActivityLog

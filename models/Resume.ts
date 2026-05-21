import mongoose, { Document, Model, Schema, Types } from 'mongoose'

export interface IResumeVersion {
  versionId: string
  label: string
  data: Record<string, unknown>
  theme: Record<string, unknown>
  savedAt: Date
}

export interface IResume extends Document {
  userId: Types.ObjectId
  name: string
  template: string
  data: Record<string, unknown>
  theme: Record<string, unknown>
  versions: IResumeVersion[]
  completenessScore: number
  isFavorite: boolean
  createdAt: Date
  updatedAt: Date
}

const VersionSchema = new Schema<IResumeVersion>(
  {
    versionId: { type: String, required: true },
    label:     { type: String, required: true },
    data:      { type: Schema.Types.Mixed, required: true },
    theme:     { type: Schema.Types.Mixed, default: {} },
    savedAt:   { type: Date, default: Date.now },
  },
  { _id: false }
)

const ResumeSchema = new Schema<IResume>(
  {
    userId:           { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name:             { type: String, default: 'My Resume', trim: true },
    template:         { type: String, default: 'classic' },
    data:             { type: Schema.Types.Mixed, required: true },
    theme:            { type: Schema.Types.Mixed, default: {} },
    versions:         { type: [VersionSchema], default: [] },
    completenessScore:{ type: Number, default: 0 },
    isFavorite:       { type: Boolean, default: false },
  },
  { timestamps: true }
)

const Resume: Model<IResume> = mongoose.models.Resume ?? mongoose.model<IResume>('Resume', ResumeSchema)
export default Resume

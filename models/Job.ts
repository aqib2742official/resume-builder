import mongoose, { Document, Model, Schema, Types } from 'mongoose'

export type JobStatus = 'wishlist' | 'applied' | 'phone-screen' | 'interview' | 'offer' | 'rejected'
export type InterviewType = 'phone' | 'video' | 'onsite' | ''

export interface IJobNote {
  id: string
  text: string
  createdAt: Date
}

export interface IJob extends Document {
  userId: Types.ObjectId
  company: string
  role: string
  location: string
  appliedDate: string
  status: JobStatus
  resumeId?: string
  coverLetterId?: string
  notes: string
  notesHistory: IJobNote[]
  url: string
  deadline: string
  interviewDate: string
  interviewType: InterviewType
  createdAt: Date
  updatedAt: Date
}

const JobNoteSchema = new Schema<IJobNote>(
  {
    id:        { type: String, required: true },
    text:      { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
)

const JobSchema = new Schema<IJob>(
  {
    userId:        { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    company:       { type: String, default: '', trim: true },
    role:          { type: String, default: '', trim: true },
    location:      { type: String, default: '' },
    appliedDate:   { type: String, default: '' },
    status:        { type: String, enum: ['wishlist', 'applied', 'phone-screen', 'interview', 'offer', 'rejected'], default: 'wishlist' },
    resumeId:      { type: String, default: null },
    coverLetterId: { type: String, default: null },
    notes:         { type: String, default: '' },
    notesHistory:  { type: [JobNoteSchema], default: [] },
    url:           { type: String, default: '' },
    deadline:      { type: String, default: null },
    interviewDate: { type: String, default: null },
    interviewType: { type: String, enum: ['phone', 'video', 'onsite', ''], default: '' },
  },
  { timestamps: true }
)

const Job: Model<IJob> = mongoose.models.Job ?? mongoose.model<IJob>('Job', JobSchema)
export default Job

import mongoose, { Document, Model, Schema, Types } from 'mongoose'

export interface ICoverLetter extends Document {
  userId: Types.ObjectId
  resumeId?: Types.ObjectId
  name: string
  recipientName: string
  companyName: string
  jobTitle: string
  body: string
  createdAt: Date
  updatedAt: Date
}

const CoverLetterSchema = new Schema<ICoverLetter>(
  {
    userId:        { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    resumeId:      { type: Schema.Types.ObjectId, ref: 'Resume', default: null },
    name:          { type: String, default: 'Cover Letter', trim: true },
    recipientName: { type: String, default: '' },
    companyName:   { type: String, default: '' },
    jobTitle:      { type: String, default: '' },
    body:          { type: String, default: '' },
  },
  { timestamps: true }
)

const CoverLetter: Model<ICoverLetter> =
  mongoose.models.CoverLetter ?? mongoose.model<ICoverLetter>('CoverLetter', CoverLetterSchema)
export default CoverLetter

import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IUser extends Document {
  fullName: string
  email: string
  phone: string
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say'
  avatar: string
  password: string
  role: 'user' | 'admin' | 'super_admin'
  disabled: boolean
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone:    { type: String, required: true, trim: true },
    gender:   { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'], required: true },
    avatar:   { type: String, default: '' },
    password: { type: String, required: true },
    role:     { type: String, enum: ['user', 'admin', 'super_admin'], default: 'user' },
    disabled: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const User: Model<IUser> = mongoose.models.User ?? mongoose.model<IUser>('User', UserSchema)
export default User

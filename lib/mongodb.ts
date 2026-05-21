import mongoose from 'mongoose'

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// Module-level singleton — reused across hot-reloads in development
const cache: MongooseCache = { conn: null, promise: null }

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('Please define MONGODB_URI in .env.local')

  if (cache.conn) return cache.conn

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, { bufferCommands: false })
  }

  cache.conn = await cache.promise
  return cache.conn
}

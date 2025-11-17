import mongoose, { Connection } from "mongoose"

type MongooseConnection = {
  conn: Connection | null
  promise: Promise<typeof mongoose> | null
}

const globalMongo = global as typeof globalThis & {
  mongoose?: MongooseConnection
}

const cached: MongooseConnection = globalMongo.mongoose || {
  conn: null,
  promise: null,
}

/**
 * Connect to MongoDB with proper error handling and connection pooling
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return mongoose
  }

  if (!cached.promise) {
    const mongoUri = process.env.MONGODB_URI

    if (!mongoUri) {
      throw new Error(
        "MONGODB_URI environment variable is not set. Check your .env.local file."
      )
    }

    cached.promise = mongoose
      .connect(mongoUri, {
        bufferCommands: false,
        socketTimeoutMS: 30000,
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        retryWrites: true,
      })
      .then((mongoose) => {
        cached.conn = mongoose.connection
        console.log("✅ MongoDB connected successfully")
        return mongoose
      })
      .catch((error) => {
        console.error("❌ MongoDB connection failed:", error.message)
        cached.promise = null
        throw error
      })
  }

  try {
    await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return mongoose
}

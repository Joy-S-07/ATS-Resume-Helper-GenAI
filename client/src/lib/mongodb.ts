/**
 * Singleton Mongoose connection for Next.js serverless/edge environments.
 * Re-uses the existing connection across hot-reloads in development.
 */
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  throw new Error("MONGO_URI environment variable is not defined");
}

// Attach the cached connection to the global object so it survives HMR
declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: typeof mongoose | null;
}

let cached = global._mongooseConn ?? null;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached && mongoose.connection.readyState === 1) {
    return cached;
  }

  cached = await mongoose.connect(MONGO_URI, {
    bufferCommands: false,
  });

  global._mongooseConn = cached;
  console.log("✅ [MongoDB] Connected");
  return cached;
}

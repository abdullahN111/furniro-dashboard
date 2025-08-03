import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("❌ Please define the MONGO environment variable in .env.local");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const connection = (global as any).mongoose || { isConnected: 0 };

export const connectToDB = async () => {
  if (connection.isConnected) {
    console.log("✅ Using existing database connection");
    return;
  }

  try {
    console.log("🔄 Connecting to MongoDB...");
    const db = await mongoose.connect(MONGODB_URI);

    connection.isConnected = db.connections[0].readyState;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).mongoose = connection;

    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

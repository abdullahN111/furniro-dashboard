import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local"
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const connection = (global as any).mongoose || { isConnected: 0 };

export const connectToDB = async () => {
  if (connection.isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI);

    connection.isConnected = db.connections[0].readyState;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).mongoose = connection;
  } catch (error) {
    console.error("Database connection failed:", error);
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

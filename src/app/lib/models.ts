import mongoose from "mongoose";

export const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, min: 3, max: 20 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    img: { type: String },
    isAdmin: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    phone: { type: String },
    address: { type: String },
    emailVerified: { type: Date, default: null },
    provider: { type: String, default: "credentials" },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    // verifyToken: String,
    // verifyTokenExpiry: Date,
  },
  { timestamps: true }
);



export const User = mongoose.models.User || mongoose.model("User", userSchema);
console.log("✅ User model loaded successfully");

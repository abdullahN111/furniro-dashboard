import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { connectToDB } from "@/app/lib/utils";
import { User } from "@/app/lib/models";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    await connectToDB();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "No account with this email" }, { status: 404 });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 1000 * 60 * 60; // 1 hour

    user.forgotPasswordToken = token;
    user.forgotPasswordTokenExpiry = expiry;
    await user.save();

    // Reset link
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your SMTP service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Furniro Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 1 hour.</p>`,
    });

    return NextResponse.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("❌ Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { connectToDB } from "@/app/lib/utils";
import { User } from "@/app/lib/models";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    await connectToDB();
    const user = await User.findOne({
      email: {
        $regex: new RegExp(
          `^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
          "i"
        ),
      },
    });

    // Return a generic message if user does not exist to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    const expiry = Date.now() + 1000 * 60 * 60; // 1 hour

    user.forgotPasswordToken = hashedToken;
    user.forgotPasswordTokenExpiry = expiry;
    await user.save();

    const baseUrl =
      process.env.NEXTAUTH_URL || new URL(req.url).origin;
    const resetLink = `${baseUrl}/reset-password?token=${encodeURIComponent(rawToken)}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Furniro Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset your Furniro Dashboard password",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="margin-top: 0; color: #0f172a;">Password Reset Request</h2>
          <p style="color: #475569; line-height: 1.6;">We received a request to reset the password for your Furniro Dashboard account. Click the button below to choose a new password. This link is valid for 1 hour.</p>
          <p style="margin: 24px 0;">
            <a href="${resetLink}" style="background-color: #4f46e5; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">Reset Password</a>
          </p>
          <p style="color: #94a3b8; font-size: 12px;">If you did not request a password reset, you can safely ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Unable to process password reset request" },
      { status: 500 }
    );
  }
}

"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { User } from "./models";
import { connectToDB } from "./utils";
import { requireAuth, requireAdmin } from "./auth";
import bcryptjs from "bcryptjs";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB

export const addUser = async (formData: FormData) => {
  await requireAdmin();
  await connectToDB();

  const username = String(formData.get("username") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const phone = String(formData.get("phone") || "").trim();
  const address = String(formData.get("address") || "").trim();
  const isAdmin = formData.get("isAdmin") === "true";
  const isActive = formData.get("isActive") !== "false";

  if (!username || username.length < 3 || username.length > 20) {
    throw new Error("Username must be between 3 and 20 characters");
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please provide a valid email address");
  }

  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new Error("User already exists with this email or username");
  }

  const imageFile = formData.get("image");
  let imgData = "";

  if (imageFile instanceof File && imageFile.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
      throw new Error("Invalid image format. Allowed: JPG, PNG, WEBP, GIF");
    }
    if (imageFile.size > MAX_IMAGE_SIZE) {
      throw new Error("Image file size must be under 4MB");
    }
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    imgData = `data:${imageFile.type};base64,${buffer.toString("base64")}`;
  }

  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    phone,
    address,
    img: imgData,
    isAdmin,
    isActive,
  });

  await newUser.save();
  revalidatePath("/dashboard/users");
};

export const updateUser = async (formData: FormData) => {
  const session = await requireAuth();
  const sessionUserId = session.user.id;
  const isSessionAdmin = session.user.role === "admin";
  const targetUserId = String(formData.get("id") || "").trim();

  if (!targetUserId || !mongoose.Types.ObjectId.isValid(targetUserId)) {
    throw new Error("Invalid user ID");
  }

  if (!isSessionAdmin && sessionUserId !== targetUserId) {
    throw new Error("You do not have permission to update this profile");
  }

  await connectToDB();

  const username = String(formData.get("username") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const address = String(formData.get("address") || "").trim();

  if (username && (username.length < 3 || username.length > 20)) {
    throw new Error("Username must be between 3 and 20 characters");
  }

  const imageFile = formData.get("image");
  let imgData: string | undefined;

  if (imageFile instanceof File && imageFile.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
      throw new Error("Invalid image format. Allowed: JPG, PNG, WEBP, GIF");
    }
    if (imageFile.size > MAX_IMAGE_SIZE) {
      throw new Error("Image file size must be under 4MB");
    }
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    imgData = `data:${imageFile.type};base64,${buffer.toString("base64")}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateFields: Record<string, any> = {
    username: username || undefined,
    phone,
    address,
  };

  if (imgData) {
    updateFields.img = imgData;
  }

  // Only admins may change role or active status
  if (isSessionAdmin) {
    const rawAdmin = formData.get("isAdmin");
    const rawActive = formData.get("isActive");
    if (rawAdmin !== null) {
      const nextIsAdmin = rawAdmin === "true" || rawAdmin === "Yes";
      if (!nextIsAdmin) {
        const target = await User.findById(targetUserId);
        if (target?.isAdmin) {
          const adminCount = await User.countDocuments({ isAdmin: true });
          if (adminCount <= 1) {
            throw new Error("Cannot demote the last administrator");
          }
        }
      }
      updateFields.isAdmin = nextIsAdmin;
    }
    if (rawActive !== null) {
      updateFields.isActive = rawActive === "true" || rawActive === "Yes";
    }
  }

  Object.keys(updateFields).forEach(
    (key) => updateFields[key] === undefined && delete updateFields[key]
  );

  await User.findByIdAndUpdate(targetUserId, updateFields, { new: true });
  revalidatePath(`/dashboard/users/${targetUserId}`);
  revalidatePath("/dashboard/users");
};

export const deleteUser = async (formData: FormData) => {
  try {
    const session = await requireAdmin();
    const sessionUserId = session.user.id;
    const id = String(formData.get("id") || "").trim();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, error: "Valid User ID is required" };
    }
    if (sessionUserId === id) {
      return { success: false, error: "You cannot delete your own account" };
    }

    await connectToDB();

    const userToDelete = await User.findById(id);

    if (!userToDelete) {
      return { success: false, error: "User not found" };
    }

    if (userToDelete.isAdmin) {
      const adminCount = await User.countDocuments({ isAdmin: true });
      if (adminCount <= 1) {
        return { success: false, error: "Cannot delete the last admin" };
      }
    }

    await User.findByIdAndDelete(id);
    revalidatePath("/dashboard/users");

    return { success: true };
  } catch (err) {
    console.error("Error deleting user:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete user",
    };
  }
};

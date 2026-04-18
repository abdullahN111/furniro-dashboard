"use server";

import { revalidatePath } from "next/cache";
import { User } from "./models";
import { connectToDB } from "./utils";
import bcryptjs from "bcryptjs";

export const addUser = async (formData: FormData) => {
  const formEntries = Object.fromEntries(formData);
  connectToDB();

  try {
    const existingUser = await User.findOne({
      $or: [{ email: formEntries.email }, { username: formEntries.username }],
    });

    if (existingUser) {
      throw new Error("User already exists with this email or username");
    }

    const imageFile = formData.get("image");
    let imgData = "";

    if (imageFile instanceof File && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      imgData = `data:${imageFile.type};base64,${buffer.toString("base64")}`;
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(
      String(formEntries.password),
      salt,
    );

    const newUser = new User({
      username: formEntries.username,
      email: formEntries.email,
      password: hashedPassword,
      phone: formEntries.phone,
      address: formEntries.address,
      img: imgData,
      isAdmin: formEntries.isAdmin === "true",
      isActive: formEntries.isActive === "true",
    });

    await newUser.save();
  } catch (error) {
    console.error("❌ Error adding user:", error);
    throw error;
  }
};

export const updateUser = async (formData: FormData) => {
  const formEntries = Object.fromEntries(formData);

  const sessionUserId = formEntries.sessionUserId;
  const targetUserId = formEntries.id;

  if (!sessionUserId || sessionUserId !== targetUserId) {
    throw new Error("You can only update your own profile");
  }

  connectToDB();

  try {
    const imageFile = formData.get("image");
    let imgData = formEntries.img as string;

    if (imageFile instanceof File && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      imgData = `data:${imageFile.type};base64,${buffer.toString("base64")}`;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateFields: Record<string, any> = {
      username: formEntries.username,
      email: formEntries.email,
      phone: formEntries.phone,
      address: formEntries.address,
      img: imgData,
      isAdmin: formEntries.isAdmin === "true",
      isActive: formEntries.isActive === "true",
    };

    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === "" || updateFields[key] === undefined) &&
        delete updateFields[key],
    );

    await User.findByIdAndUpdate(formEntries.id, updateFields, { new: true });
    revalidatePath(`/dashboard/users/${formEntries.id}`);
    revalidatePath("/dashboard/users");
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

export const deleteUser = async (formData: FormData) => {
  const { id, sessionUserId } = Object.fromEntries(formData);

  if (!id) throw new Error("User ID is missing!");
  if (sessionUserId === id) {
    throw new Error("You cannot delete your own account");
  }

  await connectToDB();

  try {
    const userToDelete = await User.findById(id);

    if (!userToDelete) {
      throw new Error("User not found");
    }

    if (userToDelete.isAdmin) {
      const adminCount = await User.countDocuments({ isAdmin: true });

      if (adminCount <= 1) {
        throw new Error("Cannot delete the last admin");
      }
    }

    await User.findByIdAndDelete(id);

    revalidatePath("/dashboard/users");
  } catch (err) {
    console.error("Error deleting user:", err);
    throw err;
  }
};
"use server";

import { revalidatePath } from "next/cache";
import { User } from "./models";
import { connectToDB } from "./utils";
import bcryptjs from "bcryptjs";

export const addUser = async (formData: FormData) => {
  const formEntries = Object.fromEntries(formData);
  connectToDB();

  try {
    const imageFile = formData.get("image");
    let imgData = "";

    if (imageFile instanceof File) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      imgData = `data:${imageFile.type};base64,${buffer.toString("base64")}`;
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(
      String(formEntries.password),
      salt
    );

    const newUser = new User({
      username: formEntries.username,
      email: formEntries.email,
      password: hashedPassword,
      phone: formEntries.phone,
      address: formEntries.address,
      img: imgData || formEntries.img,
      isAdmin: formEntries.isAdmin,
      isActive: formEntries.isActive,
    });

    await newUser.save();
  } catch (error) {
    console.error("Error adding user:", error);
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

export const updateUser = async (formData: FormData) => {
  const formEntries = Object.fromEntries(formData);
  connectToDB();

  try {
    const imageFile = formData.get("image");
    let imgData = formEntries.img as string;

    if (imageFile instanceof File && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      imgData = `data:${imageFile.type};base64,${buffer.toString("base64")}`;
    }
    const hashedPassword = await bcryptjs.hash(
      formEntries.password as string,
      10
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateFields: Record<string, any> = {
      username: formEntries.username,
      email: formEntries.email,
      password: hashedPassword,
      phone: formEntries.phone,
      address: formEntries.address,
      img: imgData,
      isAdmin: formEntries.isAdmin === "Yes",
      isActive: formEntries.isActive === "Yes",
    };

    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === "" || updateFields[key] === undefined) &&
        delete updateFields[key]
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
  const { id } = Object.fromEntries(formData);

  if (!id) throw new Error("User ID is missing!");

  try {
    connectToDB();
    await User.findByIdAndDelete(id);

    revalidatePath("/dashboard/users");
    // return { success: true };
  } catch (err) {
    console.error("Error deleting user:", err);
    throw new Error("Failed to delete user!");
  }
};

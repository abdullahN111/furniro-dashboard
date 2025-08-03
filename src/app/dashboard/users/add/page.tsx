"use client";

import { addUser } from "@/app/lib/actions";
import { useState } from "react";
import Image from "next/image";

const AddUserPage = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col lg+:flex-row gap-8 mt-5">
      <div className="flex-1 bg-[--bgSoft] p-3 sm:p-5 rounded-[10px] font-bold text-[--textSoft] h-max flex flex-col items-center justify-center">
        <div className="w-[230px] sm:w-[250px] lg+:w-full h-[270px] lg+:h-[280px] relative rounded-[10px] overflow-hidden mb-5">
          {imagePreview ? (
            <Image src={imagePreview} alt="Preview" fill />
          ) : (
            <Image src="/images/noavatar.png" alt="No Avatar" fill />
          )}
        </div>
        Profile Image
      </div>
      <div className="flex-[3] bg-[--bgSoft] p-3 sm:p-5 rounded-[10px]">
        <form
          action={addUser}
          className="flex flex-col"
          encType="multipart/form-data"
        >
          <label className="text-sm">Username</label>
          <input
            type="text"
            name="username"
            required
            className="p-5 border-2 border-[#2e374a] rounded-[5px] bg-[--bg] text-[--text] my-[10px]"
          />
          <label className="text-sm">Email</label>
          <input
            type="email"
            name="email"
            required
            className="p-5 border-2 border-[#2e374a] rounded-[5px] bg-[--bg] text-[--text] my-[10px]"
          />
          <label className="text-sm">Password</label>
          <input
            type="password"
            name="password"
            required
            className="p-5 border-2 border-[#2e374a] rounded-[5px] bg-[--bg] text-[--text] my-[10px]"
          />
          <label className="text-sm">Phone</label>
          <input
            type="tel"
            name="phone"
            className="p-5 border-2 border-[#2e374a] rounded-[5px] bg-[--bg] text-[--text] my-[10px]"
          />
          <label className="text-sm">Address</label>
          <textarea
            name="address"
            rows={3}
            className="p-5 border-2 border-[#2e374a] rounded-[5px] bg-[--bg] text-[--text] my-[10px]"
          />
          <label className="text-sm">Role</label>
          <select
            name="isAdmin"
            className="p-5 border-2 border-[#2e374a] rounded-[5px] bg-[--bg] text-[--text] my-[10px]"
          >
            <option value="true">Admin</option>
            <option value="false">Editor</option>
          </select>
          <label className="text-sm">Is Active?</label>
          <select
          
            name="isActive"
            className="p-5 border-2 border-[#2e374a] rounded-[5px] bg-[--bg] text-[--text] my-[10px]"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          <label className="text-sm">Image</label>
          <input
            type="file"
            accept="image/*"
            name="image"
            onChange={handleImageChange}
            className="p-5 border-2 border-[#2e374a] rounded-[5px] bg-[--bg] text-[--text] my-[10px]"
          />
          <button
            className="w-full px-5 py-5 bg-teal-500 text-[var(--text)] border-none rounded-md cursor-pointer mt-5"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUserPage;

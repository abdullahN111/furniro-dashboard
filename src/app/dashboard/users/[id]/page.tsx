"use client";

import { updateUser } from "@/app/lib/actions";
import { fetchUser } from "@/app/lib/data";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const SingleUserPage = ({ params }: { params: { id: string } }) => {
  const { data: session } = useSession();
  const { id } = params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await fetchUser(id);
        setUser(userData);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [id]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!user) {
    return <div className="p-4 text-red-500">User not found</div>;
  }

  const canEdit = (session?.user as { id?: string })?.id === id;

  return (
    <>
      <div className="flex flex-col lg+:flex-row gap-8 mt-5" key={id}>
        <div className="flex-1 bg-[--bgSoft] p-3 sm:p-5 rounded-[10px] font-bold text-[--textSoft] h-max flex flex-col items-center justify-center">
          <div className="w-[230px] sm:w-[250px] lg+:w-full h-[270px] lg+:h-[280px] relative rounded-[10px] overflow-hidden mb-5">
            <Image
              src={user.img || "/images/noavatar.png"}
              alt={user.username}
              fill
            />
          </div>
          {user.username}
        </div>
        <div className="flex-[3] bg-[--bgSoft] p-3 sm:p-5 rounded-[10px]">
          {!canEdit && (
            <div className="text-orange-500 font-semibold text-center mb-4">
              👁️ View Only - You can only edit your own profile
            </div>
          )}
          <form action={updateUser} className="flex flex-col">
            <input
              type="hidden"
              name="id"
              value={user._id}
              className="p-5 border-2 border-[#2e374a] rounded-[5px] bg-[--bg] text-[--text] my-[10px]"
            />
            <label className="text-sm">Username</label>
            <input
              type="text"
              name="username"
              placeholder={user.username}
              readOnly={!canEdit}
              className="p-5 border-2 border-[#2e374a] rounded-[5px] bg-[--bg] text-[--text] my-[10px]"
            />

            <label className="text-sm">Email</label>
            <input
              type="email"
              name="email"
              placeholder={user.email}
              readOnly={!canEdit}
              className="p-5 border-2 border-[#2e374a] rounded-[5px] bg-[--bg] text-[--text] my-[10px]"
            />
            <label className="text-sm">Password</label>
            <input
              type="password"
              name="password"
              readOnly={!canEdit}
              className="p-5 border-2 border-[#2e374a] rounded-[5px] bg-[--bg] text-[--text] my-[10px]"
              placeholder="********"
            />
            <label className="text-sm">Phone</label>
            <input
              type="text"
              name="phone"
              placeholder={user.phone}
              readOnly={!canEdit}
              className="p-5 border-2 border-[#2e374a] rounded-[5px] bg-[--bg] text-[--text] my-[10px]"
            />
            <label className="text-sm">Address</label>
            <textarea
              typeof="text"
              name="address"
              placeholder={user.address}
              readOnly={!canEdit}
              className="p-5 border-2 border-[#2e374a] rounded-[5px] bg-[--bg] text-[--text] my-[10px]"
            />
            <label className="text-sm">Role</label>
            <select
              name="isAdmin"
              id="isAdmin"
              defaultValue={user.isAdmin ? "Yes" : "No"}
              disabled={!canEdit}
              className="p-5 border-2 border-[#2e374a] rounded-[5px] bg-[--bg] text-[--text] my-[10px]"
            >
              <option value="Yes">Admin</option>
              <option value="No">Editor</option>
            </select>
            <label className="text-sm">Is Active?</label>
            <select
              name="isActive"
              id="isActive"
              defaultValue={user.isActive ? "Yes" : "No"}
              disabled={!canEdit}
              className="p-5 border-2 border-[#2e374a] rounded-[5px] bg-[--bg] text-[--text] my-[10px]"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <label className="text-sm">Image</label>

            <input
              type="file"
              accept="image/*"
              name="image"
              disabled={!canEdit}
              className="p-5 border-2 border-[#2e374a] rounded-[5px] bg-[--bg] text-[--text] my-[10px]"
            />
            <button
              className={`w-full px-5 py-5 border-none rounded-md cursor-pointer mt-5 ${
                canEdit
                  ? "bg-teal-500 text-[var(--text)]"
                  : "bg-gray-500 text-gray-300 cursor-not-allowed"
              }`}
              type="submit"
              disabled={!canEdit}
            >
              {canEdit ? "Update" : "View Only"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SingleUserPage;

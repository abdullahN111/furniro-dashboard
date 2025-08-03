

export const fetchUsers = async () => {
    const response = await fetch("/api/users");
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
  };
  
 export const fetchUser = async (id: string) => {
  const baseUrl =
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_BASE_URL
      : window.location.origin;

  const response = await fetch(`${baseUrl}/api/users/${id}`);

  if (!response.ok) throw new Error("Failed to fetch user");
  return response.json();
};

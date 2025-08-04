import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "@/app/lib/utils";
import { User } from "@/app/lib/models";
import bcrypt from "bcryptjs";
import "@/app/lib/types";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          await connectToDB();

          if (!credentials?.email || !credentials.password) {
            console.log("❌ Missing email or password");
            throw new Error("Missing email or password");
          }

          const user = await User.findOne({ email: credentials.email });
          console.log("👤 User found:", user ? "Yes" : "No");

          if (!user) {
            console.log("❌ User not found for email:", credentials.email);
            throw new Error("User not found");
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          console.log("🔐 Password valid:", isValid);

          if (!isValid) {
            console.log("❌ Password invalid");
            throw new Error("Invalid password");
          }

          console.log("✅ Authorized:", user.email);

          return {
            id: user._id.toString(),
            name: user.username,
            email: user.email,
            role: user.isAdmin ? "admin" : "editor",
          };
        } catch (error) {
          console.error("❌ Authorization error:", error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      console.log("🔄 JWT callback - user:", user ? "exists" : "null");
      console.log("🔄 JWT callback - token:", token.name);

      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        (token as { role?: string }).role = (user as { role?: string }).role;
        console.log("✅ JWT token updated with user data");
      }
      return token;
    },
    async session({ session, token }) {
      console.log("🔄 Session callback - token:", token);
      console.log("🔄 Session callback - session before:", session);

      if (token) {
        (session.user as { id?: string; name?: string; email?: string; role?: string }) = {
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          role: token.role as string,
        };
      }

      console.log("✅ Session callback - session after:", session);
      return session;
    },
  },
});

export { handler as GET, handler as POST };

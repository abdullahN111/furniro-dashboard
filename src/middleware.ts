import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ token }) {
      console.log("🛡 TOKEN:", token);
      console.log("🛡 TOKEN EMAIL:", token?.email);
      console.log("🛡 TOKEN SUB:", token?.sub);
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};

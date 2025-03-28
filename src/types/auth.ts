import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    // Configure authentication providers (e.g., Google, GitHub, Credentials)
    
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, user, token }) {
      if (session?.user) {
        session.user.id = token.sub as string; // Ensure ID is set
      }
      return session;
    },
  },
};

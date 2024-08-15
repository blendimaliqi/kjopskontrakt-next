import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "@/utils/supabase";

// Define the auth options
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error || !data.user) {
          console.error(error);
          return null;
        }

        // Map Supabase user to NextAuth user
        const user = {
          id: data.user.id,
          name: data.user.email || "Unknown", // Fallback to 'Unknown' if email is null
          email: data.user.email || "unknown@example.com", // Fallback email
          image: data.user.user_metadata?.avatar_url || null, // Optional image
        };

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

// The handler for NextAuth
const handler = NextAuth(authOptions);

// Export the handler functions for GET and POST methods
export { handler as GET, handler as POST };

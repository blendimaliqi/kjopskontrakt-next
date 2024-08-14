import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  // You can define any additional fields here if needed
  interface User {
    // Add any additional fields you want to include
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

import NextAuth from "next-auth";
import { authOptions } from "../../authOptions/authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

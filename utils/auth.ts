import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/authOptions/authOptions";

// Helper function for getting the site's base URL
export const getBaseUrl = () => {
  // For client-side rendering
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_URL || window.location.origin;
  }

  // For server-side rendering
  return process.env.NEXTAUTH_URL || "https://kjopskontrakt.no";
};

// Helper function to get the session in server components and API routes
export async function getSession() {
  return await getServerSession(authOptions);
}

import { redirect } from "next/navigation";

export default function PricingPage() {
  redirect("/#priser");
  // This is unreachable but required to satisfy TypeScript's return type
  return null;
}

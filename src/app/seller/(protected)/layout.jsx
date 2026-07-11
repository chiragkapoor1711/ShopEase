import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

export default async function ProtectedSellerLayout({ children }) {
  // Get JWT cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // Not logged in
  if (!token) {
    redirect("/login");
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    redirect("/login");
  }

  // Only sellers can access these routes
  if (decoded.role !== "seller") {
    redirect("/");
  }

  // Check if seller has created a store
  const [stores] = await db.query(
    "SELECT id FROM stores WHERE seller_id = ?",
    [decoded.id]
  );

  // No store → redirect to Create Store page
  if (stores.length === 0) {
    redirect("/seller/store");
  }

  return children;
}
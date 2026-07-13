import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

// ======================================
// GET SELLER ORDERS
// ======================================
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first.",
        },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "seller") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied.",
        },
        { status: 403 }
      );
    }

    // Get seller's store
    const [stores] = await db.query(
      "SELECT id FROM stores WHERE seller_id = ?",
      [decoded.id]
    );

    if (stores.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Store not found.",
        },
        { status: 404 }
      );
    }

    const storeId = stores[0].id;

    // Get Orders
    const [orders] = await db.query(
      `
      SELECT
          o.id,
          o.order_number,
          u.full_name AS customer_name,
          o.total_amount,
          o.payment_method,
          o.payment_status,
          o.order_status,
          o.created_at
      FROM orders o
      INNER JOIN users u
          ON o.user_id = u.id
      WHERE o.store_id = ?
      ORDER BY o.created_at DESC
      `,
      [storeId]
    );

    return NextResponse.json({
      success: true,
      orders,
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
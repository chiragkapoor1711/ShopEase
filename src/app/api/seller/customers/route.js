import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

// ======================================
// GET SELLER CUSTOMERS
// ======================================

export async function GET() {
  try {
    // ===============================
    // Authentication
    // ===============================

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

    // ===============================
    // Get Seller Store
    // ===============================

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

    // ===============================
    // Get Customers
    // ===============================

    const [customers] = await db.query(
      `
      SELECT
          u.id,
          u.full_name,
          u.email,
          u.mobile,

          COUNT(o.id) AS total_orders,

          IFNULL(SUM(o.total_amount),0) AS total_spent,

          MAX(o.created_at) AS last_order

      FROM users u

      INNER JOIN orders o
          ON u.id = o.user_id

      WHERE o.store_id = ?

      GROUP BY
          u.id,
          u.full_name,
          u.email,
          u.mobile

      ORDER BY last_order DESC
      `,
      [storeId]
    );

    return NextResponse.json({
      success: true,
      customers,
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
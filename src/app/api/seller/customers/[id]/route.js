import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

export async function GET(request, context) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "seller") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied",
        },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const [stores] = await db.query(
      "SELECT id FROM stores WHERE seller_id=?",
      [decoded.id]
    );

    if (!stores.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Store not found",
        },
        { status: 404 }
      );
    }

    const storeId = stores[0].id;

    // Customer Summary
    const [customer] = await db.query(
      `
      SELECT
          u.id,
          u.full_name,
          u.email,
          u.mobile,
          COUNT(o.id) total_orders,
          IFNULL(SUM(o.total_amount),0) total_spent,
          MAX(o.created_at) last_order
      FROM users u
      JOIN orders o
      ON u.id=o.user_id
      WHERE u.id=?
      AND o.store_id=?
      GROUP BY u.id
      `,
      [id, storeId]
    );

    if (!customer.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer not found",
        },
        { status: 404 }
      );
    }

    // Recent Orders
    const [orders] = await db.query(
      `
      SELECT
          id,
          order_number,
          total_amount,
          payment_status,
          order_status,
          created_at
      FROM orders
      WHERE user_id=?
      AND store_id=?
      ORDER BY created_at DESC
      `,
      [id, storeId]
    );

    return NextResponse.json({
      success: true,
      customer: customer[0],
      orders,
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}
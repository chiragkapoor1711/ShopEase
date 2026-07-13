import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

// ======================================
// GET SINGLE ORDER
// ======================================

export async function GET(request, context) {
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

    // Next.js 16
    const { id } = await context.params;

    // Seller Store
    const [stores] = await db.query(
      "SELECT id FROM stores WHERE seller_id=?",
      [decoded.id]
    );

    if (!stores.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Store not found.",
        },
        { status: 404 }
      );
    }

    const storeId = stores[0].id;

    // Order Details
    const [orders] = await db.query(
      `
      SELECT
        o.*,
        u.full_name,
        u.email,
        u.mobile
      FROM orders o
      INNER JOIN users u
      ON o.user_id = u.id
      WHERE o.id=? AND o.store_id=?
      `,
      [id, storeId]
    );

    if (!orders.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found.",
        },
        { status: 404 }
      );
    }

    // Order Items
    const [items] = await db.query(
      `
      SELECT
          oi.id,
          oi.quantity,
          oi.price,
          oi.subtotal,
          p.product_name,
          p.product_image
      FROM order_items oi
      INNER JOIN products p
      ON oi.product_id=p.id
      WHERE oi.order_id=?
      `,
      [id]
    );

    return NextResponse.json({
      success: true,
      order: orders[0],
      items,
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
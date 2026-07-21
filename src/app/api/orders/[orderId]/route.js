import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/lib/db"; 

export async function GET(request, context) {
  try {
    const { orderId } = await context.params;

    // ==========================
    // Authentication
    // ==========================

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

    if (decoded.role !== "user") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 403 }
      );
    }

    // ==========================
    // Get Order + Address
    // ==========================

    const [orders] = await db.query(
      `
      SELECT
          o.id,
          o.order_number,
          o.total_amount,
          o.delivery_charge,
          o.payment_method,
          o.payment_status,
          o.order_status,
          o.created_at,

          a.full_name,
          a.phone,
          a.address_line1,
          a.address_line2,
          a.city,
          a.state,
          a.pincode,
          a.landmark

      FROM orders o

      JOIN addresses a
          ON o.address_id = a.id

      WHERE
          o.id = ?
          AND o.user_id = ?

      LIMIT 1
      `,
      [orderId, decoded.id]
    );

    if (orders.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found.",
        },
        { status: 404 }
      );
    }

    // ==========================
    // Get Ordered Products
    // ==========================

    const [items] = await db.query(
      `
      SELECT
          oi.id,
          oi.product_id,

          p.product_name,
          p.product_image,

          oi.price,
          oi.quantity,
          oi.subtotal

      FROM order_items oi

      JOIN products p
          ON oi.product_id = p.id

      WHERE oi.order_id = ?
      `,
      [orderId]
    );

    return NextResponse.json({
      success: true,
      order: orders[0],
      items,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
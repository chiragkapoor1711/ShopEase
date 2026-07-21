import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import db from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(request, context) {
  try {
    const { orderId } = await context.params;

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 401 },
      );
    }

    if (decoded.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied",
        },
        { status: 403 },
      );
    }

    // Order + Customer + Store + Address
    const [orderRows] = await db.query(
      `
      SELECT
        o.*,

        u.full_name AS customer_name,
        u.email AS customer_email,
        u.mobile AS customer_mobile,

        s.store_name,
        s.phone AS store_phone,
        s.email AS store_email,

        a.full_name AS receiver_name,
        a.phone AS receiver_phone,
        a.address_line1,
        a.address_line2,
        a.city,
        a.state,
        a.pincode,
        a.landmark

      FROM orders o

      JOIN users u
        ON o.user_id = u.id

      JOIN stores s
        ON o.store_id = s.id

      JOIN addresses a
        ON o.address_id = a.id

      WHERE o.id = ?
      `,
      [orderId],
    );

    if (orderRows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found.",
        },
        { status: 404 },
      );
    }

    // Products
    const [items] = await db.query(
      `
      SELECT

        oi.id,
        oi.quantity,
        oi.price,
        oi.subtotal,

        p.id AS product_id,
        p.product_name,
        p.product_image,
        p.brand

      FROM order_items oi

      JOIN products p
        ON oi.product_id = p.id

      WHERE oi.order_id = ?
      `,
      [orderId],
    );

    return NextResponse.json({
      success: true,
      order: orderRows[0],
      items,
    });
  } catch (error) {
    console.error("Admin Order Details Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request, context) {
  try {
    const { orderId } = await context.params;

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 401 },
      );
    }

    if (decoded.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied",
        },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { order_status } = body;

    const validStatuses = [
      "Pending",
      "Confirmed",
      "Packed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatuses.includes(order_status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order status.",
        },
        { status: 400 },
      );
    }

    let query = `
  UPDATE orders
  SET
    order_status = ?,
    updated_at = CURRENT_TIMESTAMP
`;

    const values = [order_status];

    if (order_status === "Delivered") {
      query += `,
    payment_status = 'Paid'
  `;
    }

    query += `
  WHERE id = ?
`;

    values.push(orderId);

    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully.",
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}

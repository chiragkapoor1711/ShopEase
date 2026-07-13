import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

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

    // Total Orders
    const [[totalOrders]] = await db.query(
      "SELECT COUNT(*) AS total FROM orders WHERE store_id=?",
      [storeId]
    );

    // Delivered Orders
    const [[delivered]] = await db.query(
      "SELECT COUNT(*) AS total FROM orders WHERE store_id=? AND order_status='Delivered'",
      [storeId]
    );

    // Processing Orders
    const [[processing]] = await db.query(
      "SELECT COUNT(*) AS total FROM orders WHERE store_id=? AND order_status='Processing'",
      [storeId]
    );

    // Revenue
    const [[revenue]] = await db.query(
      "SELECT IFNULL(SUM(total_amount),0) AS total FROM orders WHERE store_id=? AND payment_status='Paid'",
      [storeId]
    );

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders: totalOrders.total,
        delivered: delivered.total,
        processing: processing.total,
        revenue: revenue.total,
      },
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
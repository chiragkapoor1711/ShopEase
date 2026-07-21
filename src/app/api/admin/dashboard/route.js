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
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    if (decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Access denied" },
        { status: 403 }
      );
    }

    const [
      [sellerCount],
      [customerCount],
      [productCount],
      [revenue],
      [pendingOrders],
      [completedOrders],
      [categoryCount],
      [activeVendors],
      [recentSellers],
      [recentOrders],
    ] = await Promise.all([
      db.query(
        `SELECT COUNT(*) AS total FROM stores`
      ),

      db.query(
        `SELECT COUNT(*) AS total FROM users WHERE role='user'`
      ),

      db.query(
        `SELECT COUNT(*) AS total FROM products`
      ),

      db.query(
        `SELECT IFNULL(SUM(total_amount),0) AS total FROM orders WHERE order_status='Delivered'`
      ),

      db.query(
        `SELECT COUNT(*) AS total FROM orders WHERE order_status='Pending'`
      ),

      db.query(
        `SELECT COUNT(*) AS total FROM orders WHERE order_status='Delivered'`
      ),

      db.query(
        `SELECT COUNT(*) AS total FROM main_categories`
      ),

      db.query(
        `SELECT COUNT(*) AS total FROM stores WHERE status='Active'`
      ),

      db.query(`
        SELECT
          store_name,
          status,
          created_at
        FROM stores
        ORDER BY created_at DESC
        LIMIT 5
      `),

      db.query(`
        SELECT
          order_number,
          total_amount,
          order_status
        FROM orders
        ORDER BY created_at DESC
        LIMIT 5
      `),
    ]);

    return NextResponse.json({
      success: true,

      stats: {
        totalSellers: sellerCount[0].total,
        customers: customerCount[0].total,
        products: productCount[0].total,
        revenue: revenue[0].total,
        pendingOrders: pendingOrders[0].total,
        completedOrders: completedOrders[0].total,
        mainCategories: categoryCount[0].total,
        activeVendors: activeVendors[0].total,
      },

      recentSellers,
      recentOrders,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}
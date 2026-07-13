import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

export async function GET() {
  try {
    // ===============================
    // Check Login
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

    // ===============================
    // Verify JWT
    // ===============================

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
      "SELECT id FROM stores WHERE seller_id=?",
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
    // Dashboard Statistics
    // ===============================

    const [[products]] = await db.query(
      "SELECT COUNT(*) AS total FROM products WHERE store_id=?",
      [storeId]
    );

    const [[categories]] = await db.query(
      "SELECT COUNT(*) AS total FROM categories WHERE store_id=?",
      [storeId]
    );

    const [[orders]] = await db.query(
      "SELECT COUNT(*) AS total FROM orders WHERE store_id=?",
      [storeId]
    );

    const [[customers]] = await db.query(
      `
      SELECT COUNT(DISTINCT user_id) AS total
      FROM orders
      WHERE store_id=?
      `,
      [storeId]
    );

    const [[pendingOrders]] = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM orders
      WHERE store_id=?
      AND order_status='Pending'
      `,
      [storeId]
    );

    const [[deliveredOrders]] = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM orders
      WHERE store_id=?
      AND order_status='Delivered'
      `,
      [storeId]
    );

    const [[todayRevenue]] = await db.query(
      `
      SELECT IFNULL(SUM(total_amount),0) AS total
      FROM orders
      WHERE store_id=?
      AND DATE(created_at)=CURDATE()
      AND payment_status='Paid'
      `,
      [storeId]
    );

    const [[monthlyRevenue]] = await db.query(
      `
      SELECT IFNULL(SUM(total_amount),0) AS total
      FROM orders
      WHERE store_id=?
      AND MONTH(created_at)=MONTH(CURDATE())
      AND YEAR(created_at)=YEAR(CURDATE())
      AND payment_status='Paid'
      `,
      [storeId]
    );

    // ===============================
    // Recent Orders
    // ===============================

    const [recentOrders] = await db.query(
      `
      SELECT
          o.id,
          o.order_number,
          u.full_name,
          o.total_amount,
          o.order_status,
          o.payment_status,
          o.created_at
      FROM orders o
      INNER JOIN users u
          ON o.user_id=u.id
      WHERE o.store_id=?
      ORDER BY o.created_at DESC
      LIMIT 5
      `,
      [storeId]
    );

    // ===============================
    // Low Stock Products
    // ===============================

    const [lowStockProducts] = await db.query(
      `
      SELECT
          id,
          product_name,
          stock,
          product_image
      FROM products
      WHERE store_id=?
      AND stock<=5
      ORDER BY stock ASC
      LIMIT 5
      `,
      [storeId]
    );

    return NextResponse.json({
      success: true,

      dashboard: {
        totalProducts: products.total,
        totalCategories: categories.total,
        totalOrders: orders.total,
        totalCustomers: customers.total,
        pendingOrders: pendingOrders.total,
        deliveredOrders: deliveredOrders.total,
        todayRevenue: todayRevenue.total,
        monthlyRevenue: monthlyRevenue.total,
      },

      recentOrders,

      lowStockProducts,
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
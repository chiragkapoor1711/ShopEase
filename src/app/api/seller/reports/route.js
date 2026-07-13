import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

export async function GET() {
  try {
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

    if (decoded.role !== "seller") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied.",
        },
        { status: 403 }
      );
    }

    // ==========================
    // Seller Store
    // ==========================

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

    // ==========================
    // Summary Cards
    // ==========================

    const [[todaySales]] = await db.query(
      `
      SELECT IFNULL(SUM(total_amount),0) AS total
      FROM orders
      WHERE store_id=?
      AND DATE(created_at)=CURDATE()
      AND payment_status='Paid'
      `,
      [storeId]
    );

    const [[monthlySales]] = await db.query(
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

    const [[totalOrders]] = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM orders
      WHERE store_id=?
      `,
      [storeId]
    );

    const [[totalCustomers]] = await db.query(
      `
      SELECT COUNT(DISTINCT user_id) AS total
      FROM orders
      WHERE store_id=?
      `,
      [storeId]
    );

    // ==========================
    // Monthly Sales Chart
    // ==========================

    const [monthlyChart] = await db.query(
      `
      SELECT
          MONTHNAME(created_at) AS month,
          SUM(total_amount) AS revenue
      FROM orders
      WHERE store_id=?
      AND YEAR(created_at)=YEAR(CURDATE())
      AND payment_status='Paid'
      GROUP BY MONTH(created_at)
      ORDER BY MONTH(created_at)
      `,
      [storeId]
    );

    // ==========================
    // Top Selling Products
    // ==========================

    const [topProducts] = await db.query(
      `
      SELECT
          p.product_name,
          SUM(oi.quantity) AS sold,
          SUM(oi.subtotal) AS revenue
      FROM order_items oi
      JOIN products p
          ON oi.product_id=p.id
      JOIN orders o
          ON oi.order_id=o.id
      WHERE o.store_id=?
      GROUP BY p.id
      ORDER BY sold DESC
      LIMIT 5
      `,
      [storeId]
    );

    // ==========================
    // Category Sales
    // ==========================

    const [categorySales] = await db.query(
      `
      SELECT
          c.category_name,
          SUM(oi.quantity) AS total_items,
          SUM(oi.subtotal) AS revenue
      FROM order_items oi
      JOIN products p
          ON oi.product_id=p.id
      JOIN categories c
          ON p.category_id=c.id
      JOIN orders o
          ON oi.order_id=o.id
      WHERE o.store_id=?
      GROUP BY c.id
      ORDER BY revenue DESC
      `,
      [storeId]
    );

    // ==========================
    // Payment Report
    // ==========================

    const [paymentMethods] = await db.query(
      `
      SELECT
          payment_method,
          COUNT(*) AS orders,
          SUM(total_amount) AS revenue
      FROM orders
      WHERE store_id=?
      GROUP BY payment_method
      `,
      [storeId]
    );

    return NextResponse.json({
      success: true,

      summary: {
        todaySales: todaySales.total,
        monthlySales: monthlySales.total,
        totalOrders: totalOrders.total,
        totalCustomers: totalCustomers.total,
      },

      monthlyChart,
      topProducts,
      categorySales,
      paymentMethods,
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
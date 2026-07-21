import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

// ======================
// ADD TO CART
// ======================

export async function POST(request) {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first.",
        },
        { status: 401 },
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "user") {
      return NextResponse.json(
        {
          success: false,
          message: "Only customers can add products to cart.",
        },
        { status: 403 },
      );
    }

    const { product_id, quantity } = await request.json();

    // Check Product
    const [product] = await db.query(
      `
      SELECT id, stock
      FROM products
      WHERE id = ?
      `,
      [product_id],
    );

    if (product.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        { status: 404 },
      );
    }

    // Check Existing Cart Item
    const [existing] = await db.query(
      `
      SELECT *
      FROM cart
      WHERE customer_id = ?
      AND product_id = ?
      `,
      [decoded.id, product_id],
    );

    if (existing.length > 0) {
      await db.query(
        `
        UPDATE cart
        SET quantity = quantity + ?
        WHERE customer_id = ?
        AND product_id = ?
        `,
        [quantity, decoded.id, product_id],
      );

      return NextResponse.json({
        success: true,
        message: "Cart updated successfully.",
      });
    }

    await db.query(
      `
      INSERT INTO cart
      (
        customer_id,
        product_id,
        quantity
      )
      VALUES (?, ?, ?)
      `,
      [decoded.id, product_id, quantity],
    );

    return NextResponse.json({
      success: true,
      message: "Product added to cart.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

// ======================
// GET CART
// ======================

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
        { status: 401 },
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "user") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 403 },
      );
    }

    const [cartItems] = await db.query(
      `
      SELECT
    c.id AS cart_id,
    c.quantity,

    p.id,
    p.product_name,
    p.product_image,
    p.brand,
    p.price,
    p.stock,
    p.store_id,
    p.main_category_id,
    p.category_id,

    s.store_name,
    s.store_logo,

    o.discount_percentage,

    CASE
        WHEN o.id IS NOT NULL THEN TRUE
        ELSE FALSE
    END AS has_offer,

    CASE
        WHEN o.id IS NOT NULL
        THEN ROUND(
            p.price - (p.price * o.discount_percentage / 100),
            2
        )
        ELSE p.price
    END AS final_price

FROM cart c

JOIN products p
ON c.product_id = p.id

JOIN stores s
ON p.store_id = s.id

LEFT JOIN offers o
ON o.product_id = p.id
AND o.status='active'
AND CURDATE() BETWEEN o.start_date AND o.end_date

WHERE c.customer_id = ?

ORDER BY s.store_name;
      `,
      [decoded.id],
    );

    return NextResponse.json({
      success: true,
      cart: cartItems,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 },
    );
  }
}

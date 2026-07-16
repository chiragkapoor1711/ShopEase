import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

// =============================
// UPDATE CART QUANTITY
// =============================

export async function PUT(request, { params }) {
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

    if (decoded.role !== "user") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 403 }
      );
    }

    const { cartId } = await params;

    const { quantity } = await request.json();

    // Find Cart Item

    const [cart] = await db.query(
      `
      SELECT *
      FROM cart
      WHERE id = ?
      AND customer_id = ?
      `,
      [cartId, decoded.id]
    );

    if (cart.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart item not found.",
        },
        { status: 404 }
      );
    }

    // Check Stock

    const [product] = await db.query(
      `
      SELECT stock
      FROM products
      WHERE id = ?
      `,
      [cart[0].product_id]
    );

    if (quantity > product[0].stock) {
      return NextResponse.json(
        {
          success: false,
          message: `Only ${product[0].stock} items available.`,
        },
        { status: 400 }
      );
    }

    await db.query(
      `
      UPDATE cart
      SET quantity = ?
      WHERE id = ?
      `,
      [quantity, cartId]
    );

    return NextResponse.json({
      success: true,
      message: "Quantity updated successfully.",
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

// =============================
// REMOVE CART ITEM
// =============================

export async function DELETE(request, { params }) {
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

    if (decoded.role !== "user") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 403 }
      );
    }

    const { cartId } = await params;

    // Check cart item belongs to this customer
    const [cart] = await db.query(
      `
      SELECT id
      FROM cart
      WHERE id = ?
      AND customer_id = ?
      `,
      [cartId, decoded.id]
    );

    if (cart.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart item not found.",
        },
        { status: 404 }
      );
    }

    await db.query(
      `
      DELETE FROM cart
      WHERE id = ?
      `,
      [cartId]
    );

    return NextResponse.json({
      success: true,
      message: "Item removed from cart.",
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
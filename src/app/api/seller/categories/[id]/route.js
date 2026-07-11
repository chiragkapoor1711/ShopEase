import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

export async function DELETE(request, context) {
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
    const categoryId = Number(id);

    console.log("Category ID:", categoryId);

    // Get seller store
    const [stores] = await db.query(
      "SELECT id FROM stores WHERE seller_id = ?",
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

    console.log("Store ID:", storeId);

    // Check category belongs to seller
    const [category] = await db.query(
      "SELECT id FROM categories WHERE id = ? AND store_id = ?",
      [categoryId, storeId]
    );

    if (category.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found.",
        },
        { status: 404 }
      );
    }

    // Delete category
    const [result] = await db.query(
      "DELETE FROM categories WHERE id = ? AND store_id = ?",
      [categoryId, storeId]
    );

    console.log(result);

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully.",
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
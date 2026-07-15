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
    await db.query(
      "DELETE FROM categories WHERE id = ? AND store_id = ?",
      [categoryId, storeId]
    );

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

export async function PUT(request, context) {
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

    const { id } = await context.params;
    const categoryId = Number(id);

    // Get seller's store
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

    // Check category belongs to this seller's store
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

    // BUG FIX: main_category_id is sent by the form but was never read here,
    // so changing a category's main category on edit was silently ignored.
    const {
      main_category_id,
      category_name,
      category_image,
      description,
      status,
    } = await request.json();

    if (!category_name) {
      return NextResponse.json(
        {
          success: false,
          message: "Category name is required.",
        },
        { status: 400 }
      );
    }

    if (!main_category_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Main category is required.",
        },
        { status: 400 }
      );
    }

    // Duplicate name check (exclude the category being edited)
    const [existing] = await db.query(
      `SELECT id
       FROM categories
       WHERE store_id = ?
       AND category_name = ?
       AND id != ?`,
      [storeId, category_name, categoryId]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Category already exists.",
        },
        { status: 400 }
      );
    }

    await db.query(
      `UPDATE categories
       SET main_category_id = ?,
           category_name = ?,
           category_image = ?,
           description = ?,
           status = ?
       WHERE id = ? AND store_id = ?`,
      [
        main_category_id,
        category_name,
        category_image || "",
        description || "",
        status || "Active",
        categoryId,
        storeId,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Category updated successfully.",
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
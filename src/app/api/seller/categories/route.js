import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

// ===============================
// GET ALL CATEGORIES
// ===============================
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

    // Get categories
    const [categories] = await db.query(
      `SELECT *
       FROM categories
       WHERE store_id = ?
       ORDER BY id DESC`,
      [storeId]
    );

    return NextResponse.json({
      success: true,
      categories,
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

// ===============================
// CREATE CATEGORY
// ===============================
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

    const {
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

    // Duplicate category check
    const [existing] = await db.query(
      `SELECT id
       FROM categories
       WHERE store_id = ?
       AND category_name = ?`,
      [storeId, category_name]
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
      `INSERT INTO categories
      (
        store_id,
        category_name,
        category_image,
        description,
        status
      )
      VALUES (?, ?, ?, ?, ?)`,
      [
        storeId,
        category_name,
        category_image || "",
        description || "",
        status || "Active",
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Category created successfully.",
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


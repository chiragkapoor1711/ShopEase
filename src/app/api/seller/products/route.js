import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

// ===============================
// GET ALL PRODUCTS
// ===============================
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Please login first." },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "seller") {
      return NextResponse.json(
        { success: false, message: "Access denied." },
        { status: 403 }
      );
    }

    const [stores] = await db.query(
      "SELECT id FROM stores WHERE seller_id = ?",
      [decoded.id]
    );

    if (stores.length === 0) {
      return NextResponse.json(
        { success: false, message: "Store not found." },
        { status: 404 }
      );
    }

    const storeId = stores[0].id;

    const [products] = await db.query(
      `
      SELECT
        products.*,
        categories.category_name
      FROM products
      LEFT JOIN categories
      ON categories.id = products.category_id
      WHERE products.store_id = ?
      ORDER BY products.id DESC
      `,
      [storeId]
    );

    return NextResponse.json({
      success: true,
      products,
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
// CREATE PRODUCT
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
      category_id,
      product_name,
      product_image,
      description,
      price,
      discount_price,
      stock,
      sku,
      brand,
      status,
    } = await request.json();

    // Validation
    if (!category_id || !product_name || !price) {
      return NextResponse.json(
        {
          success: false,
          message: "Category, Product Name and Price are required.",
        },
        { status: 400 }
      );
    }

    // Check category belongs to seller
    const [category] = await db.query(
      "SELECT id FROM categories WHERE id = ? AND store_id = ?",
      [category_id, storeId]
    );

    if (category.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid category.",
        },
        { status: 400 }
      );
    }

    // Duplicate SKU check
    if (sku) {
      const [existingSku] = await db.query(
        "SELECT id FROM products WHERE sku = ? AND store_id = ?",
        [sku, storeId]
      );

      if (existingSku.length > 0) {
        return NextResponse.json(
          {
            success: false,
            message: "SKU already exists.",
          },
          { status: 400 }
        );
      }
    }

    // Insert Product
    await db.query(
      `INSERT INTO products
      (
        store_id,
        category_id,
        product_name,
        product_image,
        description,
        price,
        discount_price,
        stock,
        sku,
        brand,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        storeId,
        category_id,
        product_name,
        product_image || "",
        description || "",
        price,
        discount_price || 0,
        stock || 0,
        sku || "",
        brand || "",
        status || "Active",
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Product created successfully.",
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
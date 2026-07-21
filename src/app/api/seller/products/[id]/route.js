import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

// ======================================
// UPDATE PRODUCT
// ======================================
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
    const productId = Number(id);

    // Seller Store
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

    // Product Exists?
    const [product] = await db.query(
      "SELECT id FROM products WHERE id=? AND store_id=?",
      [productId, storeId]
    );

    if (product.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    // BUG FIX: main_category_id was sent by the form but never destructured
    // or written to the UPDATE query, so editing a product's main category
    // was silently ignored (same bug pattern fixed earlier on the
    // categories PUT route).
    const {
      main_category_id,
      category_id,
      product_name,
      product_image,
      description,
      price,
      stock,
      sku,
      brand,
      status,
    } = await request.json();

    if (!main_category_id || !category_id || !product_name || !price) {
      return NextResponse.json(
        {
          success: false,
          message: "Main Category, Sub Category, Product Name and Price are required.",
        },
        { status: 400 }
      );
    }

    // Check sub category belongs to seller AND to the given main category
    const [category] = await db.query(
      "SELECT id FROM categories WHERE id=? AND store_id=? AND main_category_id=?",
      [category_id, storeId, main_category_id]
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

    // Duplicate SKU
    if (sku) {
      const [existing] = await db.query(
        `SELECT id
         FROM products
         WHERE sku=? 
         AND store_id=?
         AND id<>?`,
        [sku, storeId, productId]
      );

      if (existing.length > 0) {
        return NextResponse.json(
          {
            success: false,
            message: "SKU already exists.",
          },
          { status: 400 }
        );
      }
    }

    await db.query(
      `
      UPDATE products
      SET
        main_category_id=?,
        category_id=?,
        product_name=?,
        product_image=?,
        description=?,
        price=?,
        stock=?,
        sku=?,
        brand=?,
        status=?
      WHERE id=? AND store_id=?
      `,
      [
        main_category_id,
        category_id,
        product_name,
        product_image,
        description,
        price,
        stock,
        sku,
        brand,
        status,
        productId,
        storeId,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Product updated successfully.",
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

// ======================================
// DELETE PRODUCT
// ======================================
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

    const { id } = await context.params;
    const productId = Number(id);

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

    const [result] = await db.query(
      "DELETE FROM products WHERE id=? AND store_id=?",
      [productId, storeId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully.",
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
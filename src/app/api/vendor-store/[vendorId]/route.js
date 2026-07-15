import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { vendorId } = await params;

    // Store Information
    const [stores] = await db.query(
      `
      SELECT
        id,
        store_name,
        store_logo,
        description,
        address
      FROM stores
      WHERE id = ?
      `,
      [vendorId]
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

    // Seller Sub Categories
    const [subCategories] = await db.query(
      `
      SELECT DISTINCT
        c.id,
        c.category_name
      FROM categories c

      INNER JOIN products p
        ON p.category_id = c.id

      WHERE
        p.store_id = ?
        AND p.status='Active'
        AND c.status='Active'

      ORDER BY c.category_name
      `,
      [vendorId]
    );

    // Products
    const [products] = await db.query(
      `
      SELECT
        id,
        category_id,
        product_name,
        product_image,
        brand,
        price,   
        discount_price,
        stock
      FROM products

      WHERE
        store_id=?
        AND status='Active'

      ORDER BY product_name
      `,
      [vendorId]
    );

    return NextResponse.json({
      success: true,
      store: stores[0],
      subCategories,
      products,
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
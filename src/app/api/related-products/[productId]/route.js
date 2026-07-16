import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { productId } = await params;

    // Get current product
    const [current] = await db.query(
      `
      SELECT main_category_id, category_id
      FROM products
      WHERE id = ?
      `,
      [productId]
    );

    if (current.length === 0) {
      return NextResponse.json({
        success: false,
        products: [],
      });
    }

    const { main_category_id, category_id } = current[0];

    // Fetch related products
    const [products] = await db.query(
      `
      SELECT *
      FROM products
      WHERE
        id != ?
        AND main_category_id = ?
        AND category_id = ?
        AND status = 'Active'
      LIMIT 8
      `,
      [productId, main_category_id, category_id]
    );

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        products: [],
      },
      { status: 500 }
    );
  }
}
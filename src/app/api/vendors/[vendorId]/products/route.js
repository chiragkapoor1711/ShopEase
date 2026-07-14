import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { vendorId } = await params;

    const { searchParams } = new URL(request.url);

    const categoryId = searchParams.get("category");

    const [products] = await db.query(
      `
      SELECT
          p.id,
          p.product_name,
          p.product_image,
          p.price,
          p.discount_price,
          p.stock,
          p.brand,
          c.category_name,
          s.store_name

      FROM products p

      INNER JOIN categories c
          ON c.id = p.category_id

      INNER JOIN stores s
          ON s.id = p.store_id

      WHERE
          p.store_id = ?
          AND p.category_id = ?
          AND p.status='Active'

      ORDER BY p.created_at DESC
      `,
      [vendorId, categoryId]
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
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
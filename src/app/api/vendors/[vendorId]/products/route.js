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
      p.stock,
      p.brand,

      c.category_name,
      s.store_name,

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

  FROM products p

  INNER JOIN categories c
      ON c.id = p.category_id

  INNER JOIN stores s
      ON s.id = p.store_id

  LEFT JOIN offers o
      ON o.product_id = p.id
      AND o.status = 'active'
      AND CURDATE() BETWEEN o.start_date AND o.end_date

  WHERE
      p.store_id = ?
      AND p.category_id = ?
      AND p.status = 'Active'

  ORDER BY p.created_at DESC
  `,
      [vendorId, categoryId],
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
      },
    );
  }
}

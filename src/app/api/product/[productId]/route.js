import { NextResponse } from "next/server";
import db from "@/lib/db"; // your database connection

export async function GET(request, { params }) {
  try {
    const { productId } = await params;

    const [rows] = await db.query(
      `
      SELECT
    p.*,

    s.id AS store_id,
    s.store_name,
    s.store_logo,
    s.address AS store_address,

    (
        SELECT COUNT(*)
        FROM products
        WHERE store_id = s.id
    ) AS total_products,

    mc.category_name AS main_category,
    c.category_name AS sub_category,

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

LEFT JOIN stores s
ON p.store_id = s.id

LEFT JOIN main_categories mc
ON p.main_category_id = mc.id

LEFT JOIN categories c
ON p.category_id = c.id

LEFT JOIN offers o
ON o.product_id = p.id
AND o.status = 'active'
AND CURDATE() BETWEEN o.start_date AND o.end_date

WHERE p.id = ?

LIMIT 1
      `,
      [productId],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      product: rows[0],
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 },
    );
  }
}

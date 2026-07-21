import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const [offers] = await db.query(
      `
      SELECT
        o.id,
        o.offer_title,
        o.offer_description,
        o.discount_percentage,
        o.start_date,
        o.end_date,

        p.id AS product_id,
        p.product_name,
        p.product_image,
        p.price,
        ROUND(
    p.price - (p.price * o.discount_percentage / 100),
    2
) AS offer_price,
        p.stock,

        s.store_name,
        s.id AS store_id

      FROM offers o

      INNER JOIN products p
        ON o.product_id = p.id

      INNER JOIN stores s
        ON o.store_id = s.id

      WHERE
        o.status = 'active'
        AND CURDATE() BETWEEN o.start_date AND o.end_date
        AND p.status = 'Active'
        AND p.stock > 0

      ORDER BY
        o.discount_percentage DESC,
        o.id DESC

      LIMIT 1
      `,
    );

    if (offers.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No active offers found.",
      });
    }

    return NextResponse.json({
      success: true,
      offer: offers[0],
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

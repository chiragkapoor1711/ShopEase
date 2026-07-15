import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const [categories] = await db.query(`
      SELECT
        mc.id,
        mc.category_name,
        mc.category_image,
        COUNT(DISTINCT s.id) AS vendor_count
      FROM main_categories mc

      LEFT JOIN categories c
        ON c.main_category_id = mc.id

      LEFT JOIN products p
        ON p.category_id = c.id
        AND p.status = 'Active'

      LEFT JOIN stores s
        ON s.id = p.store_id
        AND s.status = 'Active'

      WHERE mc.status='Active'

      GROUP BY
        mc.id,
        mc.category_name,
        mc.category_image

      ORDER BY mc.category_name ASC
    `);

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
      {
        status: 500,
      }
    );
  }
}
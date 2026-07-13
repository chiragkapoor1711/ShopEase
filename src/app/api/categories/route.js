import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const [categories] = await db.query(
      `
      SELECT
        c.id,
        c.category_name,
        c.category_image,
        c.description,

        COUNT(DISTINCT s.id) AS vendor_count

      FROM categories c

      LEFT JOIN products p
        ON p.category_id = c.id
        AND p.status='Active'

      LEFT JOIN stores s
        ON s.id = p.store_id

      WHERE c.status='Active'

      GROUP BY c.id

      ORDER BY c.category_name ASC
      `
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
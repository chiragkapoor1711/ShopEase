import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const [vendors] = await db.query(
      `
      SELECT
        s.id,
        s.store_name,
        s.store_logo,
        s.description,
        s.address,
        COUNT(p.id) AS product_count

      FROM stores s

      INNER JOIN products p
        ON p.store_id = s.id

      WHERE
        p.main_category_id = ?
        AND p.status = 'Active'
        AND s.status = 'Active'

      GROUP BY
        s.id,
        s.store_name,
        s.store_logo,
        s.description,
        s.address

      ORDER BY s.store_name ASC
      `,
      [id]
    );

    return NextResponse.json({
      success: true,
      vendors,
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
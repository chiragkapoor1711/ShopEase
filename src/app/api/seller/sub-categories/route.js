import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const mainCategoryId = searchParams.get("mainCategory");

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [store] = await db.query(
      "SELECT id FROM stores WHERE seller_id=?",
      [decoded.id]
    );

    if (store.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Store not found",
        },
        { status: 404 }
      );
    }

    const [categories] = await db.query(
      `
      SELECT
        id,
        category_name
      FROM categories
      WHERE
        store_id=?
        AND main_category_id=?
        AND status='Active'
      ORDER BY category_name
      `,
      [
        store[0].id,
        mainCategoryId,
      ]
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
      {
        status: 500,
      }
    );
  }
}
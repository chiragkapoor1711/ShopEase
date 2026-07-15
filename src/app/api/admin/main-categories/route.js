import { NextResponse } from "next/server";
import db from "@/lib/db";

// ===============================
// GET ALL MAIN CATEGORIES
// ===============================

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM main_categories
      ORDER BY created_at DESC
    `);

    return NextResponse.json({
      success: true,
      categories: rows,
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

// ===============================
// CREATE MAIN CATEGORY
// ===============================

export async function POST(request) {
  try {
    const {
      category_name,
      category_image,
      description,
      status,
    } = await request.json();

    if (!category_name) {
      return NextResponse.json(
        {
          success: false,
          message: "Category name is required.",
        },
        {
          status: 400,
        }
      );
    }

    // Check duplicate
    const [existing] = await db.query(
      `
      SELECT id
      FROM main_categories
      WHERE category_name = ?
      `,
      [category_name]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Main category already exists.",
        },
        {
          status: 400,
        }
      );
    }

    await db.query(
      `
      INSERT INTO main_categories
      (
        category_name,
        category_image,
        description,
        status
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        category_name,
        category_image || "",
        description,
        status,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Main category created successfully.",
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
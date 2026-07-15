import { NextResponse } from "next/server";
import db from "@/lib/db";

// ======================================
// UPDATE MAIN CATEGORY
// ======================================

export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    const {
      category_name,
      category_image,
      description,
      status,
    } = await request.json();

    // Check category exists
    const [existing] = await db.query(
      "SELECT * FROM main_categories WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Main category not found.",
        },
        { status: 404 }
      );
    }

    // Preserve existing image if new one is not provided
    const imageToSave =
      category_image && category_image.trim() !== ""
        ? category_image
        : existing[0].category_image;

    await db.query(
      `
      UPDATE main_categories
      SET
        category_name = ?,
        category_image = ?,
        description = ?,
        status = ?,
        updated_at = NOW()
      WHERE id = ?
      `,
      [
        category_name,
        imageToSave,
        description,
        status,
        id,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Main category updated successfully.",
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

// ======================================
// DELETE MAIN CATEGORY
// ======================================

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // Check if category exists
    const [existing] = await db.query(
      "SELECT id FROM main_categories WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Main category not found.",
        },
        { status: 404 }
      );
    }

    await db.query(
      "DELETE FROM main_categories WHERE id = ?",
      [id]
    );

    return NextResponse.json({
      success: true,
      message: "Main category deleted successfully.",
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
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

// ======================
// SET DEFAULT ADDRESS
// ======================

export async function PUT(request, { params }) {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first.",
        },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "user") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Verify address belongs to customer
    const [address] = await db.query(
      `
      SELECT id
      FROM addresses
      WHERE id = ?
      AND customer_id = ?
      `,
      [id, decoded.id]
    );

    if (address.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Address not found.",
        },
        { status: 404 }
      );
    }

    // Remove previous default
    await db.query(
      `
      UPDATE addresses
      SET is_default = 0
      WHERE customer_id = ?
      `,
      [decoded.id]
    );

    // Set selected address as default
    await db.query(
      `
      UPDATE addresses
      SET is_default = 1
      WHERE id = ?
      `,
      [id]
    );

    return NextResponse.json({
      success: true,
      message: "Default address updated successfully.",
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}
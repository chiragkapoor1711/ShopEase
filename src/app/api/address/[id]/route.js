import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

// ======================
// UPDATE ADDRESS
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

    const {
      full_name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      pincode,
      landmark,
      is_default,
    } = await request.json();

    // Check address ownership
    const [existing] = await db.query(
      `
      SELECT id
      FROM addresses
      WHERE id = ?
      AND customer_id = ?
      `,
      [id, decoded.id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Address not found.",
        },
        { status: 404 }
      );
    }

    // If making this address default, remove default from others
    if (is_default) {
      await db.query(
        `
        UPDATE addresses
        SET is_default = 0
        WHERE customer_id = ?
        `,
        [decoded.id]
      );
    }

    await db.query(
      `
      UPDATE addresses
      SET
        full_name = ?,
        phone = ?,
        address_line1 = ?,
        address_line2 = ?,
        city = ?,
        state = ?,
        pincode = ?,
        landmark = ?,
        is_default = ?,
        updated_at = NOW()
      WHERE id = ?
      `,
      [
        full_name,
        phone,
        address_line1,
        address_line2,
        city,
        state,
        pincode,
        landmark,
        is_default ? 1 : 0,
        id,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Address updated successfully.",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}


// ======================
// DELETE ADDRESS
// ======================

export async function DELETE(request, { params }) {
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

    // Check Address Exists
    const [address] = await db.query(
      `
      SELECT *
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

    await db.query(
      `
      DELETE FROM addresses
      WHERE id = ?
      `,
      [id]
    );

    return NextResponse.json({
      success: true,
      message: "Address deleted successfully.",
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
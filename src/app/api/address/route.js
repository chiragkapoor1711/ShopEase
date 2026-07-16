import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

// ======================
// GET ADDRESSES
// ======================

export async function GET() {
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

    const [addresses] = await db.query(
      `
      SELECT *
      FROM addresses
      WHERE customer_id = ?
      ORDER BY is_default DESC, created_at DESC
      `,
      [decoded.id]
    );

    return NextResponse.json({
      success: true,
      addresses,
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

// ======================
// ADD ADDRESS
// ======================

export async function POST(request) {
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

    // If new address is default, remove default from others
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
      INSERT INTO addresses
      (
        customer_id,
        full_name,
        phone,
        address_line1,
        address_line2,
        city,
        state,
        pincode,
        landmark,
        is_default
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        decoded.id,
        full_name,
        phone,
        address_line1,
        address_line2,
        city,
        state,
        pincode,
        landmark,
        is_default ? 1 : 0,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Address added successfully.",
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
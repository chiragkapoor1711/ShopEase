import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import db from "@/lib/db";

// Create Store
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

    if (decoded.role !== "seller") {
      return NextResponse.json(
        {
          success: false,
          message: "Only sellers can create a store.",
        },
        { status: 403 }
      );
    }

    const {
      store_name,
      store_logo,
      description,
      address,
      phone,
      email,
      gst_number,
    } = await request.json();

    // Check if store already exists
    const [existing] = await db.query(
      "SELECT * FROM stores WHERE seller_id = ?",
      [decoded.id]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "You already have a store.",
        },
        { status: 400 }
      );
    }

    // Create Store
    await db.query(
      `INSERT INTO stores
      (seller_id, store_name,store_logo,description, address, phone, email, gst_number)
      VALUES (?, ?, ?, ?, ?, ?, ?,?)`,
      [
        decoded.id,
        store_name,
        store_logo || "",
        description,
        address,
        phone,
        email,
        gst_number,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Store created successfully.",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
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

    const [rows] = await db.query(
      "SELECT * FROM stores WHERE seller_id = ?",
      [decoded.id]
    );

    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        storeExists: false,
      });
    }

    return NextResponse.json({
      success: true,
      storeExists: true,
      store: rows[0],
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

// ==============================
// UPDATE STORE
// ==============================

export async function PUT(request) {
  try {
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

    if (decoded.role !== "seller") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied.",
        },
        { status: 403 }
      );
    }

    const {
      store_name,
      store_logo,
      description,
      address,
      phone,
      email,
      gst_number,
    } = await request.json();

    const [result] = await db.query(
      `
      UPDATE stores
      SET
        store_name = ?,
        store_logo = ?,
        description = ?,
        address = ?,
        phone = ?,
        email = ?,
        gst_number = ?,
        updated_at = NOW()
      WHERE seller_id = ?
      `,
      [
        store_name, 
        store_logo || "",
        description,
        address,
        phone,
        email,
        gst_number,
        decoded.id,
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Store not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Store updated successfully.",
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
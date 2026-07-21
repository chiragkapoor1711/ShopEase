import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

// ======================================
// GET SINGLE OFFER
// ======================================
export async function GET(request, { params }) {
  try {
    const { id } = await params;

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
          message: "Access denied.",
        },
        { status: 403 }
      );
    }

    const [stores] = await db.query(
      "SELECT id FROM stores WHERE seller_id = ?",
      [decoded.id]
    );

    if (stores.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Store not found.",
        },
        { status: 404 }
      );
    }

    const storeId = stores[0].id;

    const [offers] = await db.query(
      `
      SELECT *
      FROM offers
      WHERE id = ?
      AND store_id = ?
      `,
      [id, storeId]
    );

    if (offers.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Offer not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      offer: offers[0],
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
// UPDATE OFFER
// ======================================
export async function PUT(request, { params }) {
  try {
    const { id } = await params;

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
          message: "Access denied.",
        },
        { status: 403 }
      );
    }

    const [stores] = await db.query(
      "SELECT id FROM stores WHERE seller_id = ?",
      [decoded.id]
    );

    if (stores.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Store not found.",
        },
        { status: 404 }
      );
    }

    const storeId = stores[0].id;

    const {
      product_id,
      offer_title,
      offer_description,
      discount_percentage,
      start_date,
      end_date,
      status,
    } = await request.json();

    if (
      !product_id ||
      !offer_title ||
      !discount_percentage ||
      !start_date ||
      !end_date
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill all required fields.",
        },
        { status: 400 }
      );
    }

    if (discount_percentage < 1 || discount_percentage > 90) {
      return NextResponse.json(
        {
          success: false,
          message: "Discount must be between 1 and 90.",
        },
        { status: 400 }
      );
    }

    if (new Date(end_date) < new Date(start_date)) {
      return NextResponse.json(
        {
          success: false,
          message: "End date must be after start date.",
        },
        { status: 400 }
      );
    }

    // Product ownership
    const [product] = await db.query(
      `
      SELECT id
      FROM products
      WHERE id = ?
      AND store_id = ?
      `,
      [product_id, storeId]
    );

    if (product.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product.",
        },
        { status: 400 }
      );
    }

    // Prevent duplicate active offers
    const [duplicate] = await db.query(
      `
      SELECT id
      FROM offers
      WHERE product_id = ?
      AND status = 'active'
      AND id != ?
      `,
      [product_id, id]
    );

    if (duplicate.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "This product already has another active offer.",
        },
        { status: 400 }
      );
    }

    const [result] = await db.query(
      `
      UPDATE offers
      SET
        product_id = ?,
        offer_title = ?,
        offer_description = ?,
        discount_percentage = ?,
        start_date = ?,
        end_date = ?,
        status = ?
      WHERE id = ?
      AND store_id = ?
      `,
      [
        product_id,
        offer_title,
        offer_description || "",
        discount_percentage,
        start_date,
        end_date,
        status,
        id,
        storeId,
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Offer not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Offer updated successfully.",
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
// DELETE OFFER
// ======================================
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

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
          message: "Access denied.",
        },
        { status: 403 }
      );
    }

    const [stores] = await db.query(
      "SELECT id FROM stores WHERE seller_id = ?",
      [decoded.id]
    );

    if (stores.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Store not found.",
        },
        { status: 404 }
      );
    }

    const storeId = stores[0].id;

    const [result] = await db.query(
      `
      DELETE FROM offers
      WHERE id = ?
      AND store_id = ?
      `,
      [id, storeId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Offer not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Offer deleted successfully.",
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
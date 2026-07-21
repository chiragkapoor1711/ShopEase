import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

// ====================================
// GET ALL OFFERS
// ====================================
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
      SELECT
        offers.*,
        products.product_name,
        products.product_image
      FROM offers
      INNER JOIN products
      ON offers.product_id = products.id
      WHERE offers.store_id = ?
      ORDER BY offers.id DESC
      `,
      [storeId]
    );

    return NextResponse.json({
      success: true,
      offers,
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

// ====================================
// CREATE OFFER
// ====================================
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

    // Validation
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

    // Check product belongs to seller
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

    // Check active offer already exists
    const [existingOffer] = await db.query(
      `
      SELECT id
      FROM offers
      WHERE product_id = ?
      AND status = 'active'
      `,
      [product_id]
    );

    if (existingOffer.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "This product already has an active offer.",
        },
        { status: 400 }
      );
    }

    // Insert Offer
    await db.query(
      `
      INSERT INTO offers
      (
        store_id,
        product_id,
        offer_title,
        offer_description,
        discount_percentage,
        start_date,
        end_date,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        storeId,
        product_id,
        offer_title,
        offer_description || "",
        discount_percentage,
        start_date,
        end_date,
        status || "active",
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Offer created successfully.",
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
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

export async function POST(request) {
  try {
    // ===========================
    // Authentication
    // ===========================

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

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "user") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 403 }
      );
    }

    // ===========================
    // Request Body
    // ===========================

    const {
      address_id,
      payment_method,
    } = await request.json();

    if (!address_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select a delivery address.",
        },
        { status: 400 }
      );
    }

    // ===========================
    // Verify Address
    // ===========================

    const [address] = await db.query(
      `
      SELECT *
      FROM addresses
      WHERE id = ?
      AND customer_id = ?
      `,
      [address_id, decoded.id]
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

    // ===========================
    // Get Cart
    // ===========================

    const [cartItems] = await db.query(
      `
      SELECT

        c.id AS cart_id,
        c.quantity,

        p.id,
        p.store_id,
        p.product_name,
        p.price,
        p.discount_price,
        p.stock

      FROM cart c

      JOIN products p
      ON c.product_id = p.id

      WHERE c.customer_id = ?
      `,
      [decoded.id]
    );

    if (cartItems.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Your cart is empty.",
        },
        { status: 400 }
      );
    }

    // ===========================
    // VALIDATE STOCK (before transaction)
    // ===========================

    for (const item of cartItems) {
      if (Number(item.stock) < Number(item.quantity)) {
        return NextResponse.json(
          {
            success: false,
            message: `${item.product_name} has only ${item.stock} item(s) left in stock.`,
          },
          { status: 400 }
        );
      }
    }

    // ===========================
    // START TRANSACTION
    // ===========================

    await db.query("START TRANSACTION");

    // ===========================
    // GROUP CART BY STORE
    // ===========================

    const groupedCart = cartItems.reduce((groups, item) => {
      if (!groups[item.store_id]) {
        groups[item.store_id] = [];
      }

      groups[item.store_id].push(item);

      return groups;
    }, {});

    // ===========================
    // GENERATE ORDER NUMBER
    // ===========================

    const generateOrderNumber = () => {
      const timestamp = Date.now().toString().slice(-8);
      const random = Math.floor(Math.random() * 900) + 100;

      return `SE${timestamp}${random}`;
    };

    // ===========================
    // STORE CREATED ORDERS
    // ===========================

    const createdOrders = [];

    for (const storeId in groupedCart) {

      const items = groupedCart[storeId];

      // Calculate Vendor Total

      let totalAmount = 0;

      for (const item of items) {

        const sellingPrice =
          Number(item.discount_price) > 0
            ? Number(item.discount_price)
            : Number(item.price);

        totalAmount += sellingPrice * Number(item.quantity);

      }

      // Generate Order Number

      const orderNumber = generateOrderNumber();

      // Insert Order

      const [orderResult] = await db.query(
        `
        INSERT INTO orders
        (
          order_number,
          user_id,
          store_id,
          address_id,
          total_amount,
          delivery_charge,
          payment_method,
          payment_status,
          order_status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          orderNumber,
          decoded.id,
          Number(storeId),
          address_id,
          totalAmount,
          0,
          payment_method,
          payment_method === "COD"
            ? "Pending"
            : "Paid",
          "Pending",
        ]
      );

      createdOrders.push({
        order_id: orderResult.insertId,
        order_number: orderNumber,
        store_id: Number(storeId),
        items,
      });

    }

    // ===========================
    // INSERT ORDER ITEMS
    // ===========================

    for (const order of createdOrders) {

      for (const item of order.items) {

        const sellingPrice =
          Number(item.discount_price) > 0
            ? Number(item.discount_price)
            : Number(item.price);

        const subtotal =
          sellingPrice * Number(item.quantity);

        await db.query(
          `
          INSERT INTO order_items
          (
            order_id,
            product_id,
            quantity,
            price,
            subtotal
          )
          VALUES (?, ?, ?, ?, ?)
          `,
          [
            order.order_id,
            item.id,
            item.quantity,
            sellingPrice,
            subtotal,
          ]
        );

      }

    }

    // ===========================
    // UPDATE PRODUCT STOCK
    // ===========================
    // Stock was already validated above, before the transaction started.
    // We still guard with `stock - quantity >= 0` at the DB level so that
    // concurrent orders placed between validation and commit can never
    // push a product's stock negative.

    for (const order of createdOrders) {

      for (const item of order.items) {

        const [updateResult] = await db.query(
          `
          UPDATE products
          SET stock = stock - ?
          WHERE id = ?
          AND stock >= ?
          `,
          [
            item.quantity,
            item.id,
            item.quantity,
          ]
        );

        if (updateResult.affectedRows === 0) {
          throw new Error(
            `${item.product_name} is out of stock.`
          );
        }

      }

    }

    // ===========================
    // CLEAR CUSTOMER CART
    // ===========================

    await db.query(
      `
      DELETE FROM cart
      WHERE customer_id = ?
      `,
      [decoded.id]
    );

    // ===========================
    // COMMIT TRANSACTION
    // ===========================

    await db.query("COMMIT");

    return NextResponse.json({
      success: true,
      message: "Order placed successfully.",
      orders: createdOrders,
    });

  } catch (error) {

    try {
      await db.query("ROLLBACK");
    } catch (rollbackError) {
      console.error("Rollback Error:", rollbackError);
    }

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
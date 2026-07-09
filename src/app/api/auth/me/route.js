import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Not Logged In",
        },
        {
          status: 401,
        }
      );
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get latest user info from database
    const [rows] = await db.query(
      `SELECT
        id,
        full_name,
        email,
        mobile,
        role
      FROM users
      WHERE id=?`,
      [decoded.id]
    );

    if (rows.length === 0) {
      // User was deleted after the token was issued — token is now orphaned
      const res = NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
      res.cookies.delete("token");
      return res;
    }

    return NextResponse.json({
      success: true,
      user: rows[0],
    });
  } catch (error) {
    const isExpired = error?.name === "TokenExpiredError";

    const res = NextResponse.json(
      {
        success: false,
        message: isExpired ? "Session expired" : "Invalid Token",
      },
      {
        status: 401,
      }
    );

    // Clear the stale/invalid cookie so the client stops resending a dead token
    res.cookies.delete("token");
    return res;
  }
}
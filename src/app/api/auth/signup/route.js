import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";

export async function POST(request) {
  try {
    const { fullName, email, mobile, password } = await request.json();

    // Validate input
    if (!fullName || !email || !mobile || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    // Check if email already exists
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return NextResponse.json(
        { success: false, message: "Email already registered." },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await db.query(
      "INSERT INTO users (full_name, email, mobile, password) VALUES (?, ?, ?, ?)",
      [fullName, email, mobile, hashedPassword]
    );

    return NextResponse.json({
      success: true,
      message: "Account created successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
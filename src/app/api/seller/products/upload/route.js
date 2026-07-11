import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { existsSync, mkdirSync } from "fs";
import { v4 as uuid } from "uuid";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "No file selected.",
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get extension
    const extension = file.name.split(".").pop();

    // Unique filename
    const fileName = `${uuid()}.${extension}`;

    // Upload directory
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "products"
    );

    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    // Save file
    await writeFile(
      path.join(uploadDir, fileName),
      buffer
    );

    return NextResponse.json({
      success: true,
      imageUrl: `/uploads/products/${fileName}`,
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Image upload failed.",
      },
      { status: 500 }
    );
  }
}
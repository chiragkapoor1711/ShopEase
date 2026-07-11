import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No image selected." },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Only JPG, PNG and WEBP images are allowed." },
        { status: 400 }
      );
    }

    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: "Image must be smaller than 2MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const extension = file.name.split(".").pop();
    const filename = `${uuid()}.${extension}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads", "categories");
    await mkdir(uploadDir, { recursive: true }); // <-- added
    await writeFile(path.join(uploadDir, filename), buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/categories/${filename}`,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Image upload failed." },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";

export async function POST(request) {

    try {

        const {
            fullName,
            email,
            mobile,
            password
        } = await request.json();

        if (!fullName || !email || !mobile || !password) {

            return NextResponse.json(
                {
                    message: "All fields are required."
                },
                {
                    status: 400
                }
            );

        }

        const [existing] = await db.query(
            "SELECT id FROM users WHERE email=?",
            [email]
        );

        if (existing.length > 0) {

            return NextResponse.json(
                {
                    message: "Email already exists."
                },
                {
                    status: 400
                }
            );

        }

        const hashedPassword = await bcrypt.hash(password,10);

        await db.query(

            `INSERT INTO users
            (full_name,email,mobile,password,role)
            VALUES(?,?,?,?,?)`,

            [
                fullName,
                email,
                mobile,
                hashedPassword,
                "seller"
            ]

        );

        return NextResponse.json({

            success:true,
            message:"Seller created successfully."

        });

    } catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                message:"Internal Server Error"
            },
            {
                status:500
            }
        );

    }

}
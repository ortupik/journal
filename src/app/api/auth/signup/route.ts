import { NextResponse } from "next/server";
import { genSalt, hash } from "bcryptjs";
import prisma from "@/prisma/client";
import { z } from "zod";

// Define validation schema
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
  try {
    // Validate request body
    const body = await req.json();
    const { name, email, password } = signupSchema.parse(body);

    // Check if the user already exists
    const isUserExisting = await prisma.user.findUnique({ where: { email } });
    if (isUserExisting) {
      return new NextResponse(JSON.stringify({ error: "User already exists" }), { status: 422 });
    }

    // Hash password
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    // Create user
    await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return NextResponse.json({ message: "User created successfully" });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify({ error: error.errors[0].message }), { status: 400 });
    }
    return new NextResponse(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }
}

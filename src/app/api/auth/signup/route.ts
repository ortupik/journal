import { NextResponse } from 'next/server';
import { genSalt, hash } from 'bcryptjs';
import prisma from 'prisma/client';
import { z } from 'zod';

// Define validation schema
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@email.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: "#Password123"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Name must be at least 2 characters"
 *       422:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User already exists"
 *       500:
 *         description: Internal server error
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = signupSchema.parse(body);

    const isUserExisting = await prisma.user.findUnique({ where: { email } });
    if (isUserExisting) {
      return new NextResponse(
        JSON.stringify({ error: 'User already exists' }),
        { status: 422 }
      );
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(
        JSON.stringify({ error: error.errors[0].message }),
        { status: 400 }
      );
    }
    return new NextResponse(JSON.stringify({ error: 'Something went wrong' }), {
      status: 500
    });
  }
}

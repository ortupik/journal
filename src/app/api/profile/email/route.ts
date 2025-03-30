import { NextResponse } from 'next/server';
import prisma from 'prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';

const updateEmailSchema = z.object({
  email: z.string().email()
});

/**
 * Updates the user's email address.
 *
 * @param req - The request to update the user's email address
 * @returns - The updated user data
 *
 * @swagger
 * /api/profile/email:
 * put:
 * summary: Update the user's email address
 * description: Updates the user's email address.
 * tags: [Profile]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email:
 * type: string
 * format: email
 * required:
 * - email
 * responses:
 * 200:
 * description: Successfully updated the user's email address
 * 400:
 * description: Invalid request body
 * 401:
 * description: Unauthorized
 * 409:
 * description: Email address already in use
 * 500:
 * description: Failed to update the user's email address
 */
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = updateEmailSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    const existingUserWithEmail = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUserWithEmail && existingUserWithEmail.id !== session.user.id) {
      return NextResponse.json(
        { error: 'Email address already in use.' },
        { status: 409 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { email },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating email:', error);
    return NextResponse.json(
      { error: 'Failed to update email' },
      { status: 500 }
    );
  }
}

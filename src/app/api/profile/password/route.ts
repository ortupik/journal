import { NextResponse } from 'next/server';
import prisma from 'prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const updatePasswordSchema = z.object({
  oldPassword: z.string().optional(), // Make optional if you don't require current password
  newPassword: z.string().min(6) // Example minimum password length
});

/**
 * @swagger
 * /api/profile/password:
 * put:
 * summary: Update the user's password
 * description: Update the user's password. The old password must be provided if it exists.
 * tags: [Profile]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * oldPassword:
 * type: string
 * format: password
 * description: The user's current password. Optional if user doesn't have a password.
 * example: "oldPassword123"
 * newPassword:
 * type: string
 * format: password
 * description: The user's new password.
 * example: "newPassword123"
 * required:
 * - oldPassword
 * - newPassword
 * responses:
 * 200:
 * description: Successfully updated password
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: "Password updated successfully"
 * 400:
 * description: Invalid request body
 * 401:
 * description: Unauthorized
 * 404:
 * description: User not found
 * 500:
 * description: Internal Server Error
 */
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = updatePasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      );
    }

    const { oldPassword, newPassword } = validation.data;

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify old password if provided
    if (oldPassword && currentUser.password) {
      const passwordMatch = await bcrypt.compare(
        oldPassword,
        currentUser.password
      );
      if (!passwordMatch) {
        return NextResponse.json(
          { error: 'Incorrect old password' },
          { status: 401 }
        );
      }
    } else if (currentUser.password && !oldPassword) {
      return NextResponse.json(
        { error: 'Current password is required to change the password.' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword }
    });

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    );
  }
}

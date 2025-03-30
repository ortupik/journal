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

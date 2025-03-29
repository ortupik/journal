import { NextResponse } from 'next/server';
import prisma from '@/../prisma/client';
import { journalSchema } from '@/app/api/utils/validations';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * @swagger
 * /api/journal:
 *   get:
 *     summary: Get all journal entries
 *     description: Fetches all journal entries for the authenticated user.
 *     tags: [Journal]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved journal entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Failed to fetch journal entries
 */
export async function GET(req: Request) {
  try {
    // Get session and ensure user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all journal entries for the authenticated user
    const journals = await prisma.journal.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(journals);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to fetch journal entries' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/journal:
 *   post:
 *     summary: Create a new journal entry
 *     description: Creates a new journal entry for the authenticated user.
 *     tags: [Journal]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Daily Reflection"
 *               content:
 *                 type: string
 *                 example: "Today was a productive day..."
 *     responses:
 *       201:
 *         description: Successfully created a journal entry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid request (validation failed)
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Failed to create journal entry
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validation = journalSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      );
    }

    const newJournal = await prisma.journal.create({
      data: {
        ...body,
        userId: session.user.id
      }
    });

    return NextResponse.json(newJournal, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to create journal entry' },
      { status: 500 }
    );
  }
}

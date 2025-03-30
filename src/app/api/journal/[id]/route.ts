import { NextResponse } from 'next/server';
import prisma from 'prisma/client';
import { journalSchema } from '@/app/api/utils/validations';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Import authOptions
import { error } from 'console';

/**
 * @swagger
 * /api/journal/{id}:
 *   get:
 *     summary: Get a journal entry by ID
 *     description: Retrieves a specific journal entry belonging to the authenticated user.
 *     tags: [Journal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the journal entry to retrieve
 *     responses:
 *       200:
 *         description: The journal entry data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Journal entry not found
 *       500:
 *         description: Failed to fetch journal entry
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const journalEntry = await prisma.journal.findFirst({
      where: { id, userId: session.user.id } // Filter by session user ID
    });

    if (!journalEntry) {
      return NextResponse.json(
        { error: 'Journal entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(journalEntry);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch journal entry' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/journal/{id}:
 *   put:
 *     summary: Update a journal entry by ID
 *     description: Updates an existing journal entry owned by the authenticated user.
 *     tags: [Journal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the journal entry to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Journal Title"
 *               content:
 *                 type: string
 *                 example: "Updated journal content..."
 *     responses:
 *       200:
 *         description: Journal entry updated successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Journal entry not found
 *       500:
 *         description: Failed to update journal entry
 */
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
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

    const { id } = await params;

    await prisma.journal.updateMany({
      where: { id, userId: session.user.id }, // Ensure the user owns the journal
      data: body
    });

    return NextResponse.json({ message: 'Journal entry updated successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update journal entry' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/journal/{id}:
 *   delete:
 *     summary: Delete a journal entry by ID
 *     description: Deletes a specific journal entry belonging to the authenticated user.
 *     tags: [Journal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the journal entry to delete
 *     responses:
 *       200:
 *         description: Journal entry deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Journal entry not found
 *       500:
 *         description: Failed to delete journal entry
 */
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = context.params;

    await prisma.journal.deleteMany({
      where: { id, userId: session.user.id } // Ensure user owns the journal
    });

    return NextResponse.json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to delete journal entry' },
      { status: 500 }
    );
  }
}

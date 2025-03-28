import { NextResponse } from "next/server";
import prisma from "@/../prisma/client";
import { journalSchema } from "@/app/api/utils/validations";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Import authOptions

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const journalEntry = await prisma.journal.findFirst({
      where: { id: params.id, userId: session.user.id }, // Filter by session user ID
    });

    if (!journalEntry) {
      return NextResponse.json({ error: "Journal entry not found" }, { status: 404 });
    }

    return NextResponse.json(journalEntry);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch journal entry" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = journalSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    await prisma.journal.updateMany({
      where: { id: params.id, userId: session.user.id }, // Ensure the user owns the journal
      data: body,
    });

    return NextResponse.json({ message: "Journal entry updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update journal entry" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.journal.deleteMany({
      where: { id: params.id, userId: session.user.id }, // Ensure user owns the journal
    });

    return NextResponse.json({ message: "Journal entry deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete journal entry" }, { status: 500 });
  }
}

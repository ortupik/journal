import { NextResponse } from "next/server";
import prisma from "@/../prisma/client";
import { journalSchema } from "@/app/api/utils/validations";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    // Get session and ensure user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all journal entries for the authenticated user
    const journals = await prisma.journal.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(journals);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Failed to fetch journal entries" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = journalSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const newJournal = await prisma.journal.create({
      data: {
        ...body,
        userId: session.user.id,
      },
    });

    return NextResponse.json(newJournal, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Failed to create journal entry" }, { status: 500 });
  }
}

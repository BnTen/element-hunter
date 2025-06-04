import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return new NextResponse("Invalid folder name", { status: 400 });
    }

    const folder = await prisma.scanFolder.create({
      data: {
        name: name.trim(),
        userId: session.user.id,
      },
    });

    return NextResponse.json(folder);
  } catch (error) {
    console.error("[FOLDERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

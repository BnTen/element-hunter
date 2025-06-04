import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { name } = await req.json();
    if (!name) {
      return new Response("Name is required", { status: 400 });
    }

    await prisma.scanFolder.create({
      data: {
        name,
        userId: session.user.id,
      },
    });

    return new Response("Folder created", { status: 201 });
  } catch {
    return new Response("Internal Server Error", { status: 500 });
  }
}

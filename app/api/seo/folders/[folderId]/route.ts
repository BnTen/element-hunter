import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { folderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { folderId } = params;
    if (!folderId) {
      return new Response("Folder ID is required", { status: 400 });
    }

    await prisma.scanFolder.delete({
      where: {
        id: folderId,
        userId: session.user.id,
      },
    });

    return new Response("Folder deleted", { status: 200 });
  } catch {
    return new Response("Internal Server Error", { status: 500 });
  }
}

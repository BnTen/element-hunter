import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { folderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { folderId } = params;

    // Vérifier que le dossier appartient à l'utilisateur
    const folder = await prisma.scanFolder.findUnique({
      where: {
        id: folderId,
        userId: session.user.id,
      },
    });

    if (!folder) {
      return new NextResponse("Folder not found", { status: 404 });
    }

    // Supprimer d'abord les relations dans ScanFolderOnScan
    await prisma.scanFolderOnScan.deleteMany({
      where: {
        scanFolderId: folderId,
      },
    });

    // Puis supprimer le dossier
    await prisma.scanFolder.delete({
      where: {
        id: folderId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[FOLDER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

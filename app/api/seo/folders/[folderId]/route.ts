import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ folderId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { folderId } = await params;
    if (!folderId) {
      return NextResponse.json(
        { error: "Folder ID is required" },
        { status: 400 }
      );
    }

    // Vérifier que le dossier appartient à l'utilisateur
    const folder = await prisma.scanFolder.findUnique({
      where: {
        id: folderId,
        userId: session.user.id,
      },
    });

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
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
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

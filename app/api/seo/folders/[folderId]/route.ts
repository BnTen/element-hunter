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

    // Vérifier que le dossier appartient à l'utilisateur
    const folder = await prisma.scanFolder.findUnique({
      where: {
        id: folderId,
        userId: session.user.id,
      },
    });

    if (!folder) {
      return new Response("Folder not found", { status: 404 });
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

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("[FOLDER_DELETE]", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

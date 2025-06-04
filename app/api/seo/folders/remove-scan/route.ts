import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const folderId = form.get("folderId")?.toString();
    const scanId = form.get("scanId")?.toString();

    if (!folderId || !scanId) {
      return NextResponse.json(
        { error: "Dossier ou scan manquant" },
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
      return NextResponse.json(
        { error: "Dossier non trouvé" },
        { status: 404 }
      );
    }

    await prisma.scanFolderOnScan.delete({
      where: {
        scanFolderId_seoScanId: {
          scanFolderId: folderId,
          seoScanId: scanId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[FOLDER_REMOVE_SCAN]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

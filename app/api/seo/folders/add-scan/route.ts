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

    let folderId: string | undefined;
    let scanIds: string[] = [];

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await req.json();
      folderId = body.folderId;
      if (Array.isArray(body.scanIds)) {
        scanIds = body.scanIds.filter(
          (id: unknown): id is string => typeof id === "string"
        );
      } else if (typeof body.scanId === "string") {
        scanIds = [body.scanId];
      }
    } else {
      const form = await req.formData();
      folderId = form.get("folderId")?.toString();
      const scanId = form.get("scanId")?.toString();
      if (scanId) scanIds = [scanId];
    }

    if (!folderId || scanIds.length === 0) {
      return NextResponse.json(
        { error: "Dossier ou scan(s) manquant(s)" },
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

    // Ajout multiple
    await prisma.scanFolderOnScan.createMany({
      data: scanIds.map((scanId) => ({
        scanFolderId: folderId!,
        seoScanId: scanId,
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[FOLDER_ADD_SCAN]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.redirect("/login");

  let folderId: string | undefined;
  let scanIds: string[] = [];

  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    // Nouveau format : JSON
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
    // Ancien format : formData
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

  // Ajout multiple
  await prisma.scanFolderOnScan.createMany({
    data: scanIds.map((scanId) => ({
      scanFolderId: folderId!,
      seoScanId: scanId,
    })),
    skipDuplicates: true,
  });

  const origin = req.headers.get("origin") || "http://localhost:3000";
  return NextResponse.redirect(`${origin}/scans/folders`);
}

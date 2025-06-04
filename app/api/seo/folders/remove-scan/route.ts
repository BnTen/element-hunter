import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.redirect("/login");
  const form = await req.formData();
  const folderId = form.get("folderId")?.toString();
  const scanId = form.get("scanId")?.toString();
  if (!folderId || !scanId)
    return NextResponse.json(
      { error: "Dossier ou scan manquant" },
      { status: 400 }
    );
  await prisma.scanFolderOnScan.delete({
    where: {
      scanFolderId_seoScanId: {
        scanFolderId: folderId,
        seoScanId: scanId,
      },
    },
  });
  const origin = req.headers.get("origin") || "http://localhost:3000";
  return NextResponse.redirect(`${origin}/scans/folders`);
}

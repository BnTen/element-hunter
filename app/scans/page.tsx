import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FolderFilter } from "@/components/folder-filter";
import { ScanList } from "@/components/scans/scan-list";

export default async function ScansPage({
  searchParams,
}: {
  searchParams: { folder?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Récupérer les dossiers pour le filtre
  const folders = await prisma.scanFolder.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" },
  });

  // Récupérer les scans avec le filtre de dossier
  const scans = await prisma.seoScan.findMany({
    where: {
      userId: session.user.id,
      ...(searchParams.folder && {
        folders: {
          some: {
            scanFolderId: searchParams.folder,
          },
        },
      }),
    },
    orderBy: { createdAt: "desc" },
    include: {
      folders: {
        include: {
          scanFolder: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
          <h1 className="text-3xl font-extrabold text-primary tracking-tight text-center sm:text-left">
            My SEO Scans
          </h1>
          <div className="flex items-center gap-4">
            <FolderFilter folders={folders} />
            <Button variant="glossyAccent" asChild>
              <Link href="/scans/folders">Manage folders</Link>
            </Button>
          </div>
        </div>

        <ScanList scans={scans} />
      </div>
    </div>
  );
}

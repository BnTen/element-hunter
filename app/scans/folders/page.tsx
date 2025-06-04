import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { FolderIcon, PlusIcon, LinkIcon } from "lucide-react";
import { AddScansToFolder } from "@/components/add-scans-to-folder";
import { DeleteFolderButton } from "@/components/delete-folder-button";
import { CreateFolderButton } from "@/components/create-folder-button";

interface Scan {
  id: string;
  url: string;
  createdAt: Date;
}

interface ScanFolder {
  id: string;
  name: string;
  createdAt: Date;
  scans: {
    seoScan: Scan;
  }[];
}

export default async function FoldersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const folders = await prisma.scanFolder.findMany({
    where: { userId: session.user.id },
    include: {
      scans: {
        include: {
          seoScan: true,
        },
        orderBy: {
          seoScan: {
            createdAt: "desc",
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
          <h1 className="text-3xl font-extrabold text-primary tracking-tight text-center sm:text-left">
            My Folders
          </h1>
          <div className="flex items-center gap-4">
            <CreateFolderButton />
            <Link
              href="/scans"
              className="rounded-full bg-accent hover:bg-accent-hover text-white px-5 py-2 font-semibold shadow transition hover:scale-105 text-sm"
            >
              Back to scans
            </Link>
          </div>
        </div>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {folders.length === 0 ? (
            <div className="col-span-full">
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <FolderIcon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No folders
                </h3>
                <p className="text-muted-foreground mb-6">
                  Create your first folder to organize your scans.
                </p>
                <CreateFolderButton />
              </div>
            </div>
          ) : (
            folders.map((folder: ScanFolder) => (
              <div
                key={folder.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <FolderIcon className="w-6 h-6 text-primary" />
                      <h3 className="font-semibold text-foreground">
                        {folder.name}
                      </h3>
                    </div>
                    <DeleteFolderButton folderId={folder.id} />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        {folder.scans.length} scan
                        {folder.scans.length > 1 ? "s" : ""}
                      </span>
                      <span>
                        Created{" "}
                        {formatDistanceToNow(folder.createdAt, {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {folder.scans.slice(0, 3).map(({ seoScan }) => (
                        <Link
                          key={seoScan.id}
                          href={`/scans/${seoScan.id}`}
                          className="block p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <LinkIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-foreground truncate">
                              {seoScan.url}
                            </span>
                          </div>
                        </Link>
                      ))}
                      {folder.scans.length > 3 && (
                        <div className="text-sm text-muted-foreground text-center">
                          +{folder.scans.length - 3} more scans
                        </div>
                      )}
                    </div>

                    <AddScansToFolder folderId={folder.id} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

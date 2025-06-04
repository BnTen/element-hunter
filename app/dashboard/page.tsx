import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ApiTokenDisplay } from "@/components/api-token-display";
import { ScansList } from "@/components/scans-list";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      scans: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid gap-8">
        <ApiTokenDisplay apiToken={user.apiToken} />
        <ScansList scans={user.scans} />
      </div>
    </div>
  );
}

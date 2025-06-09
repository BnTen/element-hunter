import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ApiTokenDisplay } from "@/components/api-token-display";
import { ScansList } from "@/components/scans-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
        take: 3,
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="w-full px-4 max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex flex-col items-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-2">
            Welcome back, {user.name || user.email}!
          </h1>
          <p className="text-lg text-muted-foreground text-center max-w-2xl">
            Here is your dashboard. Access your API token and your latest scans
            below.
          </p>
        </header>

        {/* Section API Token */}
        <div className="rounded-3xl shadow-xl border-0 bg-card/80 backdrop-blur-md mb-12 p-8 flex flex-col items-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Your API Token
          </h2>
          <ApiTokenDisplay apiToken={user.apiToken} />
        </div>

        {/* Section Derniers Scans */}
        <div className="rounded-3xl shadow-xl border-0 bg-card/80 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-foreground">Recent Scans</h2>
            <Link
              href="/scans"
              className="rounded-full"
              passHref
              legacyBehavior
            >
              <Button variant="glossyAccent" className="w-full md:w-auto">
                View all scans
              </Button>
            </Link>
          </div>
          <ScansList scans={user.scans} />
        </div>
      </div>
    </div>
  );
}

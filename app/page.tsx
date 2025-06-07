import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ClipboardIcon, GlobeIcon } from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ScanData {
  meta?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogTags?: Record<string, string>;
    twitterTags?: Record<string, string>;
    metaDescription?: string;
  };
  content?: {
    paragraphs?: string[];
    keywords?: string[];
    emphasized?: string[];
    strong?: string[];
  };
  basic?: {
    charset?: string;
    language?: string;
  };
  images?: Array<{
    src: string;
    alt?: string;
    width?: number;
    height?: number;
  }>;
  links?: {
    internal?: string[];
    external?: string[];
  };
}

function calculateSEOScore(data: ScanData): number {
  let score = 0;
  if (data.meta?.title) score += 15;
  if (data.meta?.description) score += 15;
  if (data.meta?.keywords?.length) score += 10;
  if (data.meta?.ogTags && Object.keys(data.meta.ogTags).length > 0)
    score += 10;
  if (data.meta?.twitterTags && Object.keys(data.meta.twitterTags).length > 0)
    score += 10;
  if (data.content?.paragraphs && data.content.paragraphs.length > 0)
    score += 10;
  if (data.content?.keywords && data.content.keywords.length > 0) score += 10;
  if (data.content?.emphasized && data.content.emphasized.length > 0)
    score += 5;
  if (data.content?.strong && data.content.strong.length > 0) score += 5;
  if (data.basic?.charset) score += 2;
  if (data.basic?.language) score += 2;
  if (data.images && data.images.length > 0) score += 3;
  if (data.links?.internal && data.links.internal.length > 0) score += 2;
  if (data.links?.external && data.links.external.length > 0) score += 1;
  return Math.min(score, 100);
}

export default async function Home() {
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
          <div className="flex items-center gap-3 mb-2">
            <GlobeIcon className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
              Element Hunter
            </h1>
          </div>
          <p className="text-lg text-muted-foreground text-center max-w-2xl">
            We are a powerful and intuitive Chrome extension that instantly
            scans any web page to deliver a comprehensive technical, SEO, and
            content analysis all in a single click.
          </p>
        </header>

        {/* Section API Token */}
        <div className="rounded-3xl shadow-xl border-0 bg-card/80 backdrop-blur-md mb-12 p-8 flex flex-col items-center max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <ClipboardIcon className="w-7 h-7 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Your API Token
            </h2>
          </div>
          <p className="text-muted-foreground mb-4 text-center">
            Use this token in your <b> Chrome extension </b> to scan your <br />{" "}
            web pages and save it into your dashboard.
          </p>
          <div className="flex items-center gap-2 bg-secondary/70 p-4 rounded-xl w-full justify-between">
            <code className="font-mono text-sm break-all text-accent select-all">
              {user.apiToken}
            </code>
            <CopyButton value={user.apiToken} variant="glossy" />
          </div>
        </div>

        {/* Section Derniers Scans */}
        <div className="rounded-3xl shadow-xl border-0 bg-card/80 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <GlobeIcon className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                Recent Scans
              </h2>
            </div>
            <Link href="/scans" className="rounded-full">
              <Button variant="glossyAccent" className="w-full">
                View all scans
              </Button>
            </Link>
          </div>

          {user.scans.length > 0 ? (
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
              {user.scans.map((scan) => {
                const data = scan.data as unknown as ScanData;
                const score = calculateSEOScore(data);
                const favicon =
                  data.meta?.ogTags?.["og:image"] ||
                  (Array.isArray(data.images) && data.images[0]?.src) ||
                  null;
                return (
                  <Link
                    key={scan.id}
                    href={`/scans/${scan.id}`}
                    className="group block rounded-2xl shadow-md border-0 bg-secondary/80 hover:bg-secondary/90 hover:shadow-xl transition-all duration-200 p-0 overflow-hidden min-h-[170px] min-w-0"
                  >
                    <div className="flex flex-col h-full py-6">
                      {/* Header visuel */}
                      <div className="flex items-center gap-4 px-6 pb-2">
                        <div className="flex-shrink-0">
                          {favicon ? (
                            <Image
                              src={favicon}
                              alt="Favicon"
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-lg border shadow object-cover bg-white"
                            />
                          ) : (
                            <GlobeIcon className="w-10 h-10 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-foreground line-clamp-2">
                            {data.meta?.title || scan.url}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground line-clamp-1">
                              {scan.url}
                            </span>
                            <span className="ml-auto text-xs text-muted-foreground">
                              {scan.createdAt
                                ? new Date(scan.createdAt).toLocaleDateString()
                                : ""}
                            </span>
                          </div>
                        </div>
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-semibold shadow-sm ml-2",
                            score > 80
                              ? "bg-success/20 text-success"
                              : score > 60
                              ? "bg-warning/20 text-warning"
                              : "bg-destructive/20 text-destructive"
                          )}
                        >
                          {score}%
                        </span>
                      </div>
                      {/* Description */}
                      <div className="px-6 pt-2 pb-2 text-muted-foreground text-base line-clamp-2 min-h-[48px]">
                        {data.meta?.description || "No description available"}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No scans yet. Install the Chrome extension to start scanning your
              pages.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

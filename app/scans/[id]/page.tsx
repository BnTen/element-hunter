import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle as AlertCircleIcon,
  ArrowLeft as ArrowLeftIcon,
  CheckCircle2 as CheckCircleIcon,
  ExternalLink as ExternalLinkIcon,
  Globe as GlobeIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  XCircle as XCircleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { calculateSEOScore, getIssues } from "@/lib/seo-utils";
import type { ScanData } from "@/types/scan";
import Image from "next/image";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ScanDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const { id } = await params;
  const scan = await prisma.seoScan.findUnique({
    where: { id, userId: session.user.id },
  });
  if (!scan) redirect("/scans");
  const scanData = scan.data as unknown as { data: unknown };
  const rawData = scanData.data as ScanData;
  if (!rawData) return renderError("Scan data is missing.");
  let keywords: string[] = [];
  if (rawData.meta && rawData.meta.keywords) {
    if (Array.isArray(rawData.meta.keywords)) {
      keywords = rawData.meta.keywords.filter(
        (k): k is string => typeof k === "string"
      );
    } else if (typeof rawData.meta.keywords === "string") {
      keywords = (rawData.meta.keywords as string)
        .split(",")
        .map((k: string) => k.trim())
        .filter(Boolean);
    }
  }
  const data: ScanData = {
    ...rawData,
    meta: {
      ...rawData.meta,
      keywords,
    },
  };
  const score = calculateSEOScore(data);
  const issues = getIssues(data);
  const favicon =
    data.meta?.ogTags?.["og:image"] || data.images?.[0]?.src || null;
  const scanDate = scan.createdAt
    ? new Date(scan.createdAt).toLocaleDateString()
    : "";

  // Analyse/interprétation simple
  const mainIssues: string[] = [];
  if (!data.meta?.title) mainIssues.push("Missing <title> tag");
  if (!data.meta?.description) mainIssues.push("Missing meta description");
  if (!data.meta?.keywords?.length) mainIssues.push("No keywords provided");
  if (data.images?.some((img) => !img.alt))
    mainIssues.push("Images without alt text");

  // Utilitaire pour compter les liens internes/externes de façon sûre
  function getArrayLength(val: unknown): number {
    return Array.isArray(val) ? val.length : 0;
  }

  const internalLinksCount = getArrayLength(data.links?.internal);
  const externalLinksCount = getArrayLength(data.links?.external);
  const totalLinksCount = internalLinksCount + externalLinksCount;

  if (totalLinksCount < 5) mainIssues.push("Few links detected");

  const strengths: string[] = [];
  if (data.meta?.title) strengths.push("Title present");
  if (data.meta?.description) strengths.push("Meta description present");
  if (data.meta?.keywords?.length) strengths.push("Keywords provided");
  if (data.images?.length) strengths.push("Images detected");
  if (internalLinksCount) strengths.push("Internal links present");

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar sticky */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/scans">
                <ArrowLeftIcon className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <span className="font-bold text-lg tracking-tight">
              Element Hunter
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Badge
              variant={
                score >= 80
                  ? "default"
                  : score >= 60
                  ? "secondary"
                  : "destructive"
              }
              className="px-3 py-1 text-base font-semibold"
            >
              SEO&nbsp;{score}%
            </Badge>
          </div>
        </div>
      </nav>

      {/* Header scan */}
      <header className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center gap-6 py-8">
        <div className="flex-shrink-0">
          {favicon ? (
            <Image
              src={favicon}
              alt="Favicon"
              width={64}
              height={64}
              className="w-16 h-16 rounded-xl border shadow object-cover bg-white"
            />
          ) : (
            <GlobeIcon className="w-16 h-16 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground truncate">
            {data.meta?.title || scan.url}
          </h1>
          <a
            href={scan.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary/80 hover:underline flex items-center gap-1 mt-1 truncate"
          >
            {scan.url}
            <ExternalLinkIcon className="h-3 w-3" />
          </a>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground">
              Scan from {scanDate}
            </span>
            {score >= 80 && <Badge variant="default">Excellent</Badge>}
            {score < 80 && score >= 60 && (
              <Badge variant="secondary">Average</Badge>
            )}
            {score < 60 && (
              <Badge variant="destructive">Needs improvement</Badge>
            )}
          </div>
        </div>
      </header>

      {/* Résumé visuel */}
      <section className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="col-span-1">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Score SEO</CardTitle>
            {score >= 80 ? (
              <CheckCircleIcon className="h-4 w-4 text-success" />
            ) : score >= 60 ? (
              <AlertCircleIcon className="h-4 w-4 text-warning" />
            ) : (
              <XCircleIcon className="h-4 w-4 text-destructive" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{score}%</div>
            <Progress value={score} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {score >= 80
                ? "Excellent"
                : score >= 60
                ? "Average"
                : "Needs improvement"}
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Problèmes</CardTitle>
            <AlertCircleIcon className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{issues}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {issues === 0 ? "No issues detected" : `${issues} to fix`}
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Images</CardTitle>
            <ImageIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.images?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {data.images?.filter((img) => !img.alt).length || 0} without alt
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Liens</CardTitle>
            <LinkIcon className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLinksCount}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {externalLinksCount} externes
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Interprétation & conseils */}
      <section className="max-w-4xl mx-auto px-4 grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Priority Fixes</CardTitle>
            <CardDescription>Main issues detected</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <ul className="space-y-2">
                {mainIssues.map((issue, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-destructive"
                  >
                    <XCircleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Strengths</CardTitle>
            <CardDescription>Positive elements detected</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <ul className="space-y-2">
                {strengths.map((strength, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-success"
                  >
                    <CheckCircleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      </section>

      {/* Détails */}
      <section className="max-w-4xl mx-auto px-4 mb-8">
        <Tabs defaultValue="meta" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="meta">Meta</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>
          <TabsContent value="meta" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Meta Tags</CardTitle>
                <CardDescription>SEO meta information</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Title
                    </dt>
                    <dd className="mt-1 text-sm">
                      {data.meta?.title || (
                        <span className="text-destructive">Missing</span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Description
                    </dt>
                    <dd className="mt-1 text-sm">
                      {data.meta?.description || (
                        <span className="text-destructive">Missing</span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Keywords
                    </dt>
                    <dd className="mt-1 text-sm">
                      {data.meta?.keywords?.length ? (
                        <div className="flex flex-wrap gap-1">
                          {data.meta.keywords.map((keyword, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-destructive">Missing</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="content" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Analysis</CardTitle>
                <CardDescription>Text content and structure</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Headings
                    </dt>
                    <dd className="mt-1 text-sm">
                      {data.headings?.length ? (
                        <ul className="space-y-1">
                          {data.headings.map((heading, index) => (
                            <li
                              key={index}
                              className={cn(
                                "flex items-center gap-2",
                                heading.level === 1 && "text-lg font-bold",
                                heading.level === 2 &&
                                  "text-base font-semibold",
                                heading.level === 3 && "text-sm"
                              )}
                            >
                              <span className="text-muted-foreground">
                                H{heading.level}
                              </span>
                              <span>{heading.text}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-destructive">
                          No headings found
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="links" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Links Analysis</CardTitle>
                <CardDescription>Internal and external links</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Internal Links
                    </dt>
                    <dd className="mt-1 text-sm">
                      {data.links?.internal?.length ? (
                        <ul className="space-y-1">
                          {data.links.internal.map((link, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <LinkIcon className="h-3 w-3 text-muted-foreground" />
                              <a
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                {link.text || link.href}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-destructive">
                          No internal links found
                        </span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      External Links
                    </dt>
                    <dd className="mt-1 text-sm">
                      {data.links?.external?.length ? (
                        <ul className="space-y-1">
                          {data.links.external.map((link, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <ExternalLinkIcon className="h-3 w-3 text-muted-foreground" />
                              <a
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                {link.text || link.href}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-destructive">
                          No external links found
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="images" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Images Analysis</CardTitle>
                <CardDescription>Images and their attributes</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Images
                    </dt>
                    <dd className="mt-1 text-sm">
                      {data.images?.length ? (
                        <ul className="space-y-4">
                          {data.images.map((image, index) => (
                            <li key={index} className="flex items-start gap-4">
                              <div className="flex-shrink-0">
                                <Image
                                  src={image.src}
                                  alt={image.alt || "Image"}
                                  width={64}
                                  height={64}
                                  className="w-16 h-16 rounded-lg border shadow object-cover bg-white"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {image.alt || "No alt text"}
                                  </span>
                                  {!image.alt && (
                                    <Badge
                                      variant="destructive"
                                      className="text-xs"
                                    >
                                      Missing alt
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 truncate">
                                  {image.src}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-destructive">
                          No images found
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

function renderError(message: string) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/scans">Back to Scans</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

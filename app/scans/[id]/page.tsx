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
  Search as SearchIcon,
  Tag as TagIcon,
  XCircle as XCircleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { calculateSEOScore, getIssues } from "@/lib/seo-utils";
import type { ScanData } from "@/types/scan";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ScanDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const id = params.id;
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
            <img
              src={favicon}
              alt="Favicon"
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
            {mainIssues.length === 0 ? (
              <div className="text-success flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4" />
                No major issues detected
              </div>
            ) : (
              <ul className="list-disc pl-5 space-y-1">
                {mainIssues.map((issue, i) => (
                  <li key={i} className="text-destructive">
                    {issue}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Strengths</CardTitle>
            <CardDescription>What's well optimized</CardDescription>
          </CardHeader>
          <CardContent>
            {strengths.length === 0 ? (
              <div className="text-muted-foreground">No strengths detected</div>
            ) : (
              <ul className="list-disc pl-5 space-y-1">
                {strengths.map((item, i) => (
                  <li key={i} className="text-success">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Sections détaillées (onglets) */}
      <main className="container pb-10 max-w-4xl mx-auto">
        <Tabs defaultValue="meta" className="space-y-10">
          <TabsList className="w-full justify-start h-14 bg-muted/60 p-2 rounded-xl shadow border mb-4">
            <TabsTrigger
              value="meta"
              className="data-[state=active]:bg-background data-[state=active]:shadow-lg text-lg font-semibold px-6 py-2 rounded-lg"
            >
              <SearchIcon className="h-5 w-5 mr-2" />
              Metadata
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="data-[state=active]:bg-background data-[state=active]:shadow-lg text-lg font-semibold px-6 py-2 rounded-lg"
            >
              <TagIcon className="h-5 w-5 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger
              value="images"
              className="data-[state=active]:bg-background data-[state=active]:shadow-lg text-lg font-semibold px-6 py-2 rounded-lg"
            >
              <ImageIcon className="h-5 w-5 mr-2" />
              Images
            </TabsTrigger>
            <TabsTrigger
              value="links"
              className="data-[state=active]:bg-background data-[state=active]:shadow-lg text-lg font-semibold px-6 py-2 rounded-lg"
            >
              <LinkIcon className="h-5 w-5 mr-2" />
              Links
            </TabsTrigger>
            <TabsTrigger
              value="tech"
              className="data-[state=active]:bg-background data-[state=active]:shadow-lg text-lg font-semibold px-6 py-2 rounded-lg"
            >
              <GlobeIcon className="h-5 w-5 mr-2" />
              Technologies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="meta" className="space-y-8">
            <Card className="border-none shadow-xl bg-white/95">
              <CardHeader className="bg-muted/40 border-b rounded-t-xl">
                <CardTitle className="text-2xl font-bold">Metadata</CardTitle>
                <CardDescription className="text-base">
                  Essential information for SEO
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="p-4 rounded-lg bg-muted/30">
                    <h3 className="text-base font-semibold flex items-center gap-2 mb-2">
                      <SearchIcon className="h-5 w-5 text-primary" />
                      Title
                    </h3>
                    <p className="text-base">
                      {data.meta?.title || "Not defined"}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30">
                    <h3 className="text-base font-semibold flex items-center gap-2 mb-2">
                      <SearchIcon className="h-5 w-5 text-primary" />
                      Description
                    </h3>
                    <p className="text-base">
                      {data.meta?.description || "Not defined"}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 col-span-2">
                    <h3 className="text-base font-semibold flex items-center gap-2 mb-2">
                      <TagIcon className="h-5 w-5 text-primary" />
                      Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(data.meta?.keywords) &&
                      (data.meta.keywords as string[]).length > 0 ? (
                        (data.meta.keywords as string[]).map(
                          (keyword: string, i: number) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-sm px-3 py-1"
                            >
                              {keyword}
                            </Badge>
                          )
                        )
                      ) : (
                        <span className="text-muted-foreground">
                          No keywords provided
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 col-span-2">
                    <h3 className="text-base font-semibold flex items-center gap-2 mb-2">
                      <GlobeIcon className="h-5 w-5 text-primary" />
                      Technical Information
                    </h3>
                    <div className="grid gap-3 text-base md:grid-cols-2">
                      <div className="flex justify-between items-center p-2 rounded-md bg-background">
                        <span className="text-muted-foreground">Charset</span>
                        <span className="font-medium">
                          {data.basic?.charset || "Not defined"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-md bg-background">
                        <span className="text-muted-foreground">Language</span>
                        <span className="font-medium">
                          {data.basic?.language || "Not detected"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-md bg-background">
                        <span className="text-muted-foreground">Viewport</span>
                        <span className="font-medium">
                          {data.meta &&
                          "viewport" in data.meta &&
                          (data.meta as { viewport?: string }).viewport
                            ? (data.meta as { viewport?: string }).viewport
                            : "Not defined"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-md bg-background">
                        <span className="text-muted-foreground">Robots</span>
                        <span className="font-medium">
                          {data.meta &&
                          "robots" in data.meta &&
                          (data.meta as { robots?: string }).robots
                            ? (data.meta as { robots?: string }).robots
                            : "Not defined"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-8">
            <Card className="border-none shadow-xl bg-white/95">
              <CardHeader className="bg-muted/40 border-b rounded-t-xl">
                <CardTitle className="text-2xl font-bold">Content</CardTitle>
                <CardDescription className="text-base">
                  Page structure and content
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-8">
                    {"headings" in data
                      ? Object.entries(data.headings ?? {}).map(
                          ([level, headings]) => {
                            const arr =
                              Array.isArray(headings) &&
                              headings.every(
                                (h) => typeof h === "object" && h && "text" in h
                              )
                                ? headings
                                : [];
                            return (
                              <div key={level} className="space-y-3">
                                <h3 className="text-base font-semibold capitalize flex items-center gap-2">
                                  <TagIcon className="h-5 w-5 text-primary" />
                                  {level}
                                </h3>
                                <div className="space-y-2">
                                  {arr.map((heading, i) => (
                                    <div
                                      key={i}
                                      className="text-base p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                    >
                                      {heading.text}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          }
                        )
                      : []}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-8">
            <Card className="border-none shadow-xl bg-white/95">
              <CardHeader className="bg-muted/40 border-b rounded-t-xl">
                <CardTitle className="text-2xl font-bold">Images</CardTitle>
                <CardDescription className="text-base">
                  {Array.isArray(data.images) ? data.images.length : 0} images
                  found
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <ScrollArea className="h-[500px] pr-4">
                  <div className="grid gap-8 md:grid-cols-2">
                    {Array.isArray(data.images)
                      ? data.images.map((image, i) => (
                          <div
                            key={i}
                            className={cn(
                              "p-4 rounded-lg border bg-card hover:shadow-lg transition-shadow",
                              !image.alt && "border-destructive"
                            )}
                          >
                            <div className="aspect-video relative mb-3 rounded-lg overflow-hidden bg-muted">
                              <img
                                src={image.src}
                                alt={image.alt || "No alt text"}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="space-y-2">
                              <p className="text-base font-semibold truncate">
                                {image.alt || "No alt text"}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {image.src}
                              </p>
                            </div>
                          </div>
                        ))
                      : []}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="links" className="space-y-8">
            <Card className="border-none shadow-xl bg-white/95">
              <CardHeader className="bg-muted/40 border-b rounded-t-xl">
                <CardTitle className="text-2xl font-bold">Links</CardTitle>
                <CardDescription className="text-base">
                  {Array.isArray(data.links?.internal)
                    ? data.links.internal.length
                    : 0}{" "}
                  internal links,{" "}
                  {Array.isArray(data.links?.external)
                    ? data.links.external.length
                    : 0}{" "}
                  external links
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <Tabs defaultValue="internal" className="space-y-6">
                  <TabsList className="w-full justify-start h-12 bg-muted/50 p-1 rounded-lg mb-4">
                    <TabsTrigger
                      value="internal"
                      className="data-[state=active]:bg-background data-[state=active]:shadow-lg text-base font-semibold px-6 py-2 rounded-lg"
                    >
                      Internal Links
                    </TabsTrigger>
                    <TabsTrigger
                      value="external"
                      className="data-[state=active]:bg-background data-[state=active]:shadow-lg text-base font-semibold px-6 py-2 rounded-lg"
                    >
                      External Links
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="internal">
                    <ScrollArea className="h-[350px] pr-4">
                      <div className="space-y-2">
                        {Array.isArray(data.links?.internal) &&
                        data.links.internal.length ? (
                          data.links.internal.map((link, i) => {
                            const isObj =
                              typeof link === "object" &&
                              link !== null &&
                              "url" in link;
                            return (
                              <a
                                key={i}
                                href={
                                  isObj
                                    ? (link as { url: string }).url
                                    : (link as string)
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-base"
                                aria-label={`Lien interne vers ${
                                  isObj
                                    ? (link as { url: string }).url
                                    : (link as string)
                                }`}
                              >
                                <div className="font-semibold truncate flex items-center gap-2">
                                  <LinkIcon className="h-4 w-4 text-accent" />
                                  {isObj
                                    ? (link as { text?: string; url: string })
                                        .text || (link as { url: string }).url
                                    : (link as string)}
                                </div>
                                <div className="text-xs text-muted-foreground truncate mt-1">
                                  {isObj
                                    ? (link as { url: string }).url
                                    : (link as string)}
                                </div>
                              </a>
                            );
                          })
                        ) : (
                          <span className="text-muted-foreground">
                            No internal links
                          </span>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="external">
                    <ScrollArea className="h-[350px] pr-4">
                      <div className="space-y-2">
                        {Array.isArray(data.links?.external) &&
                        data.links.external.length ? (
                          data.links.external.map((link, i) => {
                            const isObj =
                              typeof link === "object" &&
                              link !== null &&
                              "url" in link;
                            return (
                              <a
                                key={i}
                                href={
                                  isObj
                                    ? (link as { url: string }).url
                                    : (link as string)
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-base"
                                aria-label={`Lien externe vers ${
                                  isObj
                                    ? (link as { url: string }).url
                                    : (link as string)
                                }`}
                              >
                                <div className="font-semibold truncate flex items-center gap-2">
                                  <ExternalLinkIcon className="h-4 w-4 text-primary" />
                                  {isObj
                                    ? (link as { text?: string; url: string })
                                        .text || (link as { url: string }).url
                                    : (link as string)}
                                </div>
                                <div className="text-xs text-muted-foreground truncate mt-1">
                                  {isObj
                                    ? (link as { url: string }).url
                                    : (link as string)}
                                </div>
                              </a>
                            );
                          })
                        ) : (
                          <span className="text-muted-foreground">
                            No external links
                          </span>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tech" className="space-y-8">
            <Card className="border-none shadow-xl bg-white/95">
              <CardHeader className="bg-muted/40 border-b rounded-t-xl">
                <CardTitle className="text-2xl font-bold">
                  Technologies
                </CardTitle>
                <CardDescription className="text-base">
                  Technologies detected on the site
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid gap-8 md:grid-cols-2">
                  {"technologies" in data
                    ? Object.entries(data.technologies ?? {}).map(
                        ([category, items]) => {
                          const arr = Array.isArray(items) ? items : [];
                          return (
                            <div key={category} className="space-y-3">
                              <h3 className="text-base font-semibold capitalize flex items-center gap-2">
                                <GlobeIcon className="h-5 w-5 text-primary" />
                                {category.replace(/([A-Z])/g, " $1").trim()}
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {arr.map((item, i) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="text-sm px-3 py-1"
                                  >
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          );
                        }
                      )
                    : []}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function renderError(message: string) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{message}</p>
        </CardContent>
      </Card>
    </div>
  );
}

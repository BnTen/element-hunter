import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Globe, FileText, Calendar, ExternalLink } from "lucide-react";
import type { MultipleScanData } from "@/types/scan";
import Image from "next/image";

interface MultiplePagesOverviewProps {
  data: MultipleScanData;
}

export function MultiplePagesOverview({ data }: MultiplePagesOverviewProps) {
  const { summary, individualPages } = data;
  const pageUrls = Object.keys(individualPages);
  
  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Multi-Page Scan Summary
          </CardTitle>
          <CardDescription className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {summary.totalPages} pages scanned
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(summary.exportDate).toLocaleDateString()}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {summary.mergedData.overview?.totals?.headings || 0}
              </div>
              <div className="text-xs text-muted-foreground">Total Headings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {summary.mergedData.overview?.totals?.links || 0}
              </div>
              <div className="text-xs text-muted-foreground">Total Links</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {summary.mergedData.overview?.totals?.images || 0}
              </div>
              <div className="text-xs text-muted-foreground">Total Images</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {summary.mergedData.overview?.totals?.technologies || 0}
              </div>
              <div className="text-xs text-muted-foreground">Technologies</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Pages */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Pages</CardTitle>
          <CardDescription>Detailed analysis for each scanned page</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={pageUrls[0]} className="w-full">
            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${Math.min(pageUrls.length, 4)}, 1fr)` }}>
              {pageUrls.slice(0, 4).map((url) => {
                const urlParts = new URL(url);
                const displayName = urlParts.pathname === '/' ? 'Home' : urlParts.pathname.split('/').filter(Boolean).pop() || 'Page';
                return (
                  <TabsTrigger key={url} value={url} className="text-xs">
                    {displayName}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            
            {pageUrls.map((url) => {
              const pageData = individualPages[url];
              const favicon = pageData.meta?.meta?.["og:image"] || pageData.images?.[0]?.src || null;
              
              return (
                <TabsContent key={url} value={url} className="mt-4">
                  <div className="space-y-4">
                    {/* Page Header */}
                    <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="flex-shrink-0">
                        {favicon ? (
                          <Image
                            src={favicon}
                            alt="Page favicon"
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-lg border shadow object-cover bg-white"
                          />
                        ) : (
                          <Globe className="w-12 h-12 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">
                          {pageData.meta?.title || url}
                        </h3>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1 mt-1 truncate"
                        >
                          {url}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <p className="text-sm text-muted-foreground mt-2">
                          {pageData.meta?.meta?.description}
                        </p>
                      </div>
                    </div>

                    {/* Page Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-xl font-bold">
                          {Object.values(pageData.headings).flat().length}
                        </div>
                        <div className="text-xs text-muted-foreground">Headings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold">
                          {(pageData.links.internal?.length || 0) + (pageData.links.external?.length || 0)}
                        </div>
                        <div className="text-xs text-muted-foreground">Links</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold">
                          {pageData.images?.length || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">Images</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold">
                          {pageData.content?.keywords?.length || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">Keywords</div>
                      </div>
                    </div>

                    {/* Key metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Performance</div>
                        <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                          {pageData.performance?.domContentLoaded || 0}ms
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-400">DOM Ready</div>
                      </div>
                      
                      <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <div className="text-sm font-medium text-green-700 dark:text-green-300">Security</div>
                        <div className="text-lg font-bold text-green-900 dark:text-green-100">
                          {pageData.securitySEO?.score || 0}%
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400">Security Score</div>
                      </div>

                      <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                        <div className="text-sm font-medium text-purple-700 dark:text-purple-300">AI Ready</div>
                        <div className="text-lg font-bold text-purple-900 dark:text-purple-100">
                          {pageData.aiOptimization?.score || 0}%
                        </div>
                        <div className="text-xs text-purple-600 dark:text-purple-400">AI Optimization</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
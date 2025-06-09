"use client";

import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import {
  AlertCircle as AlertCircleIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Globe as GlobeIcon,
  Mail as MailIcon,
  Clock as ClockIcon,
  CheckCircle2 as CheckCircleIcon,
  XCircle as XCircleIcon,
  Search as SearchIcon,
  Tag as TagIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type ScanData } from "@/types/scan";
import { calculateSEOScore, getIssues } from "@/lib/seo-utils";
import { type JsonValue } from "@prisma/client/runtime/library";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";

interface ScanListProps {
  scans: Array<{
    id: string;
    url: string;
    data: JsonValue;
    createdAt: Date;
    folders: Array<{
      scanFolder: {
        id: string;
        name: string;
      };
    }>;
  }>;
}

export function ScanList({ scans }: ScanListProps) {
  if (scans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No scans have been performed yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
      {scans
        .filter((scan) => {
          const raw =
            typeof scan.data === "string" ? JSON.parse(scan.data) : scan.data;
          const data = raw && typeof raw.data === "object" ? raw.data : raw;
          return (
            !data.meta?.title?.toLowerCase().includes("test") &&
            !scan.url.toLowerCase().includes("test")
          );
        })
        .map((scan) => {
          const raw =
            typeof scan.data === "string" ? JSON.parse(scan.data) : scan.data;
          const data = raw && typeof raw.data === "object" ? raw.data : raw;

          const score = calculateSEOScore(data as ScanData);
          const issues = getIssues(data as ScanData);
          let links = 0;
          let internalLinks = 0;
          let externalLinks = 0;
          if (data.links) {
            if (typeof data.links.total === "number") {
              links = data.links.total;
            } else {
              internalLinks = Array.isArray(data.links.internal)
                ? data.links.internal.length
                : data.links.internal || 0;
              externalLinks = Array.isArray(data.links.external)
                ? data.links.external.length
                : data.links.external || 0;
              links = internalLinks + externalLinks;
            }
          }
          const emails = data.emails?.length || 0;

          // Fonction pour extraire le nom de domaine
          const getDomainName = (url: string) => {
            try {
              const domain = new URL(url).hostname.replace("www.", "");
              return domain.charAt(0).toUpperCase() + domain.slice(1);
            } catch {
              return url;
            }
          };

          // Fonction pour obtenir la couleur du score
          const getScoreColor = (score: number) => {
            if (score >= 80) return "text-success bg-success/10";
            if (score >= 60) return "text-warning bg-warning/10";
            return "text-destructive bg-destructive/10";
          };

          return (
            <Link
              href={`/scans/${scan.id}`}
              key={scan.id}
              className="block group"
            >
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/20">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between gap-4 min-w-0">
                    <div className="space-y-1 min-w-0 flex-1">
                      <h3 className="font-semibold text-lg text-foreground line-clamp-1">
                        {data.meta?.title || getDomainName(scan.url)}
                      </h3>
                    </div>
                    <div
                      className={cn(
                        "px-2.5 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 flex-shrink-0",
                        getScoreColor(score)
                      )}
                    >
                      {score >= 80 ? (
                        <CheckCircleIcon className="w-4 h-4" />
                      ) : score >= 60 ? (
                        <AlertCircleIcon className="w-4 h-4" />
                      ) : (
                        <XCircleIcon className="w-4 h-4" />
                      )}
                      {score}%
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-2 space-y-4">
                  {/* Preview de l'image */}
                  <div className="w-full aspect-video mb-3 rounded-lg overflow-hidden border bg-muted relative">
                    {data.images &&
                    data.images.length > 0 &&
                    data.images[0].src ? (
                      <Image
                        src={data.images[0].src}
                        alt={data.images[0].alt || "Preview image"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <SearchIcon className="w-4 h-4" />
                      <span>Description</span>
                    </div>
                    <p className="text-sm text-foreground line-clamp-2">
                      {data.meta?.description || "No description available"}
                    </p>
                  </div>

                  {/* Mots-clés */}
                  {data.meta?.keywords && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <TagIcon className="w-4 h-4" />
                        <span>Keywords</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {data.meta.keywords
                          .split(",")
                          .slice(0, 3)
                          .map((keyword: string, i: number) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-xs font-normal"
                            >
                              {keyword.trim()}
                            </Badge>
                          ))}
                        {data.meta.keywords.split(",").length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{data.meta.keywords.split(",").length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Statistiques */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-sm">
                        <LinkIcon className="w-4 h-4 text-primary" />
                        <span>{links} links</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <GlobeIcon className="w-4 h-4 text-accent" />
                        <span>{externalLinks} external</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-sm">
                        <MailIcon className="w-4 h-4 text-muted-foreground" />
                        <span>{emails} emails</span>
                      </div>
                    </div>
                  </div>

                  {/* Problèmes et Date */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    {issues > 0 ? (
                      <div className="flex items-center gap-1.5 text-destructive text-sm">
                        <AlertCircleIcon className="w-4 h-4" />
                        <span>{issues} problèmes</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-success text-sm">
                        <CheckCircleIcon className="w-4 h-4" />
                        <span>No issues</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <ClockIcon className="w-3.5 h-3.5" />
                      <span>
                        {formatDistanceToNow(scan.createdAt, {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
    </div>
  );
}

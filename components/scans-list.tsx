"use client";

import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import type { Scan as DbScan } from "@/types/scan";
import { type JsonValue } from "@prisma/client/runtime/library";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateSEOScore } from "@/lib/seo-utils";
import {
  Link as LinkIcon,
  Calendar,
  Search,
  Tag,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import type { ScanData as GlobalScanData } from "@/types/scan";

type ScanData = GlobalScanData;

interface Scan extends Omit<DbScan, "data"> {
  data: JsonValue;
}

interface ScansListProps {
  scans: Scan[];
}

function parseScanData(data: JsonValue): ScanData | null {
  if (!data || typeof data !== "object") return null;

  const scanData = data as Record<string, unknown>;
  // keywords: toujours string[]
  let keywords: string[] | undefined = undefined;
  const rawKeywords: unknown = (scanData.meta as { keywords?: unknown })
    ?.keywords;
  if (Array.isArray(rawKeywords)) {
    keywords = rawKeywords;
  } else if (typeof rawKeywords === "string") {
    keywords = rawKeywords
      .split(",")
      .map((k: string) => k.trim())
      .filter(Boolean);
  }
  return {
    ...(scanData as ScanData),
    meta: {
      ...(scanData.meta as ScanData["meta"]),
      keywords,
    },
  };
}

export function ScansList({ scans }: ScansListProps) {
  if (scans.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Aucun scan pour l&apos;instant. Utilisez l&apos;extension Chrome pour en
        ajouter.
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
      {scans.map((scan) => {
        const scanData = parseScanData(scan.data) as ScanData | null;
        const title = scanData?.meta?.title || scan.url;
        const metaDescription = scanData?.meta?.description;
        const h1 = scanData?.headings?.find((h) => h.level === 1)?.text;
        const score = scanData ? calculateSEOScore(scanData) : 0;
        let image: string | undefined = undefined;
        if (Array.isArray(scanData?.images) && scanData.images[0]?.src) {
          image = scanData.images[0].src;
        }
        // Score color
        const getScoreColor = (score: number) => {
          if (score >= 80) return "text-green-700 bg-green-100";
          if (score >= 60) return "text-yellow-700 bg-yellow-100";
          return "text-red-700 bg-red-100";
        };
        // Score icon
        const getScoreIcon = (score: number) => {
          if (score >= 80) return <CheckCircle2 className="w-4 h-4" />;
          if (score >= 60) return <AlertCircle className="w-4 h-4" />;
          return <XCircle className="w-4 h-4" />;
        };
        return (
          <Card key={scan.id} className="flex flex-col h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg line-clamp-1">{scan.url}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <LinkIcon className="w-4 h-4 text-primary" />
                <a
                  href={scan.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-700 line-clamp-1"
                >
                  {scan.url}
                </a>
              </CardDescription>
            </CardHeader>
            {image && (
              <div className="relative w-full aspect-video mb-2 rounded-lg overflow-hidden border bg-muted">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            <CardContent className="flex-1 flex flex-col gap-2 p-4 pt-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {formatDistanceToNow(new Date(scan.createdAt), {
                  addSuffix: true,
                  locale: fr,
                })}
              </div>
              {metaDescription && (
                <div className="flex items-center gap-2 text-sm">
                  <Search className="w-4 h-4 text-primary" />
                  <span className="line-clamp-2">{metaDescription}</span>
                </div>
              )}
              {h1 && (
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="w-4 h-4 text-accent" />
                  <span className="line-clamp-1 font-medium">{h1}</span>
                </div>
              )}
              {scanData?.meta?.keywords && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {scanData.meta.keywords.slice(0, 3).map((kw, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="text-xs font-normal"
                    >
                      {kw}
                    </Badge>
                  ))}
                  {scanData.meta.keywords.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{scanData.meta.keywords.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex items-center justify-between gap-2 border-t pt-4 mt-2">
              <div
                className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(
                  score
                )}`}
              >
                {getScoreIcon(score)}
                {score}% SEO
              </div>
              <a
                href={scan.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs underline text-blue-700 hover:text-blue-900"
              >
                Voir la page
              </a>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

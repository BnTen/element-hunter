import { type ScanData } from "@/types/scan";

export function calculateSEOScore(data: ScanData): number {
  let score = 0;
  if (data.meta?.title) score += 15;
  if (data.meta?.description) score += 15;
  if (data.meta?.keywords) score += 10;
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
  if (
    data.links?.internal &&
    (Array.isArray(data.links.internal)
      ? data.links.internal.length > 0
      : data.links.internal > 0)
  )
    score += 2;
  if (
    data.links?.external &&
    (Array.isArray(data.links.external)
      ? data.links.external.length > 0
      : data.links.external > 0)
  )
    score += 1;
  return Math.min(score, 100);
}

export function getIssues(data: ScanData): number {
  let issues = 0;
  if (!data.meta?.title) issues++;
  if (!data.meta?.description) issues++;
  if (data.images && data.images.filter((img) => !img.alt).length > 0) issues++;
  if (
    !data.links?.internal ||
    (Array.isArray(data.links.internal)
      ? data.links.internal.length === 0
      : data.links.internal === 0)
  )
    issues++;
  return issues;
}

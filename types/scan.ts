import { type JsonValue } from "@prisma/client/runtime/library";

export interface Heading {
  level: number;
  text: string;
}

export interface Link {
  href: string;
  text?: string;
}

export interface ScanData {
  meta?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogTags?: Record<string, string>;
    twitterTags?: Record<string, string>;
  };
  content?: {
    paragraphs?: string[];
    keywords?: Array<{ word: string; count: number }>;
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
    total?: number;
    internal?: Link[];
    external?: Link[];
  };
  headings?: Heading[];
  emails?: string[];
}

export interface Scan {
  id: string;
  createdAt: Date;
  userId: string;
  url: string;
  data: JsonValue;
  folderId?: string | null;
}

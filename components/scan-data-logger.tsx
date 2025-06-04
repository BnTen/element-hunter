"use client";

import { useEffect } from "react";

interface Heading {
  text: string;
  position?: {
    top: number;
    left: number;
  };
}

interface Keyword {
  word: string;
  count: number;
}

interface Link {
  url: string;
  text: string;
}

interface Image {
  src: string;
  alt: string;
  width: number;
  height: number;
  loading: string;
}

interface MetaData {
  title: string;
  description: string;
  keywords: string;
  viewport: string;
  robots: string | null;
  ogTags: {
    [key: string]: string;
  };
  twitterTags: {
    [key: string]: string;
  };
}

interface BasicData {
  title: string;
  charset: string;
  language: string | null;
  metaDescription: string;
}

interface ContentData {
  paragraphs: string[];
  emphasized: string[];
  strong: string[];
  keywords: Keyword[];
}

interface TechnologiesData {
  analytics: string[];
  hosting: string[];
  javascriptLibraries: string[];
  uiLibraries: string[];
  webTechnologies: string[];
}

interface ScanData {
  basic: BasicData;
  content: ContentData;
  emails: string[];
  headings: {
    h1: Heading[];
    h2: Heading[];
    h3: Heading[];
    h4: Heading[];
    h5: Heading[];
    h6: Heading[];
  };
  images: Image[];
  links: {
    external: Link[];
    internal: Link[];
  };
  meta: MetaData;
  technologies: TechnologiesData;
}

export function ScanDataLogger({ data }: { data: ScanData }) {
  useEffect(() => {
    if (data) {
      // Data is being used by the UI components
    }
  }, [data]);
  return null;
}

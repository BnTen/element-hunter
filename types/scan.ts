import { type JsonValue } from "@prisma/client/runtime/library";

export interface Heading {
  level?: number; // Legacy
  text: string;
  position?: {
    top: number;
    left: number;
  };
}

export interface HeadingsByLevel {
  h1?: Heading[];
  h2?: Heading[];
  h3?: Heading[];
  h4?: Heading[];
  h5?: Heading[];
  h6?: Heading[];
}

export interface Link {
  href?: string; // Legacy
  url?: string; // New format
  text?: string;
  nofollow?: boolean;
}

export interface Image {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  loading?: string;
  hasLazyLoad?: boolean;
}

export interface Technologies {
  frameworks?: string[];
  ui_libraries?: string[];
  analytics?: string[];
  marketing?: string[];
  cms?: string[];
  ecommerce?: string[];
  hosting?: string[];
  videoPlayers?: string[];
  javascript_libraries?: string[];
  webTechnologies?: string[];
  webtechnologies?: string[]; // Alternative naming
  security?: string[];
  fonts?: string[];
  maps?: string[];
  build_tools?: string[];
  monitoring?: string[];
  ab_testing?: string[];
  consent_management?: string[];
  payments?: string[];
  cdn?: string[];
  search?: string[];
  tag_managers?: string[];
  email_marketing?: string[];
}

export interface PerformanceData {
  loadTime?: number;
  resources?: Array<{
    name: string;
    type: string;
    duration: number;
    size: number;
  }>;
  domContentLoaded?: number;
  domContentLoadedStatus?: string;
  fullLoad?: number;
  fullLoadStatus?: string;
  blockingScripts?: string[];
  blockingScriptsCount?: number;
}

export interface AccessibilityData {
  ariaLabels?: Array<{
    element: string;
    label: string;
  }>;
  ariaLabelsCount?: number;
  roles?: Array<{
    element: string;
    role: string;
  }>;
  rolesCount?: number;
}

export interface SecurityData {
  hasHttps?: boolean;
  hasCSP?: boolean;
  hasHSTS?: boolean;
}

export interface AIOptimization {
  hasStructuredData?: boolean;
  hasJSONLD?: boolean;
  hasFAQSchema?: boolean;
  hasMicrodata?: boolean;
  hasRDFa?: boolean;
  structuredDataTypes?: string[];
  jsonLDScripts?: Array<{
    type: string;
    context: string;
    data?: any;
  }>;
  faqSchemas?: any[];
  score?: number;
  recommendations?: string[];
}

export interface SecuritySEO {
  mixedContent?: {
    hasMixedContent: boolean;
    httpImages: string[];
    httpScripts: string[];
    httpLinks: string[];
  };
  hasMixedContent?: boolean;
  xRobotsTag?: string;
  securityHeaders?: {
    hasXFrameOptions: boolean;
    hasXContentTypeOptions: boolean;
    hasReferrerPolicy: boolean;
  };
  issues?: string[];
  score?: number;
}

export interface StructuredData {
  jsonLd?: Array<{
    type: string;
    context: string;
    data?: any;
  }>;
  microdata?: any[];
  rdfa?: any[];
}

export interface OverviewData {
  totals?: {
    headings: number;
    words: number;
    links: number;
    images: number;
    technologies: number;
  };
  pageInfo?: {
    url: string;
    title: string;
    description: string;
  };
  security?: SecurityData;
  ai?: {
    hasStructuredData: boolean;
    hasJSONLD: boolean;
    hasFAQSchema: boolean;
    jsonLDScriptsCount: number;
    score: number;
  };
  securitySEO?: {
    hasMixedContent: boolean;
    httpImagesCount: number;
    httpScriptsCount: number;
    score: number;
  };
  performance?: {
    domContentLoaded: number;
    domContentLoadedStatus: string;
    fullLoad: number;
    fullLoadStatus: string;
    blockingScriptsCount: number;
    blockingScripts: string[];
  };
  accessibility?: {
    ariaLabelsCount: number;
    rolesCount: number;
  };
}

// Format simple page
export interface SimpleScanData {
  url: string;
  headings: HeadingsByLevel;
  meta: {
    title: string;
    meta: Record<string, string>;
  };
  content: {
    paragraphs: string[];
    emphasized: string[];
    strong: string[];
    keywords: Array<{ word: string; count: number }>;
  };
  links: {
    internal: Link[];
    external: Link[];
    social: Link[];
  };
  images: Image[];
  emails: string[];
  technologies: Technologies;
  structuredData: StructuredData;
  aiOptimization: AIOptimization;
  securitySEO: SecuritySEO;
  performance: PerformanceData;
  accessibility: AccessibilityData;
  security: SecurityData;
  overview: OverviewData;
}

// Format multiple pages
export interface MultipleScanData {
  summary: {
    totalPages: number;
    exportDate: string;
    mergedData: SimpleScanData;
  };
  individualPages: Record<string, Omit<SimpleScanData, 'overview'>>;
}

// Union type pour les nouveaux formats
export type NewScanData = SimpleScanData | MultipleScanData;

// Type pour vérifier si c'est multiple pages
export function isMultipleScanData(data: any): data is MultipleScanData {
  return data && 'summary' in data && 'individualPages' in data;
}

// Legacy interface pour compatibilité
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

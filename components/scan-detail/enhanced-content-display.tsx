import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Hash, 
  Link as LinkIcon, 
  ExternalLink, 
  Mail,
  Heading1,
  Heading2,
  Heading3,
  MessageSquare,
  Bold,
  Italic,
  Search
} from "lucide-react";
import type { SimpleScanData, HeadingsByLevel, Link } from "@/types/scan";
import { KeywordBarChart } from "@/components/ui/keyword-bar-chart";

interface EnhancedContentDisplayProps {
  data: SimpleScanData;
}

export function EnhancedContentDisplay({ data }: EnhancedContentDisplayProps) {
  const headingIcons = {
    h1: Heading1,
    h2: Heading2,
    h3: Heading3,
    h4: Hash,
    h5: Hash,
    h6: Hash,
  };

  const getAllHeadings = (headings: HeadingsByLevel) => {
    const allHeadings: Array<{ level: string; text: string; position?: { top: number; left: number } }> = [];
    
    Object.entries(headings).forEach(([level, headingList]) => {
      if (headingList) {
        headingList.forEach(heading => {
          allHeadings.push({
            level,
            text: heading.text,
            position: heading.position
          });
        });
      }
    });
    
    return allHeadings;
  };

  const allHeadings = getAllHeadings(data.headings);
  const totalLinks = (data.links.internal?.length || 0) + (data.links.external?.length || 0) + (data.links.social?.length || 0);

  const getKeywordScore = (count: number, maxCount: number) => {
    return Math.round((count / maxCount) * 100);
  };

  const maxKeywordCount = Math.max(...(data.content?.keywords?.map(k => k.count) || [1]));

  return (
    <div className="space-y-6">
      {/* Content Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Headings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allHeadings.length}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Structure elements
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Paragraphs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.content?.paragraphs?.length || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Content blocks
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLinks}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {data.links.external?.length || 0} external
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Emails
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.emails?.length || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Contact emails
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Content Sections */}
      <Tabs defaultValue="headings" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="headings">Headings</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="emails">Emails</TabsTrigger>
        </TabsList>

        <TabsContent value="headings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Heading Structure</CardTitle>
              <CardDescription>Page heading hierarchy and positioning</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {allHeadings.length > 0 ? (
                    allHeadings.map((heading, index) => {
                      const Icon = headingIcons[heading.level as keyof typeof headingIcons];
                      return (
                        <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                          <Icon className="h-4 w-4 mt-1 text-primary" />
                          <div className="flex-1">
                            <div className="font-medium">{heading.text}</div>
                            <div className="flex items-center gap-4 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {heading.level.toUpperCase()}
                              </Badge>
                              {heading.position && (
                                <span className="text-xs text-muted-foreground">
                                  Position: {heading.position.top}px, {heading.position.left}px
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Hash className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No headings found</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Paragraphs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {data.content?.paragraphs?.map((paragraph, index) => (
                      <div key={index} className="text-sm p-2 bg-muted/50 rounded">
                        {paragraph.length > 100 ? `${paragraph.substring(0, 100)}...` : paragraph}
                      </div>
                    )) || <p className="text-muted-foreground text-sm">No paragraphs found</p>}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bold className="h-4 w-4" />
                    Emphasized Text
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[90px]">
                    <div className="space-y-1">
                      {data.content?.strong?.map((text, index) => (
                        <Badge key={index} variant="secondary" className="text-xs mr-1 mb-1">
                          {text}
                        </Badge>
                      )) || <p className="text-muted-foreground text-xs">None</p>}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Italic className="h-4 w-4" />
                    Italic Text
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[90px]">
                    <div className="space-y-1">
                      {data.content?.emphasized?.map((text, index) => (
                        <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                          {text}
                        </Badge>
                      )) || <p className="text-muted-foreground text-xs">None</p>}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="links" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {['internal', 'external', 'social'].map((linkType) => {
              const links = data.links[linkType as keyof typeof data.links] as Link[] || [];
              const icons = {
                internal: LinkIcon,
                external: ExternalLink,
                social: MessageSquare
              };
              const Icon = icons[linkType as keyof typeof icons];

              return (
                <Card key={linkType}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Icon className="h-4 w-4" />
                      {linkType.charAt(0).toUpperCase() + linkType.slice(1)} Links
                    </CardTitle>
                    <CardDescription>{links.length} links found</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-2">
                        {links.map((link, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-muted/50 rounded text-xs">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">
                                {link.text || "No text"}
                              </div>
                              <div className="text-muted-foreground truncate">
                                {link.url || link.href}
                              </div>
                              {link.nofollow && (
                                <Badge variant="outline" className="text-xs mt-1">
                                  nofollow
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                        {links.length === 0 && (
                          <p className="text-muted-foreground text-center py-4">
                            No {linkType} links found
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="keywords" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Keyword Analysis
              </CardTitle>
              <CardDescription>
                {data.content?.keywords?.length || 0} keywords analyzed
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.content?.keywords && data.content.keywords.length > 0 ? (
                <div className="space-y-4">
                  <KeywordBarChart keywords={data.content.keywords} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.content.keywords.slice(0, 10).map((keyword, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="font-medium text-sm">{keyword.word}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{keyword.count}</span>
                          <Progress 
                            value={getKeywordScore(keyword.count, maxKeywordCount)} 
                            className="w-16 h-2"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No keywords analyzed</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emails" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Addresses
              </CardTitle>
              <CardDescription>
                {data.emails?.length || 0} email addresses found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.emails && data.emails.length > 0 ? (
                <div className="space-y-2">
                  {data.emails.map((email, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <a 
                        href={`mailto:${email}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {email}
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No email addresses found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
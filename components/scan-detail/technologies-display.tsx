import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Code, 
  Palette, 
  BarChart3, 
  Megaphone, 
  FileText, 
  ShoppingCart,
  Server,
  Play,
  Zap,
  Globe,
  Shield,
  Type,
  Map,
  Wrench,
  Monitor,
  TestTube,
  Cookie,
  CreditCard,
  Cloud,
  Search,
  Tag,
  Mail
} from "lucide-react";
import type { Technologies } from "@/types/scan";

interface TechnologiesDisplayProps {
  technologies: Technologies;
}

const technologyIcons: Record<string, any> = {
  frameworks: Code,
  ui_libraries: Palette,
  analytics: BarChart3,
  marketing: Megaphone,
  cms: FileText,
  ecommerce: ShoppingCart,
  hosting: Server,
  videoPlayers: Play,
  javascript_libraries: Zap,
  webTechnologies: Globe,
  webtechnologies: Globe,
  security: Shield,
  fonts: Type,
  maps: Map,
  build_tools: Wrench,
  monitoring: Monitor,
  ab_testing: TestTube,
  consent_management: Cookie,
  payments: CreditCard,
  cdn: Cloud,
  search: Search,
  tag_managers: Tag,
  email_marketing: Mail,
};

const technologyLabels: Record<string, string> = {
  frameworks: "Frameworks",
  ui_libraries: "UI Libraries",
  analytics: "Analytics",
  marketing: "Marketing",
  cms: "CMS",
  ecommerce: "E-commerce",
  hosting: "Hosting",
  videoPlayers: "Video Players",
  javascript_libraries: "JS Libraries",
  webTechnologies: "Web Technologies",
  webtechnologies: "Web Technologies",
  security: "Security",
  fonts: "Fonts",
  maps: "Maps",
  build_tools: "Build Tools",
  monitoring: "Monitoring",
  ab_testing: "A/B Testing",
  consent_management: "Consent Management",
  payments: "Payments",
  cdn: "CDN",
  search: "Search",
  tag_managers: "Tag Managers",
  email_marketing: "Email Marketing",
};

export function TechnologiesDisplay({ technologies }: TechnologiesDisplayProps) {
  const techEntries = Object.entries(technologies)
    .filter(([_, tools]) => tools && tools.length > 0)
    .sort(([a], [b]) => technologyLabels[a]?.localeCompare(technologyLabels[b] || b) || 0);

  if (techEntries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Technologies</CardTitle>
          <CardDescription>No technologies detected</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Technologies Detected
        </CardTitle>
        <CardDescription>
          {techEntries.length} categories • {techEntries.reduce((acc, [_, tools]) => acc + tools!.length, 0)} total technologies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-6">
            {techEntries.map(([category, tools]) => {
              const Icon = technologyIcons[category] || Code;
              const label = technologyLabels[category] || category;
              
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <h4 className="font-medium text-sm">{label}</h4>
                    <Badge variant="outline" className="text-xs">
                      {tools!.length}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 ml-6">
                    {tools!.map((tool: string, index: number) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-xs"
                      >
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
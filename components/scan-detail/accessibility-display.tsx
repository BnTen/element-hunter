import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Tag, CheckCircle, AlertTriangle } from "lucide-react";
import type { AccessibilityData } from "@/types/scan";

interface AccessibilityDisplayProps {
  accessibility: AccessibilityData;
}

export function AccessibilityDisplay({ accessibility }: AccessibilityDisplayProps) {
  const ariaLabelsCount = accessibility.ariaLabelsCount || accessibility.ariaLabels?.length || 0;
  const rolesCount = accessibility.rolesCount || accessibility.roles?.length || 0;
  
  const totalAccessibilityFeatures = ariaLabelsCount + rolesCount;
  const hasGoodAccessibility = totalAccessibilityFeatures >= 5;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Accessibility Overview */}
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Accessibility
          </CardTitle>
          {hasGoodAccessibility ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">ARIA Labels</div>
                <div className="text-xs text-muted-foreground">Screen reader labels</div>
              </div>
              <div className="text-2xl font-bold">{ariaLabelsCount}</div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">ARIA Roles</div>
                <div className="text-xs text-muted-foreground">Semantic element roles</div>
              </div>
              <div className="text-2xl font-bold">{rolesCount}</div>
            </div>

            <div className="pt-2 border-t">
              <div className="flex items-center gap-2">
                <Badge 
                  variant={hasGoodAccessibility ? "default" : "secondary"}
                  className="text-xs"
                >
                  {hasGoodAccessibility ? "Good" : "Needs Improvement"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {totalAccessibilityFeatures} accessibility features
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Accessibility Details
          </CardTitle>
          <CardDescription>ARIA labels and roles implementation</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {/* ARIA Labels */}
              {accessibility.ariaLabels && accessibility.ariaLabels.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Tag className="h-3 w-3" />
                    ARIA Labels ({accessibility.ariaLabels.length})
                  </h4>
                  <div className="space-y-2">
                    {accessibility.ariaLabels.map((aria, index) => (
                      <div key={index} className="p-2 bg-muted rounded-md">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-blue-600">&lt;{aria.element}&gt;</span>
                          <Badge variant="outline" className="text-xs">aria-label</Badge>
                        </div>
                        <div className="text-xs mt-1 text-muted-foreground">
                          "{aria.label}"
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ARIA Roles */}
              {accessibility.roles && accessibility.roles.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Eye className="h-3 w-3" />
                    ARIA Roles ({accessibility.roles.length})
                  </h4>
                  <div className="space-y-2">
                    {accessibility.roles.map((role, index) => (
                      <div key={index} className="p-2 bg-muted rounded-md">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-green-600">&lt;{role.element}&gt;</span>
                          <Badge variant="outline" className="text-xs">{role.role}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {totalAccessibilityFeatures === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No accessibility features detected</p>
                  <p className="text-xs">Consider adding ARIA labels and roles</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
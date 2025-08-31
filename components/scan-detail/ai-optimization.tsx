import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle, Brain, Lightbulb, Code2 } from "lucide-react";
import type { AIOptimization, StructuredData } from "@/types/scan";

interface AIOptimizationProps {
  aiOptimization: AIOptimization;
  structuredData?: StructuredData;
}

export function AIOptimizationDisplay({ aiOptimization, structuredData }: AIOptimizationProps) {
  const score = aiOptimization.score || 0;
  
  const features = [
    {
      name: "Structured Data",
      enabled: aiOptimization.hasStructuredData,
      description: "Machine-readable content structure"
    },
    {
      name: "JSON-LD",
      enabled: aiOptimization.hasJSONLD,
      description: "JSON Linked Data implementation"
    },
    {
      name: "FAQ Schema",
      enabled: aiOptimization.hasFAQSchema,
      description: "Frequently Asked Questions markup"
    },
    {
      name: "Microdata",
      enabled: aiOptimization.hasMicrodata,
      description: "HTML microdata attributes"
    },
    {
      name: "RDFa",
      enabled: aiOptimization.hasRDFa,
      description: "Resource Description Framework attributes"
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* AI Score */}
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Optimization Score
          </CardTitle>
          {score >= 80 ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : score >= 60 ? (
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2">{score}%</div>
          <Progress value={score} className="h-2 mb-4" />
          <div className="space-y-2">
            {features.map((feature) => (
              <div key={feature.name} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{feature.name}</div>
                  <div className="text-xs text-muted-foreground">{feature.description}</div>
                </div>
                {feature.enabled ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Structured Data Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            Structured Data
          </CardTitle>
          <CardDescription>
            Schema.org and structured markup implementation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Structured Data Types */}
          {aiOptimization.structuredDataTypes && aiOptimization.structuredDataTypes.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2">Data Types</div>
              <div className="flex flex-wrap gap-1">
                {aiOptimization.structuredDataTypes.map((type, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* JSON-LD Scripts */}
          {structuredData?.jsonLd && structuredData.jsonLd.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2">JSON-LD Schemas</div>
              <div className="space-y-2">
                {structuredData.jsonLd.slice(0, 5).map((schema, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div>
                      <div className="text-sm font-medium">{schema.type}</div>
                      <div className="text-xs text-muted-foreground">{schema.context}</div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {schema.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {aiOptimization.recommendations && aiOptimization.recommendations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Recommendations</span>
              </div>
              <ul className="space-y-1">
                {aiOptimization.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs">
                    <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
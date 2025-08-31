import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle, XCircle, Shield, Lock, Eye } from "lucide-react";
import type { SecurityData, SecuritySEO } from "@/types/scan";

interface SecurityOverviewProps {
  security: SecurityData;
  securitySEO: SecuritySEO;
}

export function SecurityOverview({ security, securitySEO }: SecurityOverviewProps) {
  const securityScore = securitySEO.score || 0;
  const hasIssues = securitySEO.issues && securitySEO.issues.length > 0;

  const securityFeatures = [
    {
      name: "HTTPS",
      enabled: security.hasHttps,
      description: "Secure connection protocol"
    },
    {
      name: "Content Security Policy",
      enabled: security.hasCSP,
      description: "CSP headers present"
    },
    {
      name: "HTTP Strict Transport Security",
      enabled: security.hasHSTS,
      description: "HSTS enforcement"
    },
  ];

  const mixedContentData = securitySEO.mixedContent;
  const securityHeaders = securitySEO.securityHeaders;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Security Score */}
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Score
          </CardTitle>
          {securityScore >= 80 ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : securityScore >= 60 ? (
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2">{securityScore}%</div>
          <Progress value={securityScore} className="h-2 mb-4" />
          <div className="space-y-2">
            {securityFeatures.map((feature) => (
              <div key={feature.name} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{feature.name}</div>
                  <div className="text-xs text-muted-foreground">{feature.description}</div>
                </div>
                {feature.enabled ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security Details
          </CardTitle>
          <CardDescription>Security headers and mixed content analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mixed Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Mixed Content</span>
              {mixedContentData?.hasMixedContent ? (
                <Badge variant="destructive" className="text-xs">Issues Found</Badge>
              ) : (
                <Badge variant="default" className="text-xs">Clean</Badge>
              )}
            </div>
            {mixedContentData && (
              <div className="text-xs text-muted-foreground space-y-1">
                <div>HTTP Images: {mixedContentData.httpImages?.length || 0}</div>
                <div>HTTP Scripts: {mixedContentData.httpScripts?.length || 0}</div>
                <div>HTTP Links: {mixedContentData.httpLinks?.length || 0}</div>
              </div>
            )}
          </div>

          {/* Security Headers */}
          {securityHeaders && (
            <div>
              <div className="text-sm font-medium mb-2">Security Headers</div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>X-Frame-Options</span>
                  {securityHeaders.hasXFrameOptions ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <XCircle className="h-3 w-3 text-red-500" />
                  )}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>X-Content-Type-Options</span>
                  {securityHeaders.hasXContentTypeOptions ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <XCircle className="h-3 w-3 text-red-500" />
                  )}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Referrer-Policy</span>
                  {securityHeaders.hasReferrerPolicy ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <XCircle className="h-3 w-3 text-red-500" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* X-Robots-Tag */}
          {securitySEO.xRobotsTag && (
            <div>
              <div className="text-sm font-medium mb-1">X-Robots-Tag</div>
              <div className="text-xs font-mono bg-muted p-2 rounded">
                {securitySEO.xRobotsTag}
              </div>
            </div>
          )}

          {/* Issues */}
          {hasIssues && (
            <div>
              <div className="text-sm font-medium mb-2 text-red-600">Security Issues</div>
              <ul className="space-y-1">
                {securitySEO.issues!.map((issue, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs">
                    <AlertTriangle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-red-600">{issue}</span>
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
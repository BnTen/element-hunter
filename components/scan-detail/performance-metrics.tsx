import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Clock, Zap } from "lucide-react";
import type { PerformanceData } from "@/types/scan";

interface PerformanceMetricsProps {
  performance: PerformanceData;
}

export function PerformanceMetrics({ performance }: PerformanceMetricsProps) {
  const getDomContentLoadedStatus = () => {
    if (!performance.domContentLoaded) return "unknown";
    if (performance.domContentLoaded < 1000) return "excellent";
    if (performance.domContentLoaded < 2000) return "good";
    if (performance.domContentLoaded < 3000) return "average";
    return "poor";
  };

  const getFullLoadStatus = () => {
    if (!performance.fullLoad) return "unknown";
    if (performance.fullLoad < 2000) return "excellent";
    if (performance.fullLoad < 4000) return "good";
    if (performance.fullLoad < 6000) return "average";
    return "poor";
  };

  const domStatus = getDomContentLoadedStatus();
  const fullStatus = getFullLoadStatus();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">DOM Ready</CardTitle>
          <Clock className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {performance.domContentLoaded ? `${performance.domContentLoaded}ms` : "N/A"}
          </div>
          <div className="flex items-center gap-2 mt-2">
            {domStatus === "excellent" && <CheckCircle className="h-3 w-3 text-green-500" />}
            {domStatus === "poor" && <AlertTriangle className="h-3 w-3 text-red-500" />}
            <Badge 
              variant={domStatus === "excellent" ? "default" : domStatus === "poor" ? "destructive" : "secondary"}
              className="text-xs"
            >
              {performance.domContentLoadedStatus || domStatus}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">Full Load</CardTitle>
          <Zap className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {performance.fullLoad ? `${performance.fullLoad}ms` : "N/A"}
          </div>
          <div className="flex items-center gap-2 mt-2">
            {fullStatus === "excellent" && <CheckCircle className="h-3 w-3 text-green-500" />}
            {fullStatus === "poor" && <AlertTriangle className="h-3 w-3 text-red-500" />}
            <Badge 
              variant={fullStatus === "excellent" ? "default" : fullStatus === "poor" ? "destructive" : "secondary"}
              className="text-xs"
            >
              {performance.fullLoadStatus || fullStatus}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">Load Time</CardTitle>
          <Clock className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {performance.loadTime ? `${Math.round(performance.loadTime)}ms` : "N/A"}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Total page load time
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">Blocking Scripts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {performance.blockingScriptsCount || 0}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Scripts blocking render
          </p>
        </CardContent>
      </Card>

      {performance.resources && performance.resources.length > 0 && (
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>Resource Loading</CardTitle>
            <CardDescription>Detailed resource timing analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {performance.resources.slice(0, 10).map((resource, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{resource.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {resource.type} • {Math.round(resource.size / 1024)}KB
                    </div>
                  </div>
                  <div className="text-sm font-mono">
                    {Math.round(resource.duration)}ms
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
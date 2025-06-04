import * as React from "react";

export interface Keyword {
  word: string;
  count: number;
}

export interface KeywordBarChartProps {
  keywords: Keyword[];
}

export function KeywordBarChart({ keywords }: KeywordBarChartProps) {
  if (!keywords || keywords.length === 0) return null;
  const max = Math.max(...keywords.map((k) => k.count));

  return (
    <div className="space-y-2 w-min min-w-full overflow-x-auto">
      {keywords.map((k) => (
        <div key={k.word} className="flex items-center gap-2 group min-w-0">
          <span
            className="w-28 truncate text-xs font-medium text-gray-700 break-all"
            title={k.word}
          >
            {k.word}
          </span>
          <div className="flex-1 relative min-w-0">
            <div className="h-3 bg-green-100 rounded-full overflow-hidden shadow-sm">
              <div
                className="h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500 group-hover:brightness-110 group-hover:shadow-lg"
                style={{ width: `${(k.count / max) * 100}%` }}
              >
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-10">
                  <div className="px-2 py-1 rounded bg-gray-900 text-white text-xs shadow-lg mt-[-6px] whitespace-nowrap">
                    {k.word} : {k.count}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <span className="ml-2 text-xs text-gray-500 font-mono w-6 text-right">
            {k.count}
          </span>
        </div>
      ))}
    </div>
  );
}

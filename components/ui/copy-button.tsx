"use client";

import * as React from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";

interface CopyButtonProps extends Omit<ButtonProps, "onClick" | "children"> {
  value: string;
  onCopied?: () => void;
}

export function CopyButton({
  value,
  onCopied,
  className,
  variant = "default",
  ...props
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (hasCopied) {
      const timeout = setTimeout(() => setHasCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [hasCopied]);

  return (
    <Button
      variant={hasCopied ? "glossySuccess" : variant}
      size="default"
      className={cn("relative transition-all hover:scale-105", className)}
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setHasCopied(true);
        onCopied?.();
      }}
      {...props}
    >
      <span className="sr-only">Copy to clipboard</span>
      {hasCopied ? (
        <CheckIcon className="h-4 w-4" />
      ) : (
        <CopyIcon className="h-4 w-4" />
      )}
      <span className="ml-2">{hasCopied ? "Copied!" : "Copy"}</span>
    </Button>
  );
}

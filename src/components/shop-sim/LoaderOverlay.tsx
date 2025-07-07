import { Loader2 } from "lucide-react";
import React from "react";

export function LoaderOverlay({ loading }: { loading: boolean }) {
  if (!loading) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80">
      <Loader2 className="animate-spin w-12 h-12 text-primary" />
      <span className="ml-4 text-lg font-semibold">Loading 3D Scene...</span>
    </div>
  );
}

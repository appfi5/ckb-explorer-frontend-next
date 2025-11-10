import type { ReactNode } from "react";
import AlertIcon from "@/assets/icons/alert.svg?component"


export default function ErrorMessage({ children }: { children: ReactNode }) { 
  if (!children) return null;

  return (
    <div className="flex flex-row flex-wrap items-center gap-1 text-destructive">
      <AlertIcon />
      {children}
    </div>
  )
}
"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { useTheme } from "../Theme"

const Toaster = ({ ...props }: ToasterProps) => {
  const [theme] = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      position="top-right"
      duration={1000}
      style={
        {
          "--normal-bg": "var(--popover-background)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }

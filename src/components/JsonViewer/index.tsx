import type { ReactJsonViewProps, ThemeObject } from "@microlink/react-json-view";
import dynamic from "next/dynamic";
import { useTheme } from "../Theme";


const JsonView = dynamic(() => import("@microlink/react-json-view"), {
  ssr: false
})

type JsonViewerProps = Omit<ReactJsonViewProps, "theme"> & {
  theme?: ThemeObject
}
export default function JsonViewer(props: JsonViewerProps) {
  const [theme] = useTheme();
  const isDarkTheme = theme === "dark";

  return (
    <JsonView
      indentWidth={4}
      name={false}
      collapseStringsAfterLength={100}
      groupArraysAfterLength={20}
      iconStyle="square"
      displayDataTypes={false}
      quotesOnKeys={false}

      {...props}
      style={{
        borderRadius: 4,
        // background: isDarkTheme ? "#111" : "#fff",
        padding: 8,
        overflow: "auto",
        ...props.style,
        // color: isDarkTheme ? "#fff" : "#232323",
      }}
      theme={{
        base00: "transparent",
        base01: "#ddd",
        base02: "#ddd",
        base03: "#444",
        base04: "purple",
        base05: "#444",
        base06: "#444",
        base07: isDarkTheme ? "#fff" : "#232323", // "#444",
        base08: "#444",
        base09: "var(--color-primary)",
        base0A: "var(--color-primary)",
        base0B: "var(--color-primary)",
        base0C: "var(--color-primary)",
        base0D: "var(--color-primary)",
        base0E: "var(--color-primary)",
        base0F: "var(--color-primary)",
        ...props.theme,
      }}
    />
  )
}
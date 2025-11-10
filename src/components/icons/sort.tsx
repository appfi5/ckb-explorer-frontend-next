import type { ComponentProps } from "react"
import { useTheme } from "../Theme";


export type SortIconProps = ComponentProps<'svg'> & {
  activeColor?: string
  inactiveColor?: string
  sortDirection?: 'asc' | 'desc' | undefined
};
export default function SortIcon(props: SortIconProps) {
  const {
    activeColor = "var(--color-primary)",
    inactiveColor: propInActiveColor,
    sortDirection,
    ...svgProps
  } = props
  const [theme] = useTheme();
  const inactiveColor = propInActiveColor || (theme === "dark" ? "#fff" : "#232323");
  return (
    <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...svgProps}>
      <path d="M6 12H4V4H2V2H4V0H6V12ZM2 6H0V4H2V6Z" fill={sortDirection === "asc" ? activeColor : inactiveColor} />
      <path d="M8 0H10V8H12V10H10V12H8V0ZM12 6H14V8H12V6Z" fill={sortDirection === "desc" ? activeColor : inactiveColor} />
    </svg>

  )
}
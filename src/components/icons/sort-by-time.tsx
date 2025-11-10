import type { ComponentProps } from "react"
import { useTheme } from "../Theme";


export type SortIconProps = ComponentProps<'svg'> & {
  activeColor?: string
  inactiveColor?: string
  sortDirection?: 'asc' | 'desc' | undefined
};
export default function SortTimeIcon(props: SortIconProps) {
  const {
    activeColor = "var(--color-primary)",
    inactiveColor: propInActiveColor,
    sortDirection,
    ...svgProps
  } = props
  const [theme] = useTheme();
  const inactiveColor = propInActiveColor || (theme === "dark" ? "#fff" : "#232323");
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...svgProps}>
      {
        sortDirection === 'asc' ? (
          <path
            d="M5 12H9V14H5V13H3V11H5V12ZM14 10H13V14H11V8H14V10ZM3 5H2V9H3V11H1V9H0V5H1V3H3V5ZM8 6H10V8H6V3H8V6ZM13 5H11V3H13V5ZM9 1H11V3H9V2H5V3H3V1H5V0H9V1Z"
            fill={sortDirection === "asc" ? activeColor : inactiveColor}
          />
        ) : (
          <path
            d="M5 12H9V14H5V13H3V11H5V12ZM13 11H14V13H13V14H11V8H13V11ZM3 5H2V9H3V11H1V9H0V5H1V3H3V5ZM8 6H10V8H6V3H8V6ZM13 5H11V3H13V5ZM9 1H11V3H9V2H5V3H3V1H5V0H9V1Z"
            fill={sortDirection === "desc" ? activeColor : inactiveColor}
          />
        )
      }
    </svg>
  )
}
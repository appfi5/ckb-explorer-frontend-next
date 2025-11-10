import type { CommonIconProps } from "./utils";
import { useTheme } from "../Theme";

export default function MinerRewardIcon(props: CommonIconProps) {
  const { className, style } = props;
  const [theme] = useTheme();
  const arrowColor = theme === "dark" ? "#999999" : "#484D4E";
  const activeColor = "var(--color-primary)";
  
  return (
    <span className={className} style={style}>
      <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="31" height="19" rx="3.5" fill={activeColor} fill-opacity="0.1" stroke={activeColor} />
        <rect x="4" y="4" width="12" height="12" rx="1" fill={activeColor} />
        <path d="M9.30252 12.7342L6 9.42106L6.75227 8.66346L9.30252 11.2244L13.2506 7.26562L14.0029 8.01789L9.30252 12.7342Z" fill="white" stroke="white" stroke-width="0.5" />
        <path d="M22 13.3896V6.61043C21.9992 6.48989 22.0375 6.37186 22.1099 6.27141C22.1824 6.17095 22.2856 6.09262 22.4066 6.04639C22.5276 6.00017 22.6608 5.98815 22.7893 6.01186C22.9177 6.03557 23.0356 6.09394 23.1279 6.17953L26.8082 9.57213C26.931 9.68584 27 9.83966 27 10C27 10.1603 26.931 10.3142 26.8082 10.4279L23.1279 13.8205C23.0356 13.9061 22.9177 13.9644 22.7893 13.9881C22.6608 14.0119 22.5276 13.9998 22.4066 13.9536C22.2856 13.9074 22.1824 13.829 22.1099 13.7286C22.0375 13.6281 21.9992 13.5101 22 13.3896Z" fill={arrowColor} />
      </svg>
    </span>
  )
}
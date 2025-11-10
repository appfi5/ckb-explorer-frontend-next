import { env } from "@/env";
import type { CommonIconProps } from "./utils";
import { useTheme } from "../Theme";
export const FeeRateIconOne = (props: CommonIconProps) => {
  const isTestnet = env.NEXT_PUBLIC_CHAIN_TYPE === "testnet"
  const currentColor = isTestnet ? "#9672FA" : "#00CC9B";
  const { className } = props;
  return (
    <div className={className}>
      <svg width="75" height="39" viewBox="0 0 75 39" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="7" y="7" width="5" height="5" fill={currentColor} />
        <rect y="29" width="5" height="5" fill={currentColor} />
        <rect x="5" y="34" width="5" height="5" fill={currentColor} />
        <rect x="70" y="10" width="5" height="5" fill={currentColor} />
        <path d="M27 37H17V34H27V37ZM67 37H57V34H67V37ZM17 34H14V31H17V34ZM30 34H27V31H30V34ZM57 34H54V31H57V34ZM70 34H67V31H70V34ZM14 31H11V21H14V31ZM38 6H35V9H53V3H47V0H56V4H60V7H56V10H58V15H67V18H61V23H58V18H57V15H55V12H53V15H50V12H36V15H38V19H40V24H41V21H44V24H42V28H33V31H30V28H19V24H24V25H30V21H33V25H37V20H35V15H33V12H32V9H27V3H38V6ZM54 31H51V21H54V31ZM73 31H70V21H73V31ZM64 28H61V23H64V28ZM27 24H24V21H27V24ZM17 21H14V18H17V21ZM30 21H27V18H30V21ZM47 21H44V18H47V21ZM57 21H54V18H57V21ZM70 21H67V18H70V21ZM27 18H17V15H27V18ZM33 18H30V15H33V18ZM50 18H47V15H50V18Z" fill="#232323" />
      </svg>
    </div>
  )
}
export const FeeRateIconTwo = (props: CommonIconProps) => {
  const isTestnet = env.NEXT_PUBLIC_CHAIN_TYPE === "testnet"
  const currentColor = isTestnet ? "#9672FA" : "#00CC9B";
  const { className } = props;
  return (
    <div className={className}>
      <svg width="88" height="39" viewBox="0 0 88 39" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M33 39H25V36H33V39ZM73 38H65V35H73V38ZM25 36H22V28H25V36ZM36 36H33V28H36V36ZM65 35H62V27H65V35ZM76 35H73V27H76V35ZM56 3H41V12H62V9H65V12H82V15H85V30H81V27H77V24H74V21H64V24H61V27H58V30H40V27H37V24H34V21H24V24H21V27H18V30H14V27H10V24H13V21H10V16H13V14H16V12H19V9H22V12H38V3H30V6H25V3H27V0H56V3ZM33 28H25V25H33V28ZM73 27H65V24H73V27ZM42 19H48V16H42V19ZM25 9H22V6H25V9ZM62 9H59V6H62V9ZM59 6H56V3H59V6Z" fill="#232323" />
        <rect x="80" y="17" width="5" height="5" fill={currentColor} />
        <rect x="83" y="34" width="5" height="5" fill={currentColor} />
        <rect x="11" y="34" width="5" height="5" fill={currentColor} />
        <rect x="5" y="3" width="5" height="5" fill={currentColor} />
        <rect x="5" y="22" width="5" height="5" fill={currentColor} />
        <rect y="24" width="5" height="5" fill={currentColor} />
      </svg>
    </div>

  )
}
export const FeeRateIconThree = (props: CommonIconProps) => {
  const [theme] = useTheme();
  const isTestnet = env.NEXT_PUBLIC_CHAIN_TYPE === "testnet"
  const currentColor = isTestnet ? "#9672FA" : "#00CC9B";
  const currentColorFill = theme === "dark" ? "#fff" : "#232323";
  const { className } = props;
  return (
    <div className={className}>
      <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="64.3467" y="25.4551" width="5" height="5" transform="rotate(45 64.3467 25.4551)" fill={currentColor} />
        <rect x="26.1631" y="14.1426" width="5" height="5" transform="rotate(45 26.1631 14.1426)" fill={currentColor} />
        <rect x="17.6777" y="42.4258" width="3" height="5" transform="rotate(45 17.6777 42.4258)" fill={currentColor} />
        <rect x="16.2637" y="48.084" width="3" height="3" transform="rotate(45 16.2637 48.084)" fill={currentColor} />
        <rect x="20.5063" y="52.3262" width="3" height="3" transform="rotate(45 20.5063 52.3262)" fill={currentColor} />
        <rect x="16.2637" y="52.3262" width="3" height="3" transform="rotate(45 16.2637 52.3262)" fill={currentColor} />
        <rect x="21.9204" y="46.6699" width="3" height="5" transform="rotate(45 21.9204 46.6699)" fill={currentColor} />
        <rect x="26.1631" y="50.9121" width="3" height="5" transform="rotate(45 26.1631 50.9121)" fill={currentColor} />
        <path d="M54.4472 18.3846L56.5685 20.5059L54.4472 22.6273L56.5685 24.7486L54.4472 26.8699L56.5685 28.9912L46.669 38.8907L48.7903 41.012L46.669 43.1334L48.7903 45.2547L46.669 47.376L48.7903 49.4973L41.0121 57.2755L38.8908 55.1542L41.0121 53.0329L38.8908 50.9115L41.0121 48.7902L38.8908 46.6689L36.7695 48.7902L34.6482 46.6689L29.6984 51.6186L19.0918 41.012L24.0416 36.0623L21.9202 33.941L24.0416 31.8197L21.9202 29.6983L19.7989 31.8197L17.6776 29.6983L15.5563 31.8197L13.435 29.6983L21.2131 21.9202L23.3345 24.0415L25.4558 21.9202L27.5771 24.0415L29.6984 21.9202L31.8197 24.0415L41.7192 14.142L43.8406 16.2633L45.9619 14.142L48.0832 16.2633L50.2045 14.142L52.3258 16.2633L54.4472 14.142L56.5685 16.2633L54.4472 18.3846ZM31.8197 36.7694L26.1629 42.4263L28.2842 44.5476L33.9411 38.8907L31.8197 36.7694ZM46.669 21.9202L45.2548 23.3344L43.8406 21.9202L40.305 25.4557L41.7192 26.8699L40.305 28.2841L42.4263 30.4054L43.8406 28.9912L45.2548 30.4054L48.7903 26.8699L47.3761 25.4557L48.7903 24.0415L46.669 21.9202Z" fill={currentColorFill} />
      </svg>
    </div>

  )
}


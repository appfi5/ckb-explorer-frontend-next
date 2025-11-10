import { useTheme } from "../Theme";
import { env } from "@/env";

export const DaoOverviewIconOne = () => {
  const [theme] = useTheme();
  const isTestnet = env.NEXT_PUBLIC_CHAIN_TYPE === "testnet"
  const currentColor = theme === "dark" ? "#232323" : "#fff";
  const linearColorStart = theme === "dark" ? (isTestnet ? "#BAA1FF" : "#18EFB1") : "#232323";
  const linearColorEnd = theme === "dark" ? (isTestnet ? "#9672FA" : "#00CC9B") : "#232323";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 3H24V21H21V24H3V21H0V3H3V0H21V3Z" fill="url(#paint0_linear_2844_64713)" />
      <rect x="5" y="6" width="2" height="2" fill={currentColor} />
      <rect x="17" y="6" width="2" height="2" fill={currentColor} />
      <rect x="19" y="8" width="2" height="2" fill={currentColor} />
      <rect x="19" y="10" width="2" height="2" fill={currentColor} />
      <rect x="3" y="10" width="2" height="2" fill={currentColor} />
      <rect x="5" y="12" width="2" height="2" fill={currentColor} />
      <rect x="7" y="14" width="2" height="2" fill={currentColor} />
      <rect x="9" y="16" width="2" height="2" fill={currentColor} />
      <rect x="11" y="18" width="2" height="2" fill={currentColor} />
      <rect x="13" y="16" width="2" height="2" fill={currentColor} />
      <rect x="15" y="14" width="2" height="2" fill={currentColor} />
      <rect x="17" y="12" width="2" height="2" fill={currentColor} />
      <rect x="7" y="4" width="10" height="2" fill={currentColor} />
      <rect x="7" y="9" width="10" height="2" fill={currentColor} />
      <rect x="3" y="8" width="2" height="2" fill={currentColor} />
      <defs>
        <linearGradient id="paint0_linear_2844_64713" x1="0.495145" y1="3.68149e-06" x2="26.9166" y2="3.81839" gradientUnits="userSpaceOnUse">
          <stop stop-color={linearColorStart} />
          <stop offset="1" stop-color={linearColorEnd} />
        </linearGradient>
      </defs>
    </svg>
  )
}

export const DaoOverviewIconTwo = () => {
  const [theme] = useTheme();
  const isTestnet = env.NEXT_PUBLIC_CHAIN_TYPE === "testnet"
  const currentColor = theme === "dark" ? "#232323" : "#fff";
  const linearColorStart = theme === "dark" ? (isTestnet ? "#BAA1FF" : "#18EFB1") : "#232323";
  const linearColorEnd = theme === "dark" ? (isTestnet ? "#9672FA" : "#00CC9B") : "#232323";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 3H24V21H21V24H3V21H0V3H3V0H21V3Z" fill="url(#paint0_linear_2844_64760)" />
      <rect x="15" y="5" width="2" height="6" transform="rotate(90 15 5)" fill={currentColor} />
      <rect x="9" y="7" width="2" height="2" transform="rotate(90 9 7)" fill={currentColor} />
      <rect x="9" y="15" width="2" height="2" transform="rotate(90 9 15)" fill={currentColor} />
      <rect x="17" y="7" width="2" height="2" transform="rotate(90 17 7)" fill={currentColor} />
      <rect x="13" y="11" width="2" height="2" transform="rotate(90 13 11)" fill={currentColor} />
      <rect x="6" y="4" width="2" height="2" transform="rotate(90 6 4)" fill={currentColor} />
      <rect x="21" y="4" width="2" height="2" transform="rotate(90 21 4)" fill={currentColor} />
      <rect x="6" y="18" width="2" height="2" transform="rotate(90 6 18)" fill={currentColor} />
      <rect x="21" y="18" width="2" height="2" transform="rotate(90 21 18)" fill={currentColor} />
      <rect x="17" y="15" width="2" height="2" transform="rotate(90 17 15)" fill={currentColor} />
      <rect x="15" y="17" width="2" height="6" transform="rotate(90 15 17)" fill={currentColor} />
      <rect x="19" y="15" width="2" height="6" transform="rotate(-180 19 15)" fill={currentColor} />
      <rect x="7" y="15" width="2" height="6" transform="rotate(-180 7 15)" fill={currentColor} />
      <defs>
        <linearGradient id="paint0_linear_2844_64760" x1="0.495145" y1="3.68149e-06" x2="26.9166" y2="3.81839" gradientUnits="userSpaceOnUse">
          <stop stop-color={linearColorStart} />
          <stop offset="1" stop-color={linearColorEnd} />
        </linearGradient>
      </defs>
    </svg>
  )
}

export const DaoOverviewIconThree = () => {
  const [theme] = useTheme();
  const isTestnet = env.NEXT_PUBLIC_CHAIN_TYPE === "testnet"
  const currentColor = theme === "dark" ? "#232323" : "#fff";
  const linearColorStart = theme === "dark" ? (isTestnet ? "#BAA1FF" : "#18EFB1") : "#232323";
  const linearColorEnd = theme === "dark" ? (isTestnet ? "#9672FA" : "#00CC9B") : "#232323";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 3H24V21H21V24H3V21H0V3H3V0H21V3Z" fill="url(#paint0_linear_2844_64803)" />
      <rect x="5" y="13" width="2" height="2" fill={currentColor} />
      <rect x="13" y="13" width="2" height="2" fill={currentColor} />
      <rect x="13" y="10" width="2" height="2" fill={currentColor} />
      <rect x="13" y="7" width="2" height="2" fill={currentColor} />
      <rect x="9" y="9" width="2" height="9" fill={currentColor} />
      <rect x="17" y="5" width="2" height="13" fill={currentColor} />
      <rect x="5" y="16" width="2" height="2" fill={currentColor} />
      <rect x="13" y="16" width="2" height="2" fill={currentColor} />
      <defs>
        <linearGradient id="paint0_linear_2844_64803" x1="0.495145" y1="3.68149e-06" x2="26.9166" y2="3.81839" gradientUnits="userSpaceOnUse">
          <stop stop-color={linearColorStart} />
          <stop offset="1" stop-color={linearColorEnd} />
        </linearGradient>
      </defs>
    </svg>

  )
}

export const DaoOverviewIconFour = () => {
  const [theme] = useTheme();
  const isTestnet = env.NEXT_PUBLIC_CHAIN_TYPE === "testnet"
  const currentColor = theme === "dark" ? "#232323" : "#fff";
  const linearColorStart = theme === "dark" ? (isTestnet ? "#BAA1FF" : "#18EFB1") : "#232323";
  const linearColorEnd = theme === "dark" ? (isTestnet ? "#9672FA" : "#00CC9B") : "#232323";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 3H24V21H21V24H3V21H0V3H3V0H21V3Z" fill="url(#paint0_linear_2844_64736)" />
      <rect x="10" y="3" width="4" height="2" fill={currentColor} />
      <rect x="10" y="11" width="4" height="2" fill={currentColor} />
      <rect x="14" y="5" width="4" height="2" fill={currentColor} />
      <rect x="14" y="13" width="4" height="2" fill={currentColor} />
      <rect x="18" y="7" width="2" height="2" fill={currentColor} />
      <rect x="18" y="15" width="2" height="2" fill={currentColor} />
      <rect x="14" y="9" width="4" height="2" fill={currentColor} />
      <rect x="14" y="17" width="4" height="2" fill={currentColor} />
      <rect x="6" y="5" width="4" height="2" fill={currentColor} />
      <rect x="6" y="13" width="4" height="2" fill={currentColor} />
      <rect x="4" y="7" width="2" height="2" fill={currentColor} />
      <rect x="4" y="15" width="2" height="2" fill={currentColor} />
      <rect x="6" y="9" width="4" height="2" fill={currentColor} />
      <rect x="6" y="17" width="4" height="2" fill={currentColor} />
      <rect x="10" y="11" width="4" height="2" fill={currentColor} />
      <rect x="10" y="19" width="4" height="2" fill={currentColor} />
      <defs>
        <linearGradient id="paint0_linear_2844_64736" x1="0.495145" y1="3.68149e-06" x2="26.9166" y2="3.81839" gradientUnits="userSpaceOnUse">
          <stop stop-color={linearColorStart} />
          <stop offset="1" stop-color={linearColorEnd} />
        </linearGradient>
      </defs>
    </svg>

  )
}

export const DaoOverviewIconFive = () => {
  const [theme] = useTheme();
  const isTestnet = env.NEXT_PUBLIC_CHAIN_TYPE === "testnet"
  const currentColor = theme === "dark" ? "#232323" : "#fff";
  const linearColorStart = theme === "dark" ? (isTestnet ? "#BAA1FF" : "#18EFB1") : "#232323";
  const linearColorEnd = theme === "dark" ? (isTestnet ? "#9672FA" : "#00CC9B") : "#232323";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 3H24V21H21V24H3V21H0V3H3V0H21V3Z" fill="url(#paint0_linear_2844_64781)" />
      <rect x="9" y="3" width="6" height="2" fill={currentColor} />
      <rect x="7" y="5" width="2" height="2" fill={currentColor} />
      <rect x="15" y="5" width="2" height="2" fill={currentColor} />
      <rect x="17" y="7" width="2" height="2" fill={currentColor} />
      <rect x="17" y="15" width="2" height="2" fill={currentColor} />
      <rect x="15" y="17" width="2" height="2" fill={currentColor} />
      <rect x="11" y="7" width="2" height="6" fill={currentColor} />
      <rect x="16" y="11" width="2" height="5" transform="rotate(90 16 11)" fill={currentColor} />
      <rect x="5" y="7" width="2" height="2" fill={currentColor} />
      <rect x="5" y="15" width="2" height="2" fill={currentColor} />
      <rect x="7" y="17" width="2" height="2" fill={currentColor} />
      <rect x="9" y="19" width="6" height="2" fill={currentColor} />
      <rect x="21" y="9" width="6" height="2" transform="rotate(90 21 9)" fill={currentColor} />
      <rect x="5" y="9" width="6" height="2" transform="rotate(90 5 9)" fill={currentColor} />
      <defs>
        <linearGradient id="paint0_linear_2844_64781" x1="0.495145" y1="3.68149e-06" x2="26.9166" y2="3.81839" gradientUnits="userSpaceOnUse">
          <stop stop-color={linearColorStart} />
          <stop offset="1" stop-color={linearColorEnd} />
        </linearGradient>
      </defs>
    </svg>

  )
}

export const DaoOverviewIconSix = () => {
  const [theme] = useTheme();
  const isTestnet = env.NEXT_PUBLIC_CHAIN_TYPE === "testnet"
  const currentColor = theme === "dark" ? "#232323" : "#fff";
  const linearColorStart = theme === "dark" ? (isTestnet ? "#BAA1FF" : "#18EFB1") : "#232323";
  const linearColorEnd = theme === "dark" ? (isTestnet ? "#9672FA" : "#00CC9B") : "#232323";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 3H24V21H21V24H3V21H0V3H3V0H21V3Z" fill="url(#paint0_linear_2844_64820)" />
      <rect x="17" y="4" width="2" height="10" transform="rotate(90 17 4)" fill={currentColor} />
      <rect x="7" y="18" width="2" height="12" transform="rotate(-180 7 18)" fill={currentColor} />
      <rect x="19" y="18" width="2" height="12" transform="rotate(-180 19 18)" fill={currentColor} />
      <rect x="13" y="13" width="2" height="5" transform="rotate(-180 13 13)" fill={currentColor} />
      <rect x="13" y="16" width="2" height="2" transform="rotate(-180 13 16)" fill={currentColor} />
      <rect x="17" y="18" width="2" height="10" transform="rotate(90 17 18)" fill={currentColor} />
      <defs>
        <linearGradient id="paint0_linear_2844_64820" x1="0.495145" y1="3.68149e-06" x2="26.9166" y2="3.81839" gradientUnits="userSpaceOnUse">
          <stop stop-color={linearColorStart} />
          <stop offset="1" stop-color={linearColorEnd} />
        </linearGradient>
      </defs>
    </svg>

  )
}









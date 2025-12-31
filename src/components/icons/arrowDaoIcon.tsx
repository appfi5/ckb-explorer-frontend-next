import { useTheme } from "@/components/Theme";

interface ArrowDaoIconProps {
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
}

export default function ArrowDaoIcon(props: ArrowDaoIconProps) {
  const { className, ...restProps } = props;
  const [theme] = useTheme();
  const isDarkTheme = theme === "dark";
  const strokeColor = isDarkTheme ? "#4C4C4C" : "#DDDDDD";
  const pathFillColor = isDarkTheme ? "#ffffff" : "#232323";
  const reactFillColor = isDarkTheme ? "#FFFFFF1A" : "#ffffff";

  return (
    <span className={className} {...restProps}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="19.5" y="0.5" width="19" height="19" rx="3.5" transform="rotate(90 19.5 0.5)" fill={reactFillColor} stroke={strokeColor} />
      <path d="M5 9L5 7L7 7L7 9L5 9ZM7 11L7 9L9 9L9 11L7 11ZM9 13L9 11L11 11L11 13L9 13ZM11 11L11 9L13 9L13 11L11 11ZM13 9L13 7L15 7L15 9L13 9Z" fill={pathFillColor} />
    </svg>
    </span>

  )
}
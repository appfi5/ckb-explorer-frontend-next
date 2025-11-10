import type { CommonIconProps } from "./utils";

export default function InfoIcon(props: CommonIconProps) {
  const { className, style, color = '#232323', strokeColor = '#DDDDDD', size = 10 } = props;
  return (
    <span className={className} style={style}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" fill="white" stroke={strokeColor} />
        <path d="M11 15H5V13H11V15ZM15 11H5V9H15V11ZM15 7H5V5H15V7Z" fill={color} />
      </svg>

    </span>

  )
}
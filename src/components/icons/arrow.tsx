import type { CommonIconProps } from "./utils";



export default function ArrowIcon(props: CommonIconProps) {
  const { className, style, color = 'currentColor', size = 10 } = props;
  return (
    <span className={className} style={style}>
      <svg width={size} height={size} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 6.24219L5 1.33681L9 6.24219" stroke={color} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>

  )
}
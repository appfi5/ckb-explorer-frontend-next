import type { CommonIconProps } from "./utils";



export default function MenuIcon(props: CommonIconProps) {
  const { className, style, color = 'currentColor', size } = props;
  return (
    <span className={className} style={style}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path d="M4.46704 15.9062H28.3337" stroke={color} strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11.0535 25.3359H28.3335" stroke={color} strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11.0542 6.47461L28.334 6.4762" stroke={color} strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}
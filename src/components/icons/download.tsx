import type { DetailedHTMLProps, HTMLAttributes } from "react";
import type { CommonIconProps } from "./utils";



export default function DownloadIcon(props: CommonIconProps & DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>) {
  const { className, style, color = 'currentColor', size, ...restProps } = props;
  return (
    <span className={className} style={style} {...restProps}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.6006 15.2002H2.40137V13.5996H13.6006V15.2002ZM2.40137 13.5996H0.800781V9.59961H2.40137V13.5996ZM15.2012 13.5996H13.6006V9.59961H15.2012V13.5996ZM8.80078 8H10.4014V9.59961H8.80078V10.4004H7.20117V9.59961H5.60059V8H7.20117V0.799805H8.80078V8ZM5.60059 8H4.00098V6.40039H5.60059V8ZM12.001 8H10.4014V6.40039H12.001V8Z" fill={color} />
      </svg>
    </span>
  )
}
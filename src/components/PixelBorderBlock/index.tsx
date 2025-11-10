import classNames from "classnames";
import styles from "./index.module.scss";
import type { DetailedHTMLProps, HTMLAttributes } from "react";

type PixelBorderBlockProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  contentClassName?: string;
  apperanceClassName?: string;
  compact?: "left" | "right";
  pixelSize?: string;
}
export default function PixelBorderBlock(props: PixelBorderBlockProps) {
  const {
    apperanceClassName = "*:data-[slot=border]:bg-[#4d4d4d]",
    className,
    children,
    contentClassName,
    compact,
    pixelSize = '3px',
    ...rest } = props;
  return (
    <div
      {...rest}
      className={classNames(styles.pixelBlock, {
        [styles.rightCompact!]: compact === 'right',
        [styles.leftCompact!]: compact === 'left',
        // [styles.hover!]: hoverEffect,
      }, className, apperanceClassName)}
      style={{
        "--pixel-size": pixelSize,
        ...rest.style,
      }}
    >
      <div data-slot="bg" className={styles.bg} />
      <i data-slot="border" className={classNames(styles.border, styles.top)} />
      <i data-slot="border" className={classNames(styles.border, styles.bottom)} />
      <i data-slot="border" className={classNames(styles.border, styles.left)} />
      <i data-slot="border" className={classNames(styles.border, styles.right)} />
      <i data-slot="border" className={classNames(styles.pixel, styles.tl)} />
      <i data-slot="border" className={classNames(styles.pixel, styles.tr)} />
      <i data-slot="border" className={classNames(styles.pixel, styles.bl)} />
      <i data-slot="border" className={classNames(styles.pixel, styles.br)} />
      <div className={classNames(styles.content, contentClassName)}>
        {children}
      </div>
    </div>
  )
}
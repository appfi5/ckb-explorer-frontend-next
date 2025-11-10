import type { ComponentProps } from "react";
import styles from './index.module.scss';
import classNames from "classnames";

export type CardProps = ComponentProps<"div">;
export default function Card(props: CardProps) {
  return (
    <div {...props} className={classNames(styles.card, props.className)}
    />
  )
}
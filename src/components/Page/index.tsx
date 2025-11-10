import { type CSSProperties, type ReactNode } from "react";
import styles from "./index.module.scss";

export default ({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) => (
  <div className={styles.pagePanel,'dark:bg-[#111111]'} style={style}>
    {children}
  </div>
);

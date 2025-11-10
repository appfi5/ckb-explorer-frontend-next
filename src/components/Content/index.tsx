import type { CSSProperties, ReactNode } from "react";
import styles from "./index.module.scss";
import classNames from "classnames";

export default ({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) => {
  return (
    <div style={style} className={classNames(styles.contentPanel)}>
      {children}
    </div>
  );
};

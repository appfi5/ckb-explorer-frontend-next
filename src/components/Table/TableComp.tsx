import type { FC, HTMLAttributes, ReactNode } from "react";
import styles from "./styled.module.scss";

type TextDirection = 'left' | 'right' | 'center';

const TEXT_ALIGN_CLASSES: Record<TextDirection, string> = {
  left: 'justify-start',
  right: 'justify-end',
  center: 'justify-center',
};

export const TableTitleRow: FC<
  {
    children: ReactNode;
  } & HTMLAttributes<HTMLDivElement>
> = ({ children, ...props }) => {

  return (
    <div {...props} className={styles.tableTitleRow}>
      {children}
    </div>
  );
};

export const TableTitleRowItem: FC<
  {
    children: ReactNode;
    width?: string | number;
    textDirection?: 'left' | 'right' | 'center';
  } & HTMLAttributes<HTMLDivElement>
> = ({ children, width, textDirection, ...props }) => {

  const textAlignClass = TEXT_ALIGN_CLASSES[textDirection ?? 'center'];

  return (
    <div className={`w-full flex items-center h-full ${textAlignClass} font-medium`} {...props} style={{ width }}>
      {children}
    </div>
  );
};

export const TableContentRow: FC<
  {
    children: ReactNode;
    className?: string;
  } & HTMLAttributes<HTMLDivElement>
> = ({ children, className, ...props }) => {
  return (
    <div className={`${styles.tableContentRow} bg-white dark:bg-transparent border-b-1 border-[#EEEEEE] dark:border-[#4C4C4C] ${className}`} {...props}>
      {children}
    </div>
  );
};

export const TableContentRowItem: FC<
  {
    children: ReactNode;
    width?: string;
    textDirection?: 'left' | 'right' | 'center'
  } & HTMLAttributes<HTMLDivElement>
> = ({
  children,
  width,
  textDirection = 'center',
  ...props
}) => {
    const textAlignClass = {
      left: 'text-left',
      right: 'text-right',
      center: 'text-center',
    }[textDirection] || 'text-center';

    return (
      <div
        className={`flex items-center text-base text-ellipsis text-[#232323] dark:text-[#fff] overflow-hidden whitespace-nowrap`}
        style={{ width, ...props.style }}
        {...props}
      >
        <div className={`w-full ${textAlignClass}`}>{children}</div>
      </div>
    );
  };

export const TableMinerContentPanel: FC<
  {
    children: ReactNode;
    width?: string;
  } & HTMLAttributes<HTMLDivElement>
> = ({ children, width, ...props }) => {
  return (
    <div className={styles.tableMinerContentPanel} {...props} style={{ width }}>
      {children}
    </div>
  );
};

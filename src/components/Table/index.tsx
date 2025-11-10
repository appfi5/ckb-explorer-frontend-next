import { memo, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  TableTitleRowItem,
  TableContentRowItem,
  TableMinerContentPanel,
} from "./TableComp";
import AddressText from "../AddressText";
import { useIsMobile } from "@/hooks";
import styles from "./styled.module.scss";
import Link from "next/link";

export const TableTitleItem = ({
  width,
  title,
}: {
  width: string;
  title: string;
}) => (
  <TableTitleRowItem width={width}>
    <div>{title}</div>
  </TableTitleRowItem>
);

interface TableContentItemProps {
  width: string;
  content: string | React.ReactNode;
  to?: string;
  textDirection?: 'left' | 'right' | 'center';
  bold?: boolean;
  isTextActive?: boolean;
}
export const TableContentItem = ({
  width,
  content,
  to,
  textDirection = 'center',
  bold,
  isTextActive = false
}: TableContentItemProps) => {
  const highLight = to !== undefined;
  const textAlignClass = {
    left: 'text-left',
    right: 'text-right',
    center: 'text-center',
  }[textDirection] || 'text-center';
  const boldClass = bold ? 'font-bold' : 'font-normal';

  return (
    <TableContentRowItem width={width} textDirection={textDirection}>
      {highLight ? (
        <Link href={to} className={`${!!isTextActive && styles.highlightLink} ${textAlignClass} ${boldClass} font-menlo`}>
          {content}
        </Link>
      ) : (
        <div className={`w-full ${textAlignClass} ${boldClass} font-menlo`}>{content}</div>
      )}
    </TableContentRowItem>
  );
};

export const TableMinerContentItem = memo(
  ({
    width = "auto",
    content,
    textCenter,
    fontSize = "16px",
    textWidth,
    isTextActive = false,
    linkType
  }: {
    width?: string;
    content: string;
    textCenter?: boolean;
    fontSize?: string;
    textWidth?: string;
    isTextActive?: boolean;
    linkType?: 'transaction' | 'address'
  }) => {
    const isMobile = useIsMobile();
    const { t } = useTranslation();
    const isTextActiveTextColor = isTextActive ? "text-primary" : "text-[#232323] dark:text-white";
    const isUnderline = linkType === 'address' && 'underline';
    return (
      <TableMinerContentPanel width={width}>
        {content ? (
          <div
            style={{
              display: "flex",
              justifyContent: textCenter ? "center" : "start",
              overflow: "hidden",
              maxWidth: textWidth,
            }}
          >
            <div style={{ flexBasis: `0 0 80%`, overflow: "hidden" }}>
              <AddressText
                className={`${styles.tableMinerText} ${isTextActiveTextColor} ${isUnderline} hover:underline`}
                linkProps={{
                  className: "tableMinerContent",
                  href: linkType === 'transaction' ? `/transaction/${content}` : `/address/${content}`,
                }}
                style={{
                  fontSize: isMobile ? "13px" : fontSize,
                }}
              >
                {content}
              </AddressText>
            </div>
          </div>
        ) : (
          <div
            className="tableMinerTextDisable font-menlo"
            style={{ fontSize: isMobile ? "13px" : fontSize }}
          >
            {t("address.unable_decode_address")}
          </div>
        )}
      </TableMinerContentPanel>
    );
  },
);

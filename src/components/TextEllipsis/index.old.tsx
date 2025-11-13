import { isNil } from "lodash";
import Tooltip from "../Tooltip";
import CopyTooltipText from "../Text/CopyTooltipText";
import type { ComponentProps, DetailedHTMLProps, HTMLAttributes } from "react";
import classNames from "classnames";



export type TextEllipsisProps = ComponentProps<"span"> & {
  text?: string;
  ellipsis?: 'none' | 'address' | 'transaction' | 'auto' | { head?: number, tail?: number };
}

const mapEllipsisToConfig = {
  address: { head: 8, tail: -7 },
  transaction: { head: 8, tail: -4 },
}

const processDisplayText = (hash: string | undefined, ellipsis: TextEllipsisProps['ellipsis']) => {
  if (ellipsis === 'none' || !hash) return hash;
  const { head, tail } = mapEllipsisToConfig[ellipsis as 'address'] || ellipsis;
  const ellipsisLen = (head || 0) + (isNil(tail) ? 0 : (tail < 0 ? -tail : hash.slice(tail).length)); // ((tail || 0) < 0 ? -(tail || 0) : hash.slice(tail).length);

  if (hash.length <= ellipsisLen) return hash;

  return (
    <>
      {hash.slice(0, head)}<span>...</span>{!!tail ? hash.slice(tail) : ''}
    </>
  )
}
export default function TextEllipsis(props: TextEllipsisProps) {
  const { text, ellipsis, ...spanProps } = props;

  const displayText = processDisplayText(text, ellipsis);

  const dom = (
    <span {...spanProps} className={classNames("font-hash", spanProps.className)}>{displayText}</span>
  )

  if (!text) {
    return null;
  }

  if (displayText === text) {
    return dom;
  }
  return (
    <Tooltip
      trigger={dom}
    >
      <CopyTooltipText content={text} />
    </Tooltip>
  )
}
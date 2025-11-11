import { isNil } from "lodash";
import Tooltip from "../Tooltip";
import CopyTooltipText from "../Text/CopyTooltipText";
import type { ComponentProps, DetailedHTMLProps, HTMLAttributes } from "react";
import classNames from "classnames";



export type TextEllipsisProps = ComponentProps<"div"> & {
  text?: string;
  ellipsis: 'address' | 'transaction' | { head?: number, tail: number };
  showTooltip?: boolean;
}

const mapEllipsisToConfig: Record<string, { head?: number, tail: number }> = {
  address: { head: 8, tail: -8 },
  transaction: { head: 8, tail: -9 },
}

const processDisplayText = (hash: string | undefined, ellipsis: TextEllipsisProps['ellipsis'], divProps: ComponentProps<"div">) => {
  const ellipsisCfg = typeof ellipsis === "string" ? mapEllipsisToConfig[ellipsis as "address"] : ellipsis;
  if (!hash) return null;
  if (!ellipsisCfg) {
    console.error("ellipsis config required");
    return null;
  }
  
  const { head, tail } = ellipsisCfg;

  if (isNil(head)) {

    return (
      <div {...divProps} className={classNames("flex flex-row items-center", divProps.className)}>
        <span className="font-hash flex-1 min-w-0 flex-nowrap truncate break-all">{hash.slice(0, tail)}</span>
        <span className="font-hash flex-none" >{hash.slice(tail)}</span>
      </div>
    )
  }

  const ellipsisLen = (head || 0) + (isNil(tail) ? 0 : (tail < 0 ? -tail : hash.slice(tail).length)); // ((tail || 0) < 0 ? -(tail || 0) : hash.slice(tail).length);

  return (
    <div {...divProps} className={classNames("font-hash", divProps.className)}>
      {
        hash.length <= ellipsisLen ? hash : (
          <>
            {hash.slice(0, head)}<span>...</span>{!!tail ? hash.slice(tail) : ''}
          </>
        )
      }

    </div>
  )
}
export default function TextEllipsis(props: TextEllipsisProps) {
  const { text, ellipsis, showTooltip = true, ...divProps } = props;

  const dom = processDisplayText(text, ellipsis, divProps);

  if (!text) {
    return null;
  }

  if (!showTooltip) return dom;

  return (
    <Tooltip
      trigger={dom}
      asChild={true}
    >
      <CopyTooltipText content={text} />
    </Tooltip>
  )
}
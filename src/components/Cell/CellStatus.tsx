import type { Cell } from "@/models/Cell";
import classNames from "classnames";
import { useTranslation } from "react-i18next";


export enum CellStatus {
  LIVE = 0,
  COMSUMED = 1,
}


export function useCellStatusConfig(status: CellStatus) {
  const { t } = useTranslation("cell");

  switch (status) {
    case CellStatus.LIVE:
      return {
        color: "#FFB041",
        text: t("state.live"),
      };
    case CellStatus.COMSUMED:
      return {
        color: "#00CC9B",
        text: t("state.dead"),
      }
    default:
      return {
        color: "#ccc",
        text: `Unknown ${status}`,
      };
  }
}

export function CellStatusBadge({ status }: { status: number }) {
  const { color, text } = useCellStatusConfig(status);
  return <div className="inline-flex items-center gap-[4px]">
    <div className={classNames("size-[6px] rounded-full")} style={{ backgroundColor: color }}></div>
    <div>{text}</div>
  </div>
}
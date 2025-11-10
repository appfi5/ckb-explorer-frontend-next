import classNames from "classnames";
import styles from './TxCellCard.module.scss';
import OutlinkIcon from "@/assets/icons/outlink.svg?component"
import NervosBlackImg from "@/assets/icons/nervos.black.svg";
import Image from "next/image";
import TextEllipsis from "@/components/TextEllipsis";
import Link from "next/link";
import type { ReactNode } from "react";
import TwoSizeAmount from "@/components/TwoSizeAmount";
import { shannonToCkb } from "@/utils/util";
import { useTranslation } from "react-i18next";
import { CellStatusBadge } from "@/components/Cell/CellStatus";
import CellModal from "@/components/Cell/CellModal";
import { isNil } from "lodash";
import OutLink from "@/components/OutLink";

export default function TxCellCard({ cell, showStatus = true, seq }: { cell: APIExplorer.CellInputResponse | APIExplorer.CellOutputResponse, showStatus?: boolean, seq?: number }) {
  const { t } = useTranslation();
  return (
    <CellModal cell={cell}>
      <div className={styles.txCellCard}>
        <div className="flex items-center justify-between mb-[12px]">
          <div className="flex gap-[8px] items-center">
            <div className="size-[24px] rounded-full">
              <Image src={NervosBlackImg} alt="" />
            </div>
            <OutLink
              className={styles.address}
              href={`/address/${cell.addressHash}`}
              onClick={(e) => { e.stopPropagation() }}
            >
              <TextEllipsis text={cell.addressHash} ellipsis="address" />
            </OutLink>
          </div>
          <span className="text-[#909399]">{!isNil(seq) ? `#${seq}` : ""}</span>
        </div>

        <div className="flex flex-col gap-[8px] bg-[#fbfbfb] dark:bg-[#232323e6] rounded-[8px] p-[12px]">
          <Info label={t("cell.declared")}>
            <TwoSizeAmount
              amount={shannonToCkb(cell.capacity)}
              integerClassName="text-[14px]"
              decimalClassName="text-[12px]"
              unit={<span className="ml-[4px] text-[14px]">CKBytes</span>}
            />
          </Info>
          <Info label={t("cell.occupied")}>
            <TwoSizeAmount
              amount={shannonToCkb(cell.occupiedCapacity)}
              integerClassName="text-[14px]"
              decimalClassName="text-[12px]"
              unit={<span className="ml-[4px] text-[14px]">CKBytes</span>}
            />
          </Info>
          <Info when={showStatus} label={t("cell.state")}>
            <CellStatusBadge status={(cell as APIExplorer.CellOutputResponse).status} />
          </Info>
        </div>
      </div>
    </CellModal>
  )
}


function Info({ label, children, when = true }: { label: ReactNode, children?: ReactNode, when?: boolean }) {
  if (!when) return null;
  return (
    <div className="flex flex-row items-center justify-between leading-[22px]">
      <div className="text-[#909399]">{label}</div>
      <div className="">{children}</div>
    </div>
  )
}
import classNames from "classnames";
import styles from './TxCellCard.module.scss';
import SinceLockIcon from "@/assets/icons/lock.svg?component"
import ArrowRightIcon from "@/assets/icons/arrow-right.svg?component"
import NervosBlackImg from "@/assets/icons/nervos.black.svg";
import Image from "next/image";
import type { ReactNode } from "react";
import { parseSince, shannonToCkb } from "@/utils/util";
import { useTranslation } from "react-i18next";
import { CellStatusBadge } from "@/components/Cell/CellStatus";
import CellModal from "@/components/Cell/CellModal";
import { isNil } from "lodash";
import OutLink from "@/components/OutLink";
import Tips from "@/components/Tips";
import { Button } from "@/components/shadcn/button";
import { parseSimpleDate } from "@/utils/date";
import BigNumber from "bignumber.js";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ScriptTag from "@/components/ScriptTag";
import { useQuery } from "@tanstack/react-query";
import { ccc, ClientPublicMainnet, ClientPublicTestnet } from "@ckb-ccc/core";
import { env } from "@/env";
import TxCellRichDisplay from "./TxCellRichDisplay";
import CKBAddress from "@/components/CKBAddress";

function ScriptTagFromAddress({ address }: { address: string }) {
  const { data: script } = useQuery({
    queryKey: ['scriptFromAddress', address],
    queryFn: async () => {
      const network = env.NEXT_PUBLIC_CHAIN_TYPE;
      const addressObj = await ccc.Address.fromString(address, network === "testnet" ? new ClientPublicTestnet() : new ClientPublicMainnet());
      const script = addressObj.script;
      return script;
    }
  })
  return script ? <div data-clickable onClick={(e) => { e.stopPropagation() }}><ScriptTag category="lock" script={script} /></div> : null;
}

type TxCellCardProps = {
  cell: APIExplorer.CellInputResponse | APIExplorer.CellOutputResponse,
  isInput?: boolean,
  seq?: number
  since?: string
  isPendingData: boolean
}
export default function TxCellCard({ since, cell, isInput = true, seq, isPendingData }: TxCellCardProps) {
  const { t } = useTranslation();
  const isShowModal = !isPendingData

  const cellCardContent = (
    <div className={styles.txCellCard}>
      <div className="flex items-start justify-between mb-3.5 md:mb-5">
        <div className="flex gap-x-2 gap-y-3.5 flex-wrap items-center">
          <div className="size-6 rounded-full">
            <Image src={NervosBlackImg} alt="" />
          </div>
          <Link
            className={cn(styles.address, "underline hover:text-primary")}
            href={`/address/${cell.addressHash}`}
            data-clickable
            onClick={(e) => { e.stopPropagation() }}
          >
            <CKBAddress
              address={cell.addressHash}
              ellipsis="address"
            />
          </Link>
          <ScriptTagFromAddress address={cell.addressHash} />
        </div>
        {
          since
            ? <SinceDesc since={since} />
            : <span className="text-[#909399]">{!isNil(seq) ? `#${seq}` : ""}</span>
        }

      </div>

      <div className="bg-[#fbfbfb] dark:bg-[#232323e6] rounded-sm border border-[#d9d9d9] dark:border-[#4c4c4c] px-5 py-3 md:py-4">
        <TxCellRichDisplay cell={cell} isInput={isInput} />
      </div>

      {/* <div className="flex flex-col gap-2 bg-[#fbfbfb] dark:bg-[#232323e6] rounded-[8px] p-[12px]">
          <Info label={t("cell.declared")}>
            <TwoSizeAmount
              amount={shannonToCkb(cell.capacity)}
              integerClassName="text-[14px]"
              decimalClassName="text-[12px]"
              unit={<span className="ml-1 text-[14px]">CKBytes</span>}
            />
          </Info>
          <Info label={t("cell.occupied")}>
            <TwoSizeAmount
              amount={shannonToCkb(cell.occupiedCapacity)}
              integerClassName="text-[14px]"
              decimalClassName="text-[12px]"
              unit={<span className="ml-1 text-[14px]">CKBytes</span>}
            />
          </Info>
          <Info when={showStatus} label={t("cell.state")}>
            <CellStatusBadge status={(cell as APIExplorer.CellOutputResponse).status} />
          </Info>
        </div> */}
    </div>
  )

  return isShowModal ? (
    <CellModal cell={cell}>
      {cellCardContent}
    </CellModal>
  ) : (
    cellCardContent
  );
}


function withSinceDisplay(sinceRaw: string) {
  const since = parseSince(sinceRaw);
  if (!since) return null;
  if (since.metric === "blockNumber") {
    since.value = new BigNumber(since.value).plus(1).toString();
  } else if (since.metric === "timestamp") {
    since.value = since.relative === 'relative'
      ? `${+since.value / 3600} Hrs`
      : parseSimpleDate(+since.value * 1000)
  }
  return since;
}

function SinceDesc({ since: sinceRaw }: { since: string }) {
  const since = withSinceDisplay(sinceRaw)

  const { t } = useTranslation();
  if (!since) return null;
  return (
    <div
      onClick={e => e.stopPropagation()}
      data-clickable
    >
      <Tips
        contentClassName={classNames(styles.sinceTooltip, "max-w-[240px]! p-4 rounded-lg ")}
        trigger={
          <div
            className="flex size-5 items-center justify-center bg-[#ffb041] rounded-sm text-white"
          >
            <SinceLockIcon />
          </div>
        }
      >
        <div className="text-black" onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-row items-center text-sm gap-2 mb-2.5">
            <SinceLockIcon />
            <span>Restricted by Since</span>
          </div>
          <div className="text-[#999] text-xs leading-5 break-normal">
            {t("transaction.tags.since_locked.description", {
              time: t(`transaction.since.${since.relative}.${since.metric}`, { since: since.value }),
            })}
          </div>
          <Button
            variant="outline"
            className="rounded-sm py-1.5 px-2 text-xs w-16 h-auto border-[#ccc] hover:bg-primary hover:text-white hover:border-primary mt-2.5"
            onClick={() => {
              window.open("https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0017-tx-valid-since/0017-tx-valid-since.md", "_blank", "noreferrer")
            }}
          >
            {t("scripts.detail")}
            <ArrowRightIcon style={{ width: 4, height: 8 }} />
          </Button>
        </div>
      </Tips>
    </div>
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
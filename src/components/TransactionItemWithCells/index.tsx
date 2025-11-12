import type { Transaction } from "@/models/Transaction"
import CardPanel from "../Card/CardPanel"
import OutLink from "../OutLink";
import TextEllipsis from "../TextEllipsis";
import { localeNumberString } from "@/utils/number";
import { useTranslation } from "react-i18next";

import HeadIcon from '@/assets/icons/headIcon.svg?component'
import TimeIcon from '@/assets/icons/time.svg?component'
import BlockIcon from '@/assets/icons/block.svg?component'
import RightArrowIcon from '@/assets/icons/rightArrow.svg?component';
import Link from "next/link";
import { IOType } from "@/constants/common";
import ListCellItem from "./ListCellItem";
import styles from "./index.module.scss";
import classNames from "classnames";
import { useEffect, useRef } from "react";
import DateTime from "../DateTime";

type TransactionItemWithCellsProps = {
  transaction: Transaction;
  showBlockInfo?: boolean;
  scrollIntoViewOnMount?: boolean;
  currentAddress?: string;
  // transaction: Transaction & { btcTx: RawBtcRPC.BtcTx | null };
  // address?: string;
  // isBlock?: boolean;
  // titleCard?: ReactNode | null;
  // circleCorner?: CircleCorner;
  // scrollIntoViewOnMount?: boolean;
}


export default function TransactionItemWithCells(props: TransactionItemWithCellsProps) {
  const { transaction: txInfo, showBlockInfo = false, scrollIntoViewOnMount, currentAddress } = props;
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el && scrollIntoViewOnMount) {
      const style = getComputedStyle(ref.current);
      const navbarHeight = parseInt(
        style.getPropertyValue("--navbar-height"),
        10,
      );
      // const marginTop = parseInt(style.getPropertyValue("margin-top"), 10);
      const y =
        el.getBoundingClientRect().top +
        window.pageYOffset -
        navbarHeight
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <CardPanel ref={ref} className="p-3 md:p-5 mt-5">
      <div className="flex flex-row flex-wrap gap-y-1.5 items-center justify-between mb-2.5">
        <div className="flex max-w-full flex-row gap-2">
          {/* left */}
          <HeadIcon className="flex-none" />
          <OutLink href={`/transaction/${txInfo.transactionHash}`} className="min-w-0 flex flex-row items-center font-hash underline">
            <TextEllipsis
              className="flex-1 min-w-0"
              text={txInfo.transactionHash}
              ellipsis={{ tail: -8 }}
            />
          </OutLink>
        </div>
        {
          showBlockInfo && (
            <div className="pl-8">
              <BlockTime tx={txInfo} />
            </div>
          )
        }
      </div>
      <div className="bg-white p-2 md:p-5 md:rounded-[16px] dark:bg-[#232323E5] flex flex-col 2xl:flex-row gap-1 sm:gap-3">
        <CellList currentAddress={currentAddress} transaction={txInfo} ioType={IOType.Input} cells={txInfo.displayInputs} />
        <RightArrowIcon className={classNames("flex-none rotate-90 2xl:rotate-0 self-center 2xl:self-start 2xl:mt-4", styles.arrowIcon)} />
        <CellList currentAddress={currentAddress} transaction={txInfo} ioType={IOType.Output} cells={txInfo.displayOutputs} />
      </div>
    </CardPanel>
  )
}


function BlockTime({ tx }: { tx: Transaction }) {
  const { t } = useTranslation();
  let timestamp = 0;
  if (tx) {
    if (tx.blockTimestamp) {
      timestamp = +tx.blockTimestamp;
    } else if (tx.createTimestamp) {
      // FIXME: round the timestamp because sometimes a decimal is returned from the API, could be removed when the API is fixed
      timestamp = Math.floor(Number(tx.createTimestamp));
    }
  }

  const dateTime = new Date(timestamp).toISOString();

  if (!tx) {
    return null;
  }

  if (tx.blockTimestamp) {
    return (
      <time dateTime={dateTime} className={classNames('transactionItemBlock', styles.transactionBlockTime)}>
        <div className="flex items-center gap-[4px]">
          <BlockIcon className="flex-none text-[#999]" />
          <span className="mr-[32px] font-hash text-[#999]">{`${t("block.block")} ${localeNumberString(tx.blockNumber)}`}</span>
        </div>
        <div className="flex items-center gap-[4px]">
          <TimeIcon className="flex-none text-[#999] " />
          <span className="text-[#999]">
            <DateTime date={timestamp} showRelative />
          </span>
        </div>
      </time>
    );
  }

  if (tx.createTimestamp) {
    return (
      <time dateTime={dateTime} className="transactionItemBlock flex items-center gap-[4px]">
        <TimeIcon className="text-[#484D4E] dark:text-[#d9d9d9]" />
        <span className="text-[#909399]">
          <DateTime date={timestamp} showRelative />
        </span>
      </time>
    );
  }
  return null;
};


type CellListProps = {
  transaction: Transaction;
  currentAddress?: string;
} & (
    { ioType: IOType.Input, cells: Array<APIExplorer.CellInputResponse> } |
    { ioType: IOType.Output, cells: Array<APIExplorer.CellOutputResponse> }
  )
const MAX_CELL_SHOW_SIZE = 10;
function CellList(props: CellListProps) {
  const { cells, ioType, currentAddress, transaction } = props;
  const { t } = useTranslation();
  return (
    <div className="flex-1 min-w-0 flex flex-col gap-2">
      {cells.slice(0, MAX_CELL_SHOW_SIZE).map((cell) => (
        <ListCellItem key={cell.id} ioType={ioType} cell={cell} currentAddress={currentAddress} />
      ))}
      {cells.length >= MAX_CELL_SHOW_SIZE && (
        <div className="mt-2 flex flex-row gap-1 justify-center items-center">
          <Link className="text-[12px] text-[#999] hover:text-primary" href={`/transaction/${transaction.transactionHash}`}>
            {t("common.view_all")}
          </Link>
        </div>
      )}
    </div>
  )
}
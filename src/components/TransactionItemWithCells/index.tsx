import type { Transaction } from "@/models/Transaction";
import type { Cell } from "@/models/Cell";
import CardPanel from "../Card/CardPanel";
import OutLink from "../OutLink";
import TextEllipsis from "../TextEllipsis";
import { localeNumberString } from "@/utils/number";
import { useTranslation } from "react-i18next";

import HeadIcon from "@/assets/icons/headIcon.svg?component";
import TimeIcon from "@/assets/icons/time.svg?component";
import BlockIcon from "@/assets/icons/block.svg?component";
import RightArrowIcon from "@/assets/icons/rightArrow.svg?component";
import Link from "next/link";
import { IOType } from "@/constants/common";
import ListCellItem from "./ListCellItem";
import styles from "./index.module.scss";
import classNames from "classnames";
import { useEffect, useRef, useMemo } from "react";
import DateTime from "../DateTime";
import BigNumber from "bignumber.js";
import { shannonToCkb } from "@/utils/util";
import TwoSizeAmount from "@/components/TwoSizeAmount";

type TransactionItemWithCellsProps = {
  transaction: APIExplorer.AddressTransactionPageResponse;
  showBlockInfo?: boolean;
  scrollIntoViewOnMount?: boolean;
  currentAddress?: string;
  // transaction: Transaction & { btcTx: RawBtcRPC.BtcTx | null };
  // address?: string;
  // isBlock?: boolean;
  // titleCard?: ReactNode | null;
  // circleCorner?: CircleCorner;
  // scrollIntoViewOnMount?: boolean;
};

export default function TransactionItemWithCells(
  props: TransactionItemWithCellsProps,
) {
  const {
    transaction: txInfo,
    showBlockInfo = false,
    scrollIntoViewOnMount,
    currentAddress,
  } = props;
  const ref = useRef<HTMLDivElement>(null);

  const ckbChange = useMemo(() => {
    if (!currentAddress) return null;
    const inputCount = txInfo.displayInputsCount;
    const outputCount = txInfo.displayOutputsCount;
    // 检查列表是否完整（length 是否等于 count）
    if (inputCount !== undefined && txInfo.displayInputs.length !== inputCount) {
      return null;
    }

    if (outputCount !== undefined && txInfo.displayOutputs.length !== outputCount) {
      return null;
    }

    const income = txInfo.income;
    return income !== null && income !== undefined
      ? { change: new BigNumber(income) }
      : null;
  }, [txInfo]);

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
        el.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <CardPanel ref={ref} className="mt-3 p-3 md:mt-5 md:p-5">
      <div className="mb-2.5 flex flex-row flex-wrap items-center justify-between gap-y-1.5">
        <div className="flex max-w-full flex-row gap-2">
          {/* left */}
          <HeadIcon className="flex-none" />
          <OutLink
            href={`/transaction/${txInfo.transactionHash}`}
            className="font-hash flex min-w-0 flex-row items-center"
          >
            <TextEllipsis
              className="min-w-0 flex-1 underline"
              text={txInfo.transactionHash}
              ellipsis={{ tail: -8 }}
            />
          </OutLink>
        </div>
        {showBlockInfo && (
          <div className="pl-8">
            <BlockTime tx={txInfo} />
          </div>
        )}
      </div>
      <div className="bg-white dark:bg-[#232323E5]">
        <div className="flex flex-col gap-1 p-2 sm:gap-3 md:rounded-2xl md:p-5 lg:flex-row">
          <CellList
            currentAddress={currentAddress}
            transaction={txInfo}
            ioType={IOType.Input}
            cells={txInfo.displayInputs}
          />
          <RightArrowIcon
            className={classNames(
              "flex-none rotate-90 self-center lg:mt-4 lg:rotate-0 lg:self-start",
              styles.arrowIcon,
            )}
          />
          <CellList
            currentAddress={currentAddress}
            transaction={txInfo}
            ioType={IOType.Output}
            cells={txInfo.displayOutputs}
          />
        </div>
        {/* CKB 变化展示（只在列表完整且有变化时显示） */}
        {ckbChange && <CkbChangeDisplay change={ckbChange.change} />}
      </div>
    </CardPanel>
  );
}

function BlockTime({ tx }: { tx: APIExplorer.AddressTransactionPageResponse }) {
  const { t } = useTranslation();
  let timestamp = 0;
  if (tx) {
    if (tx.blockTimestamp) {
      timestamp = +tx.blockTimestamp;
    }
  }

  const dateTime = new Date(timestamp).toISOString();

  if (!tx) {
    return null;
  }

  if (tx.blockTimestamp) {
    return (
      <time
        dateTime={dateTime}
        className={classNames(
          "transactionItemBlock",
          "text-xs sm:text-sm",
          styles.transactionBlockTime,
        )}
      >
        <div className="flex items-center gap-[4px]">
          <BlockIcon className="flex-none text-[#999]" />
          <span className="font-hash mr-[32px] text-[#999]">{`${t("block.block")} ${localeNumberString(tx.blockNumber)}`}</span>
        </div>
        <div className="flex items-center gap-[4px]">
          <TimeIcon className="flex-none text-[#999]" />
          <span className="text-[#999]">
            <DateTime date={timestamp} showRelative />
          </span>
        </div>
      </time>
    );
  }

  return null;
}

type CellListProps = {
  transaction: APIExplorer.AddressTransactionPageResponse;
  currentAddress?: string;
} & (
    | { ioType: IOType.Input; cells: Array<APIExplorer.CellInputResponse | Cell> }
    | {
      ioType: IOType.Output;
      cells: Array<APIExplorer.CellOutputResponse | Cell>;
    }
  );
const MAX_CELL_SHOW_SIZE = 10;
function CellList(props: CellListProps) {
  const { cells, ioType, currentAddress, transaction } = props;
  const { t } = useTranslation();
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      {cells.slice(0, MAX_CELL_SHOW_SIZE).map((cell) => (
        <ListCellItem
          key={cell.id}
          ioType={ioType}
          cell={
            cell as
            | APIExplorer.CellInputResponse
            | APIExplorer.CellOutputResponse
          }
          currentAddress={currentAddress}
        />
      ))}
      {cells.length >= MAX_CELL_SHOW_SIZE && (
        <div className="mt-2 flex flex-row items-center justify-center gap-1">
          <Link
            className="hover:text-primary text-[12px] text-[#999]"
            href={`/transaction/${transaction.transactionHash}`}
          >
            {t("common.view_all")}
          </Link>
        </div>
      )}
    </div>
  );
}

// CKB 变化展示组件
type CkbChangeDisplayProps = {
  change: BigNumber;
};

function CkbChangeDisplay({ change }: CkbChangeDisplayProps) {
  const isPositive = change.isGreaterThan(0);
  const isNegative = change.isLessThan(0);

  const colorClass = isPositive
    ? "text-[#00CC9B]"
    : isNegative
      ? "text-[#FF4545]"
      : "text-gray-500";

  const sign = isPositive ? "+" : "-";

  return (
    <div
      className={classNames(
        "flex items-center justify-end rounded-sm px-2 pb-3 text-sm md:-mt-2 md:px-5",
        colorClass,
      )}
    >
      <span className="font-hash mr-0.5 text-sm leading-5">{sign}</span>
      <TwoSizeAmount
        className="leading-5"
        integerClassName="text-sm"
        decimalClassName="text-xs"
        amount={shannonToCkb(change.abs())}
        format={[8]}
        unit={<span className="ml-1! text-sm text-[#999]">CKB</span>}
      />
    </div>
  );
}

import { useTranslation } from "react-i18next";
import ListContainer from "./ListContainer";
import { BLOCK_POLLING_TIME } from "@/constants/common";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading";
import TransactionLightIcon from "../../assets/transaction.light.svg?component"
import TransactionDarkIcon from "../../assets/transaction.dark.svg?component"
import classNames from "classnames";
import styles from './LatestTransactions.module.scss'
import Link from "next/link";
import { HighLightLink } from "@/components/Text";
import { localeNumberString } from "@/utils/number";
import { useParsedDate } from "@/hooks";
import { shannonToCkb } from "@/utils/util";
import BigNumber from "bignumber.js";
import TextEllipsis from "@/components/TextEllipsis";
import TwoSizeAmount from "@/components/TwoSizeAmount";
import server from "@/server";
import { useBlockChainInfo } from "@/store/useBlockChainInfo";
import { useTheme } from "@/components/Theme";
import OutLink from "@/components/OutLink";

export default function LatestTransactions() {
  const { t } = useTranslation();

  const transactionsQuery = useQuery({
    queryKey: ["latest_transactions"],
    refetchInterval: BLOCK_POLLING_TIME,
    queryFn: async () => {
      const list = await server.explorer("GET /ckb_transactions/homePage", { pageSize: 15 })
      return {
        transactions: list ?? [],
      };
    },
  });

  const transactions = transactionsQuery.data?.transactions ?? [];
  return (
    <ListContainer
      title={t("home.latest_transactions")}
      link="/transaction/list"
    >
      {
        transactions.length > 0 ? (
          transactions.map((tx) => (
            <TranactionItem key={tx.transactionHash} tx={tx} />
          ))
        ) : (
          <Loading className="py-[56px]" />
        )
      }
    </ListContainer>
  )
}


function TranactionItem({ tx }: { tx: APIExplorer.TransactionPageResponse }) {
  const parsedBlockCreateAt = useParsedDate(tx.blockTimestamp);
  const { t } = useTranslation();
  const [theme] = useTheme();
  const isDarkTheme = theme === 'dark';
  // const topBlockNumber = useLatestBlockNumber();
  const topBlockNumber = useBlockChainInfo(s => s.blockNumber);
  const liveCellChanges = Number(tx.liveCellChanges);
  const confirmation = topBlockNumber - Number(tx.blockNumber);
  const confirmationUnit = confirmation > 1 ? t("address.confirmations") : t("address.confirmation");
  const TransactionIcon = isDarkTheme ? TransactionDarkIcon : TransactionLightIcon;
  return (
    <div className={classNames(styles.transaction, "flex flex-col sm:flex-row justify-between bg-[#F5F9FB] dark:bg-[#303030] gap-2 p-3 sm:p-4 lg:p-6 xl:p-4 2xl:p-6 rounded-[8px]")}>
      <div className="flex flex-row gap-[12px]">
        <div className="flex size-[42px] sm:size-[54px] rounded-[4px] text-primary"><TransactionIcon width="100%" height="100%" /></div>
        <div className="flex-1 items-center sm:items-start flex flex-row sm:flex-col justify-between">
          <OutLink
            className="font-menlo font-bold text-[18px] leading-[1]"
            href={`/transaction/${tx.transactionHash}`}
          >
            <TextEllipsis
              text={tx.transactionHash}
              ellipsis={{ head: 4, tail: -4 }}
            />
          </OutLink>
          <div className="font-medium text-[#999] leading-[1]">{Math.max(confirmation, 0)} {confirmationUnit}</div>
        </div>
      </div>

      <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between">
        <div className="flex flex-row text-[16px] leading-[22px] gap-3">
          <span className="text-[#232323] dark:text-white font-medium whitespace-nowrap">{t("block.block")}</span>
          <Link
            className="font-menlo text-[#484D4E] dark:text-[#EDF2F2] hover:text-primary underline"
            href={`/block/${tx.blockNumber}`}
          >
            {localeNumberString(tx.blockNumber)}
          </Link>
        </div>
        <div className="font-medium text-[#999] leading-[1]">
          {parsedBlockCreateAt}
        </div>
      </div>
      <div className="sm:basis-[158px] flex flex-row sm:flex-col justify-between text-right">
        <div className="text-[16px] leading-[22px]">
          <TwoSizeAmount
            integerClassName="font-menlo"
            decimalClassName="font-menlo text-[12px]"
            format={[2]}
            amount={shannonToCkb(tx.capacityInvolved)}
            unit={<span className="font-medium ml-[6px]">CKB</span>}
          />
        </div>
        <div className="font-medium text-[14px] text-[#999] leading-[1]">
          {`${liveCellChanges >= 0 ? "+" : "-"}${Math.abs(liveCellChanges)} ${t("home.cells")}`}
        </div>
      </div>
    </div >
  )
}
import Card from "@/components/Card";
import { useTranslation } from "react-i18next";
import { useInfiniteQuery } from "@tanstack/react-query";
import CardPanel from "@/components/Card/CardPanel";
import TxCellCard from "./TxCellCard";

import classNames from "classnames";
import server from "@/server";
import LoadMore from "@/components/LoadMore";
import RightArrowIcon from '@/assets/icons/pixel-arrow-right.svg?component';
import { useLayoutEffect, useRef, useState } from "react";
import Loading from "@/components/Loading";


const PAGE_SIZE = 10;

const tabItems = [
  {
    key: "input",
    tlabel: "Input",
  },
  {
    key: "output",
    tlabel: "Output",
  },
] as const

export default function TransactionCells({ transaction }: { transaction: APIExplorer.TransactionResponse }) {
  const { t } = useTranslation()
  const [tabKey, setTabKey] = useState<(typeof tabItems)[number]['key']>(tabItems[0].key)
  // const layout = useTxLaytout();
  // const isLite = layout === LayoutLiteProfessional.Lite;
  const isPendingData = transaction.txStatus === "pending"
  return (
    <Card className="relative mt-3 md:mt-5 p-3 md:p-6">
      <div className="text-base md:text-lg mb-3 md:mb-6">{t('transaction.transaction_details')}</div>
      <div className="md:hidden">
        <Tabs className="mb-4" activeKey={tabKey} setActiveKey={setTabKey} />
        <CellsPanel
          key={tabKey}
          dir={tabKey}
          className="flex-1"
          // className="mb-[20px]"
          txHash={transaction.transactionHash}
          isPendingData={isPendingData}
        />
      </div>
      <div className="hidden md:flex flex-row gap-6 items-stretch">
        <CellsPanel
          dir="input"
          className="flex-1"
          // className="mb-[20px]"
          txHash={transaction.transactionHash}
          isPendingData={isPendingData}
        />
        <RightArrowIcon className={classNames("flex-none text-[#484D4E] dark:text-[#999]")} />
        <CellsPanel
          dir="output"
          className="flex-1"
          txHash={transaction.transactionHash}
          isPendingData={isPendingData}
        />
      </div>
    </Card>
  )
}
function CellsPanel({ dir, txHash, className, isPendingData }: { className?: string, dir: "input" | "output", txHash: string, isPendingData:boolean }) {
  const { t } = useTranslation()
  const isInput = dir === "input"
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [isInput ? 'transaction_inputs' : "transaction_outputs", txHash],
    queryFn: async ({ pageParam }) => {
      const res = await server.explorer(
        isInput ? "GET /ckb_transactions/{txHash}/display_inputs" : "GET /ckb_transactions/{txHash}/display_outputs",
        { page: pageParam, pageSize: PAGE_SIZE, txHash }
      )
      let list = res?.records || [];
      let total = res?.total || 0;
      if (isInput) {
        if (list.length === 1 && (list[0] as APIExplorer.CellInputResponse).fromCellbase) {
          list = [];
          total = 0;
        }
        list.forEach(cell => {
          cell.status = 'dead';
          cell.consumedTxHash = txHash;
        })
      }
      return {
        data: list,
        total: total,
      }
    },
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPageParam * PAGE_SIZE >= lastPage.total) return null
      return lastPageParam + 1
    },
    initialPageParam: 1,
  })

  const cells = data?.pages.map(page => page.data).flat() ?? []
  const total = data?.pages[0]?.total ?? 0

  // if (!total) return null;
  return (
    <CardPanel className={classNames("pl-3 md:pl-4 pt-5", className)}>
      <div className="text-base md:text-lg mb-5">{isInput ? t("transaction.input") : t("transaction.output")} ({total})</div>
      <div className="@container">
        <div className="flex flex-col gap-5 px-3 md:px-5 pt-0 pb-5 -ml-3 md:-ml-5 md:max-h-[800px] overflow-y-auto">
          {isLoading && <Loading />}
          {
            cells.map((cell, index) => (
              <TxCellCard
                since={cell.since?.raw}
                key={cell.id}
                cell={cell}
                showStatus={!isInput}
                seq={!isInput ? index : undefined}
                isPendingData={isPendingData}
              />
            ))
          }
          {
            hasNextPage ? (
              <div className="col-span-full">
                <LoadMore
                  onLoadMore={fetchNextPage}
                />
              </div>
            ) : null
          }
        </div>
      </div>
    </CardPanel>
  )
}




type TabsProps = {
  activeKey: (typeof tabItems)[number]['key'];
  setActiveKey: (key: (typeof tabItems)[number]['key']) => void;
  className?: string;
}
function Tabs(props: TabsProps) {
  const { activeKey, setActiveKey, className } = props;

  return (
    <div
      className={classNames(
        "flex flex-row items-center border bg-[#fbfbfb] border-[#d9d9d9] dark:bg-[#363839] dark:border-[#4c4c4c] rounded-4xl",
        className
      )}>
      {
        tabItems.map(item => (
          <div
            key={item.key}
            onClick={() => setActiveKey(item.key)}
            className={classNames("flex-1 text-center rounded-4xl py-1 text-base", {
              "bg-black text-white dark:bg-primary": activeKey === item.key,
              "text-[#999] cursor-pointer": activeKey !== item.key,
            })}
          >
            {item.tlabel}
          </div>
        ))
      }
    </div>
  )
}

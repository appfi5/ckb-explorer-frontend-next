import Card from "@/components/Card";
import { useTranslation } from "react-i18next";
import { useInfiniteQuery } from "@tanstack/react-query";
import CardPanel from "@/components/Card/CardPanel";
import TxCellCard from "./TxCellCard";

import classNames from "classnames";
import server from "@/server";
import LoadMore from "@/components/LoadMore";



const PAGE_SIZE = 10;

export default function TransactionCells({ transaction }: { transaction: APIExplorer.TransactionResponse }) {
  const { t } = useTranslation()

  // const layout = useTxLaytout();
  // const isLite = layout === LayoutLiteProfessional.Lite;
  return (
    <Card className="mt-[20px] p-[24px]">
      <div className="text-base md:text-lg mb-[24px]">{t('transaction.transaction_details')}</div>

      <CellsPanel
        dir="input"
        txHash={transaction.transactionHash}
      />
      <CellsPanel
        className="mt-[20px]"
        dir="output"
        txHash={transaction.transactionHash}
      />
    </Card>
  )
}
function CellsPanel({ dir, txHash, className }: { className?: string, dir: "input" | "output", txHash: string }) {
  const { t } = useTranslation()
  const isInput = dir === "input"
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
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

  return (
    <CardPanel className={classNames("pl-[20px] pt-[20px]", className)}>
      <div className="text-base md:text-lg">{isInput ? t("transaction.input") : t("transaction.output")} ({total})</div>
      <div className="@container">
        <div className="grid grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-3 @6xl:grid-cols-4 @8xl:grid-cols-5 gap-[16px] p-5 -ml-5  max-h-[254px] overflow-y-auto">
          {
            cells.map((cell, index) => (
              <TxCellCard
                key={cell.id}
                cell={cell}
                showStatus={!isInput}
                seq={!isInput ? index : undefined}
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
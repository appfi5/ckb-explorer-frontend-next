import Card from "@/components/Card"
import Empty from "@/components/Empty"
import Filter from "@/components/Filter"
import Pagination from "@/components/Pagination"
import { QueryResult } from "@/components/QueryResult"
import TransactionItemWithCells from "@/components/TransactionItemWithCells"
import { usePaginationParamsInListPage, useSearchParams } from "@/hooks"
import server from "@/server"
import { useQuery } from "@tanstack/react-query"
import classNames from "classnames"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"



type AddressTransactionsProps = {
  udtInfo: APIExplorer.UdtDetailResponse & { typeScriptHash: string }
}

export default function UDTTransactions(props: AddressTransactionsProps) {
  const { udtInfo } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const { currentPage, pageSize, setPage, setPageSize } = usePaginationParamsInListPage()
  const { filter } = useSearchParams('filter')
  const txsQuery = useQuery({
    queryKey: ['udt_transactions', udtInfo.typeScriptHash, currentPage, pageSize, filter],
    queryFn: async () => {
      const haveFilter = !!filter;
      const isSearchingAddress = haveFilter && filter?.startsWith("ck");
      const isSearchingTxHash = haveFilter && filter?.startsWith("0x");
      if (haveFilter && !isSearchingAddress && !isSearchingTxHash) {
        return {
          pages: 0,
          total: 0,
          records: []
        } as unknown as APIExplorer.PageUdtTransactionPageResponse
      }
      const resData = server.explorer("GET /udt_transactions/{typeScriptHash}", {
        page: currentPage,
        pageSize,
        sort: "",
        typeScriptHash: udtInfo.typeScriptHash,
        addressHash: isSearchingAddress ? filter : "",
        txHash: isSearchingTxHash ? filter : "",
      });

      return resData
    }
  })

  return (
    <Card className="p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between">
        <Tabs
          currentTab="tx"
          tabs={[{ key: 'tx', label: <>{t("transaction.transactions")}({txsQuery.data?.total ?? 0})</> }]}
          onTabChange={() => { }}
        />
        <Filter
          defaultValue={filter ?? ''}
          placeholder={t('search.search') + " " + t('block.address_or_hash')}
          onFilter={filter => {
            // router.push(`/block/${blockId}?${new URLSearchParams({ filter })}`)
            router.push(`${window.location.pathname}?${new URLSearchParams({ filter })}`)
          }}
          onReset={() => {
            // router.push(`/block/${blockId}`)
            router.push(window.location.pathname)
          }}
          className="hidden sm:block w-[296px]"
        />
      </div>

      <QueryResult query={txsQuery}>
        {(txResponse) => {
          const { pages, total, records: txList = [] } = txResponse || {};
          // const totalPages = pages || 0;
          return (

            <>
              <div>
                {txList.map((transaction, index) => (
                  // <TransactionItem
                  //   transaction={transaction}
                  //   key={transaction.transactionHash}
                  //   circleCorner={{
                  //     bottom: index === txList.length - 1 && totalPages === 1,
                  //   }}
                  // />
                  <TransactionItemWithCells
                    key={transaction.transactionHash}
                    transaction={transaction}
                    showBlockInfo
                  />
                ))}
                {txList.length === 0 ? <Empty className="mt-3 sm:mt-5 min-h-[40px] gap-2" message={t(`transaction.no_records`)} /> : null}
              </div>
              <Pagination
                total={total}
                pageSize={pageSize}
                currentPage={currentPage}
                // totalPages={totalPages}
                onChange={setPage}
                setPageSize={setPageSize}
              />
            </>
          );
        }}
      </QueryResult>
    </Card>
  )
}


function Tabs<T extends string>({ currentTab, tabs, onTabChange }: { currentTab: T; tabs: readonly { key: T, label: ReactNode }[]; onTabChange: (tab: T) => void }) {
  return (
    <div className="flex gap-8">
      {tabs.map((tab) => (
        <div
          key={tab.key}
          className={classNames("text-base sm:text-[18px] leading-[24px]", "relative cursor-pointer", currentTab !== tab.key ? "text-[#999]" : "font-medium")}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
          {/* <div className={classNames("absolute left-0 right-0 mx-auto bottom-[-10px] w-[64px] h-[4px] bg-primary", currentTab !== tab.key ? "hidden" : "")} /> */}
        </div>
      ))}
    </div>
  )
}
import Card from "@/components/Card"
import Empty from "@/components/Empty"
import Pagination from "@/components/Pagination"
import { QueryResult } from "@/components/QueryResult"
import TransactionItemWithCells from "@/components/TransactionItemWithCells"
import { usePaginationParamsInListPage } from "@/hooks"
import server from "@/server"
import { useQuery } from "@tanstack/react-query"
import classNames from "classnames"
import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import MonthPickerComponent from "@/components/MonthPickerComponent"
import { useState, useEffect, useMemo } from "react"
import QuestionIcon from "@/assets/icons/question.svg?component"
import Tips from "@/components/Tips";
import dayjs from "dayjs";
import styles from "./index.module.scss"

type AddressTransactionsProps = {
  addressInfo: APIExplorer.AddressResponse
}

export default function AddressTransactions(props: AddressTransactionsProps) {
  const { addressInfo } = props;
  const address = addressInfo.addressHash;
  const { t } = useTranslation();
  const { currentPage, pageSize, setPage, setPageSize } = usePaginationParamsInListPage()
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(new Date());

  const getMonthDateRange = (date: Date) => {
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return {
      startDate: dayjs(startDate).format('YYYY-MM-DD'),
      endDate: dayjs(endDate).format('YYYY-MM-DD'),
    };
  };

  const monthDateRange = useMemo(() => {
    return getMonthDateRange(selectedMonth || new Date());
  }, [selectedMonth]);

  const txsQuery = useQuery({
    queryKey: ['address_transactions', address, currentPage, pageSize, monthDateRange],
    queryFn: () => server.explorer("GET /address_transactions/{address}", { startTime: monthDateRange.startDate, endTime: monthDateRange.endDate, page: currentPage, pageSize, sort: "", address })
  })

  return (
    <Card className="p-3 sm:p-6">
      <div className={styles.headerCon}>
        <Tabs
          currentTab="tx"
          tabs={[{ key: 'tx', label: <>{dayjs(selectedMonth).format('YYYY-MM')} {t("transaction.transactions")} {txsQuery.isLoading ? "" : `(${txsQuery.data?.total ?? 0})`}</> }]}
          onTabChange={() => { }}
        />
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-[5px]">
            <div>{t("address.history_search")}</div>
            <Tips
              placement="top"
              trigger={
                <QuestionIcon className="text-[#999999] hover:text-primary cursor-pointer" />
              }
            >
              {t("address.history_search_description")}
            </Tips>
            <span>:</span>
          </div>
          <MonthPickerComponent selectedMonth={selectedMonth} onSelect={(date) => { setSelectedMonth(date); setPage(1); }} />
        </div>
      </div>
      <QueryResult query={txsQuery}>
        {(txResponse) => {
          const { total, records: txList = [] } = txResponse || {};
          return (

            <>
              <div>
                {txList.map((transaction, index) => (
                  <>
                    {/* <TransactionItem
                      address={address}
                      transaction={transaction}
                      key={transaction.transactionHash}
                      circleCorner={{
                        bottom: index === txList.length - 1 && totalPages === 1,
                      }}
                    /> */}
                    <TransactionItemWithCells
                      key={transaction.transactionHash}
                      currentAddress={address}
                      transaction={transaction}
                      showBlockInfo
                    />
                  </>
                ))}
                {txList.length === 0 ? <Empty message={t(`transaction.no_records`)} /> : null}
              </div>
              <Pagination
                total={total}
                currentPage={currentPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
                // totalPages={totalPages}
                onChange={setPage}
              // rear={null
              //   // isPendingListActive ? null : (
              //   //   <CsvExport link={`/export-transactions?type=address_transactions&id=${address}`} />
              //   // )
              // }
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
    <div className="flex mb-3 sm:mb-5 gap-8">
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
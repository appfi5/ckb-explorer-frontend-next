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
import { useState, useEffect, useMemo, useRef } from "react"
import QuestionIcon from "@/assets/icons/question.svg?component"
import Tips from "@/components/Tips";
import dayjs from "dayjs";
import styles from "./index.module.scss"

type AddressTransactionsProps = {
  addressInfo: APIExplorer.AddressResponse
}

const getMonthDateRange = (date: Date) => {
  const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
  const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return {
    startDate: dayjs(startDate).format('YYYY-MM-DD'),
    endDate: dayjs(endDate).format('YYYY-MM-DD'),
  };
};

export default function AddressTransactions(props: AddressTransactionsProps) {
  const { addressInfo } = props;
  const address = addressInfo.addressHash;
  const { t } = useTranslation();
  const { currentPage, pageSize, setPage, setPageSize } = usePaginationParamsInListPage()
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(new Date());
  const disabledDate = addressInfo.timestamp;

  const queryParamsRef = useRef({
    page: currentPage,
    month: selectedMonth
  });

  const [isQueryReady, setIsQueryReady] = useState(false);

  useEffect(() => {
    const isMonthChanged = queryParamsRef.current.month && selectedMonth &&
      (queryParamsRef.current.month.getMonth() !== selectedMonth.getMonth() ||
        queryParamsRef.current.month.getFullYear() !== selectedMonth.getFullYear());

    if (isMonthChanged) {
      queryParamsRef.current = {
        page: 1,
        month: selectedMonth
      };

      setPage(1);
      setIsQueryReady(true);
    } else if (queryParamsRef.current.page !== currentPage) {
      queryParamsRef.current = {
        ...queryParamsRef.current,
        page: currentPage
      };

      setIsQueryReady(true);
    }
  }, [selectedMonth, currentPage, setPage]);

  useEffect(() => {
    if (isQueryReady) {
      setIsQueryReady(false);
    }
  }, [isQueryReady]);

  const monthDateRange = useMemo(() => {
    return getMonthDateRange(queryParamsRef.current.month || new Date());
  }, [queryParamsRef.current.month]);

  const txsQuery = useQuery({
    queryKey: ['address_transactions', address, queryParamsRef.current.page, pageSize, monthDateRange],
    queryFn: () => server.explorer("GET /address_transactions/{address}", {
      startTime: monthDateRange.startDate,
      endTime: monthDateRange.endDate,
      page: queryParamsRef.current.page,
      pageSize,
      sort: "",
      address
    }),
    enabled: isQueryReady
  })

  // 初始加载时触发一次查询
  useEffect(() => {
    setIsQueryReady(true);
  }, []);

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
          <MonthPickerComponent selectedMonth={selectedMonth} onSelect={setSelectedMonth} disabledDate={disabledDate} />
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
                onChange={setPage}
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
        </div>
      ))}
    </div>
  )
}
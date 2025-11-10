"use client"
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import Content from '@/components/Content'
import DaoTransactions from './components/DaoTransactions'
import Filter from '@/components/Filter'
import DepositorRank from './components/DepositorRank'
import { useSearchParams, usePaginationParamsInListPage } from '@/hooks'
import DaoOverview from './components/DaoOverview'
import DaoBanner from './components/DaoBanner'
import { QueryResult } from '@/components/QueryResult'
import { defaultNervosDaoInfo } from './state'
import styles from './index.module.scss'
import { useRouter } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import DownloadIcon from '@/components/icons/download'
import PixelBorderBlock from '@/components/PixelBorderBlock'
import { useState } from 'react'
import server from '@/server'
import { useIsMobile } from '@/hooks'

export const NervosDao = () => {
  const router = useRouter();
  const [t] = useTranslation()
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState<'transactions' | 'depositors'>('transactions')
  const { currentPage, pageSize, setPage, setPageSize } = usePaginationParamsInListPage()
  const params = useSearchParams('filter')

  const queryNervosDao = useQuery({
    queryKey: ['nervos-dao'],
    queryFn: async () => {
      const res = await server.explorer("GET /contracts/nervos_dao")
      return res
    }
  })

  const queryNervosDaoTransactions = useQuery({
    queryKey: ['nervos-dao-transactions', currentPage, pageSize, params.filter],
    queryFn: async () => {
      const res = await server.explorer("GET /contract_transactions/nervos_dao", {
        page: currentPage,
        pageSize: pageSize,
        txHash: params.filter?.startsWith("0x") ? params.filter : null,
        addressHash: params.filter?.startsWith("0x") ? null : params.filter,
      })
      return {
        transactions: res?.records ?? [],
        total: res?.total ?? 0,
      }
    },
    enabled: !activeTab || activeTab === 'transactions'
  })
  
  const queryNervosDaoDepositors = useQuery({
    queryKey: ['nervos-dao-depositors'],
    queryFn: async () => {
      const res = await server.explorer("GET /dao_depositors")
      return res
    },
    enabled: activeTab === 'depositors'
  })


  return (
    <Content>
      <DaoBanner estimatedApc={queryNervosDao.data?.estimatedApc ?? defaultNervosDaoInfo.estimatedApc} />
      <div className='container'>
        <DaoOverview nervosDao={queryNervosDao.data ?? defaultNervosDaoInfo} />
        <div className={styles.tabContainer}>
          <div className={styles.tabHeader}>
            <Tabs
              type="underline"
              value={activeTab}
              className='w-[320px]!'
              onValueChange={(value: string) => setActiveTab(value)}
            >
              <TabsList className='gap-[60px]! text-[18px]!'>
                <TabsTrigger className={styles.tabsTriggerStyle} value="transactions" key="transactions">{t('nervos_dao.dao_tab_transactions')}</TabsTrigger>
                <TabsTrigger className={styles.tabsTriggerStyle} value="depositors" key="depositors">{t('nervos_dao.dao_tab_depositors')}</TabsTrigger>
              </TabsList>
            </Tabs>

            {!isMobile && <div className={styles.txHeaderLabels}>
              {/* <PixelBorderBlock
                className="cursor-pointer h-[32px] w-auto"
                pixelSize="2px"
                borderColor={theme === 'light' ? "#F0F1F8" : "#4C4C4C"}
                contentClassName=' w-auto flex items-center justify-center gap-[5px] px-[14px] py-[2px] leading-[20px]'
                onClick={() => {
                  const link = activeTab === 'transactions' ? '/nervosdao/transaction/export' : '/nervosdao/depositor/export'
                  router.push(link)
                }}
              >
                <DownloadIcon color="#999999" />
                <span className='font-medium text-[14px] text-[#999999]'>{t("export_transactions.csv_export")}</span>
              </PixelBorderBlock> */}
              <Filter
                defaultValue={params.filter}
                showReset={!!params.filter}
                placeholder={activeTab === 'depositors' ? t('search.addr') : `${t('search.tx')} / ${t('search.addr')}`}
                onFilter={filter => {
                  router.push(`/nervosdao?${new URLSearchParams({ filter, activeTab })}`)
                }}
                onReset={() => {
                  router.push(`/nervosdao?${new URLSearchParams({ activeTab })}`)
                }}
              />
            </div>}
          </div>
          {activeTab === 'transactions' ? (
            <QueryResult query={queryNervosDaoTransactions} delayLoading>
              {data => (
                <DaoTransactions
                  currentPage={currentPage}
                  pageSize={pageSize}
                  transactions={data?.transactions ?? []}
                  total={data?.total ?? 0}
                  filterNoResult={!!params.filter && data?.total === 0}
                  setPage={setPage}
                  setPageSize={setPageSize}
                />
              )}
            </QueryResult>
          ) : (
            <QueryResult query={queryNervosDaoDepositors} delayLoading>
              {data => <DepositorRank depositors={data ?? []} filter={params.filter} />}
            </QueryResult>
          )}
        </div>
      </div>
    </Content>
  )
}

export default NervosDao

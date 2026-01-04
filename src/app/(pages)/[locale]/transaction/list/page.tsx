"use client"
import { type FC, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { dayjs, parseSimpleDate } from '@/utils/date'
import Content from '@/components/Content'
import { shannonToCkb } from '@/utils/util'
import { localeNumberString } from '@/utils/number'
import Pagination from '@/components/Pagination'
import Capacity from '@/components/Capacity'
import AddressText from '@/components/AddressText'
import { useIsMobile, usePaginationParamsInListPage, useSearchParams, useSortParam, useMediaQuery } from '@/hooks'
// import { explorerService } from '@/services/ExplorerService'
import { Tabs } from './Tabs'
import styles from './index.module.scss'
import { QueryResult } from '@/components/QueryResult'
import { type Column, Table } from './Table'
import { assert } from '@/utils/error'
import SortIcon from '@/assets/sort_icon.svg'
import { TableTitleRowItem } from '@/components/Table/TableComp'
import { type Transaction } from '@/models/Transaction'
import { type CardCellFactory, CardListWithCellsList } from '@/components/CardList'
import Link from 'next/link'
import InteImage from '@/components/InteImage'
import server from '@/server';
import DateTime from '@/components/DateTime'
import classNames from 'classnames'
import TextEllipsis from '@/components/TextEllipsis'

type TxStatus = 'confirmed' | 'pending'

type ConfirmedSortByType = 'height' | 'capacity'
type PendingSortByType = 'capacity' | 'time' | 'fee'

interface SortItemCardData<T> extends CardCellFactory<T> {
  sortRule?: ConfirmedSortByType | PendingSortByType
}

const TransactionCardGroup: FC<{
  transactions: Transaction[]
  type: TxStatus
  sortButton: (sortRule?: ConfirmedSortByType | PendingSortByType) => ReactNode
}> = ({ transactions, type, sortButton }) => {
  const { t } = useTranslation()
  const itemHash: SortItemCardData<Transaction> = {
    title: t('transaction.transaction_hash'),
    content: transaction => (
      // <AddressText
      //   disableTooltip
      //   monospace={false}
      //   linkProps={{
      //     className: styles.addressLink,
      //     href: `/transaction/${transaction.transactionHash}`,
      //   }}
      // >
      //   {transaction.transactionHash}
      // </AddressText>
      <Link className='text-primary' href={`/transaction/${transaction.transactionHash}`}>
        <TextEllipsis ellipsis="transaction"
          text={transaction.transactionHash}
        />
      </Link>
    ),
  }
  const itemCapacity: SortItemCardData<Transaction> = {
    title: t('transaction.capacity'),
    sortRule: 'capacity',
    content: transaction => (
      <Capacity capacity={shannonToCkb(transaction.capacityInvolved)} textDirection="left" integerClassName="text-sm" layout="responsive" unit={null} />
    ),
  }

  const confirmedItems: SortItemCardData<Transaction>[] = [
    itemHash,
    {
      title: t('transaction.height'),
      sortRule: 'height',
      content: transaction => (
        <Link className='font-hash' href={`/block/${transaction.blockNumber}`}>
          <span>{localeNumberString(transaction.blockNumber)}</span>
        </Link>
      ),
    },
    itemCapacity,
    {
      title: t('transaction.time'),
      content: transaction => {
        return (
          <div>
            <DateTime date={transaction.blockTimestamp} showRelative />
          </div>
        )
      },
    },
  ]

  const pendingItems: SortItemCardData<Transaction>[] = [
    itemHash,
    itemCapacity,
    {
      title: t('transaction.time'),
      sortRule: 'time',
      content: transaction => {
        assert(transaction.createTimestamp != null)
        return parseSimpleDate(transaction.createTimestamp)
      }
    },
    {
      title: t('transaction.transaction_fee'),
      sortRule: 'fee',
      content: transaction => <Capacity capacity={shannonToCkb(transaction.transactionFee)} layout="responsive" />,
    },
  ]

  const items = type === 'confirmed' ? confirmedItems : pendingItems

  return (
    <>
      {/* <div className={styles.transactionCardHeader}>
        {items
          .filter(data => data.sortRule)
          .map((data: SortItemCardData<Transaction>) => (
            <TableTitleRowItem width="fit-content" key={typeof data.title === 'string' ? data.title : ''}>
              {typeof data.title === 'function' ? null : <div>{data.title}</div>}
              {sortButton(data.sortRule)}
            </TableTitleRowItem>
          ))}
      </div> */}
      <CardListWithCellsList
        className={classNames(styles.transactionCardGroup)}
        dataSource={transactions}
        getDataKey={transaction => transaction.transactionHash}
        cells={items}
        cardProps={{ className: styles.transactionCard }}
      />
    </>
  )
}

const TransactionTable: FC<{
  transactions: Transaction[]
  type: TxStatus
  currentPage: number
  sortButton: (sortRule: ConfirmedSortByType | PendingSortByType) => ReactNode
}> = ({ transactions, type, currentPage, sortButton }) => {
  const [t] = useTranslation()

  const colHash: Column<Transaction> = {
    key: 'hash',
    title: t('transaction.transaction_hash'),
    className: styles.colHash,
    width: '30%',
    textDirection: 'left',
    getLinkProps: transaction => ({ href: `/transaction/${transaction.transactionHash}` }),
    render: transaction => <AddressText disableTooltip>{transaction.transactionHash}</AddressText>,
  }

  const confirmedColumns: Column<Transaction>[] = [
    colHash,
    {
      key: 'height',
      title: (
        <>
          <div>{t('transaction.height')}</div>
          {/* {sortButton('height')} */}
        </>
      ),
      width: '20%',
      textDirection: 'left',
      getLinkProps: transaction => ({ href: `/block/${transaction.blockNumber}` }),
      render: transaction => localeNumberString(transaction.blockNumber),
    },
    {
      key: 'time',
      title: t('transaction.time'),
      width: '25%',
      textDirection: 'left',
      render: transaction => parseSimpleDate(transaction.blockTimestamp),
    },
    {
      key: 'capacity',
      title: (
        <>
          <div>{t('transaction.capacity')}</div>
          {/* {sortButton('capacity')} */}
        </>
      ),
      width: '25%',
      textDirection: 'right',
      render: transaction => (
        <Capacity capacity={shannonToCkb(transaction.capacityInvolved)} layout="responsive" unit={null} />
      ),
    },
  ]

  const pendingColumns: Column<Transaction>[] = [
    {
      key: 'hash',
      title: t('transaction.transaction_hash'),
      className: styles.colHash,
      width: '50%',
      textDirection: 'left',
      getLinkProps: transaction => ({ href: `/transaction/${transaction.transactionHash}` }),
      render: transaction => <AddressText disableTooltip>{transaction.transactionHash}</AddressText>,
    },
    {
      key: 'time',
      title: (
        <>
          <div>{t('transaction.time')}</div>
          {/* {sortButton('time')} */}
        </>
      ),
      width: '30%',
      textDirection: 'left',
      render: transaction => {
        assert(transaction.createTimestamp != null)
        return parseSimpleDate(transaction.createTimestamp)
      },
    },
    {
      key: 'bytes',
      title: (
        <>
          <div>{t('transaction.transaction_bytes')}</div>
        </>
      ),
      width: '20%',
      textDirection: 'left',
      render: transaction => transaction.bytes
    },
  ]

  const columns = type === 'confirmed' ? confirmedColumns : pendingColumns
  return (
    <Table
      className={styles.transactionTable}
      columns={columns}
      dataSource={transactions}
      getRowKey={transaction => transaction.transactionHash}
      isTransactionFree={type === 'confirmed'}
    />
  )
}

const TransactionsPanel: FC<{ type: TxStatus }> = ({ type }) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const { currentPage, pageSize, setPage, setPageSize } = usePaginationParamsInListPage()
  const MAX_PAGE_NUMBER = 5000

  const { sortBy, orderBy, sort, handleSortClick } = useSortParam<ConfirmedSortByType | PendingSortByType>(s =>
    type === 'confirmed' ? s === 'height' || s === 'capacity' : s === 'capacity' || s === 'time' || s === 'fee',
  )
  const query = useQuery({
    queryKey: [`${type}-transactions`, type, currentPage, pageSize, sortBy, orderBy] as const,
    queryFn: async ({ queryKey }) => {
      const [, type] = queryKey
      switch (type) {
        case 'pending': {
          const res: any = await server.explorer("GET /ckb_pending_transactions", { page: currentPage, pageSize: pageSize })
          return {
            transactions: res?.records ?? [],
            total: res?.total ?? 0,
          }
        }
        case 'confirmed':
        default: {
          // const { transactions, total } = await explorerService.api.fetchTransactions(currentPage, pageSize, sort)
          const res: any = await server.explorer("GET /ckb_transactions", { page: currentPage, pageSize: pageSize, sort: "" })
          return {
            transactions: res?.records ?? [],
            total: res?.total ?? 0,
          }
        }
      }
    },
    // initialData:
    //   state?.type === 'TransactionListPage' && state.createTime + stateStaleTime > Date.now()
    //     ? state.transactionsDataWithFirstPage
    //     : { total: 0, transactions: [] },
    // initialData: { total: 0, transactions: [] },
  })

  const sortButton = (sortRule?: ConfirmedSortByType | PendingSortByType) => (
    <button
      type="button"
      className={styles.sortIcon}
      data-order={sortRule === sortBy ? orderBy : undefined}
      onClick={() => handleSortClick(sortRule)}
    >
      <InteImage src={SortIcon} alt="" />
    </button>
  )

  return (
    <QueryResult query={query}>
      {data => {
        if (!data) {
          return <div>{t('transaction.no_records')}</div>
        }
        // const totalPages = Math.min(Math.ceil(data.total / pageSize), MAX_PAGE_NUMBER)
        return (
          <div className="mt-[16px]">
            {isMobile ? (
              <TransactionCardGroup type={type} transactions={data.transactions} sortButton={sortButton} />
            ) : (
              <TransactionTable type={type} transactions={data.transactions} sortButton={sortButton} currentPage={currentPage} />
            )}

            <Pagination
              className={classNames(styles.pagination, "bg-[#fff] rounded-[8px] shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] sm:bg-transparent sm:rounded-none sm:shadow-none mt-4 sm:mt-0 pr-4 sm:pr-0")}
              currentPage={currentPage}
              total={data.total}
              onChange={setPage}
              pageSize={pageSize}
              setPageSize={setPageSize}
            // annotation={
            //   totalPages === MAX_PAGE_NUMBER
            //     ? t('pagination.only_first_pages_visible', { pages: MAX_PAGE_NUMBER })
            //     : undefined
            // }
            />
          </div>
        )
      }}
    </QueryResult>
  )
}

const TransactionsPage: FC = () => {
  const [t] = useTranslation()
  const { tab } = useSearchParams('tab')

  const { data } = useQuery({
    queryKey: ['transactions-count',tab],
    queryFn: async () => {
      const res: any = await server.explorer("GET /ckb_pending_transactions", { page: 1, pageSize: 1 })
      return {
        total: res?.total ?? 0,
      }
    },
    enabled: tab === 'pending'
  })

  return (
    <Content>
      <div className={`${styles.transactionPanel} container`}>
        {/* <div className="font-medium text-[20px]">{t("home.transactions")}</div>
        <TransactionsPanel key="confirmed" type="confirmed" /> */}
        <Tabs
          activeKey={tab}
          getItemLink={key => `/transaction/list?tab=${key}`}
          items={[
            {
              label: 'Transactions',
              key: 'confirmed',
              children: <TransactionsPanel key="confirmed" type="confirmed" />,
            },
            {
              label: `Pending Transactions${!data?.total ? '' : `(${data.total.toLocaleString('en')})`}`,
              key: 'pending',
              children: <TransactionsPanel key="pending" type="pending" />,
            },
          ]}
        />
      </div>
    </Content>
  )
}

export default TransactionsPage;

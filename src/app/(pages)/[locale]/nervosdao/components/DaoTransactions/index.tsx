import { useTranslation } from 'react-i18next'
import { type Transaction } from '@/models/Transaction'
import { type RawBtcRPC } from '@/server/dataTypes'
import styles from './index.module.scss'
import TransactionItemWithCells from '@/components/TransactionItemWithCells'
import Pagination from '@/components/Pagination'

const DaoTransactions = ({
  currentPage,
  pageSize,
  transactions,
  total,
  filterNoResult,
  setPage,
  setPageSize
}: {
  currentPage: number
  pageSize: number
  transactions: APIExplorer.ContractTransactionPageResponse[]
  total: number
  filterNoResult?: boolean
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
}) => {
  const { t } = useTranslation()
  const totalPages = Math.ceil(total / pageSize)

  if (filterNoResult) {
    return (
      <div className={styles.daoNoResultPanel}>
        <span>{t('search.dao_filter_no_result')}</span>
      </div>
    )
  }

  return (
    <>
      {transactions.map(
        (transaction, index) =>
          transaction && (
            <TransactionItemWithCells
              key={index}
              transaction={transaction}
              showBlockInfo={true}
            />
          ),
      )}
      {totalPages > 1 && (
        <div className={styles.transactionsPagination}>
          <Pagination
            currentPage={currentPage}
            total={total}
            onChange={setPage}
            paginationType="list"
            setPageSize={setPageSize}
            pageSize={pageSize}
          />
        </div>
      )}
    </>
  )
}

export default DaoTransactions

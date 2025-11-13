import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Pagination from '@/components/Pagination'
import { localeNumberString } from '@/utils/number'
import { useSearchParams, useIsMobile } from '@/hooks'
import { deprecatedAddrToNewAddr } from '@/utils/util'
import styles from '../styles.module.scss'
import Filter from '@/components/Filter'
import { type RawBtcRPC } from '@/server/dataTypes'
import { type Transaction } from '@/models/Transaction'
import { useRouter } from 'next/navigation'
import Empty from '@/components/Empty'
import TransactionItemWithCells from '@/components/TransactionItemWithCells'

const CELL_BASE_ANCHOR = 'cellbase'

export const BlockList = ({
  onPageChange,
  currentPage,
  pageSize,
  transactions,
  total,
  blockId
}: {
  onPageChange: (page: number) => void
  currentPage: number
  pageSize: number
  transactions: (Transaction & { btcTx: RawBtcRPC.BtcTx | null })[]
  total: number
  blockId: string
}) => {
  const { t } = useTranslation()
  const totalPages = Math.ceil(total / pageSize)
  const router = useRouter();
  const hash = useMemo(() => window?.location.hash, [])
  const isMobile = useIsMobile()

  const { filter } = useSearchParams('filter')

  return (
    <div className={styles.blockCard}>
      <div className='flex justify-between items-center mb-[20px]'>
        <div className='text-[18px] font-medium leading-[26px]'>{t('transaction.transactions')} ({localeNumberString(total)})</div>
        {!isMobile && <Filter
          showReset={!!filter}
          defaultValue={filter ?? ''}
          placeholder={t('search.search') + " " + t('block.address_or_hash')}
          onFilter={filter => {
            router.push(`/block/${blockId}?${new URLSearchParams({ filter })}`)
          }}
          onReset={() => {
            router.push(`/block/${blockId}`)
          }}
          className="w-[296px]"
        />}
      </div>
      {transactions.map(
        (transaction, index) =>
          transaction && (
            <>
              {/* <TransactionItem
                key={transaction.transactionHash}
                scrollIntoViewOnMount={transaction.isCellbase && hash === `#${CELL_BASE_ANCHOR}`}
                transaction={{
                  ...transaction,
                  displayInputs: transaction.displayInputs.map(input => ({
                    ...input,
                    addressHash: input.addressHash && deprecatedAddrToNewAddr(input.addressHash),
                  })),
                  displayOutputs: transaction.displayOutputs.map(output => ({
                    ...output,
                    addressHash: output.addressHash && deprecatedAddrToNewAddr(output.addressHash),
                  })),
                }}
                isBlock={false}
              /> */}
              <TransactionItemWithCells
                scrollIntoViewOnMount={transaction.isCellbase && hash === `#${CELL_BASE_ANCHOR}`}
                transaction={transaction}
              />
            </>
          ),
      )}
      {!transactions.length && (
        <Empty />
      )}
      <Pagination
        paginationType="page"
        className='w-full mt-1'
        total={total}
        pageSize={pageSize}
        currentPage={currentPage}
        // totalPages={totalPages}
        onChange={onPageChange}
      />
    </div>
  )
}

"use client"
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import TransactionInfo from './components/TransactionInfo'
import TransactionCells from './components/TransactionCells'
import server from '@/server'
import { QueryResult } from '@/components/QueryResult'
import HashCardHeader from '@/components/Card/HashCardHeader'
import ToTopButton from '@/components/ToTopButton'

export default function TransactionDetail({ txHash }: { txHash: string }) {
  const { t } = useTranslation();
  const query = useQuery({
    queryKey: ['transaction', txHash],
    queryFn: async () => {
      const transaction = await server.explorer("GET /ckb_transactions/{txHash}", { txHash })
      if (!transaction) {
        throw new Error(t('toast.transaction_not_found'))
      }
      return transaction
    },
  })



  return (
    <>
      <div className="container pb-10">
        <HashCardHeader hash={txHash} type="transaction" />
        {
          <QueryResult query={query} defaultLoadingClassName='min-h-[400px]'>
            {(transaction) => (
              <>
                <TransactionInfo transaction={transaction} />
                <TransactionCells transaction={transaction} />
              </>
            )}
          </QueryResult>
        }
      </div>
      <ToTopButton />
    </>
  )
}

"use client"
import { useQuery } from '@tanstack/react-query'
import Card from '@/components/Card'
import TransactionIcon from '@/assets/icons/transaction.svg?component'
import { useTranslation } from 'react-i18next'
import CopyButton from '@/components/CopyButton'
import TransactionInfo from './components/TransactionInfo'
import TransactionCells from './components/TransactionCells'
import server from '@/server'
import { QueryResult } from '@/components/QueryResult'
import TextEllipsis from '@/components/TextEllipsis'
import HashCardHeader from '@/components/Card/HashCardHeader'

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
      <div className="container pb-[40px]">
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
    </>
  )
}

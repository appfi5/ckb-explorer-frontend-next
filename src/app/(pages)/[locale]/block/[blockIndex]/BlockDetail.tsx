"use client"
import { useQuery } from '@tanstack/react-query'
import Content from '@/components/Content'
import { usePaginationParamsInPage } from '@/hooks'
import { assert } from '@/utils/error'
import { QueryResult } from '@/components/QueryResult'
import styles from './styles.module.scss'
import { useSearchParams } from 'next/navigation'
import server from '@/server';
import HashCardHeader from "@/components/Card/HashCardHeader"
import BlockOverview from './components/BlockOverviewCard'
import { BlockList } from './components/BlockList'
import { isTxHash } from '@/utils/validator'
import { addPrefixForHash } from '@/utils/string'

export default function BlockDetail({ blockIndex: blockHeightOrHash }: { blockIndex: string }) {
  const search = useSearchParams();
  const { currentPage, pageSize: pageSizeParam, setPage, setPageSize } = usePaginationParamsInPage()
  const filter = new URLSearchParams(search).get('filter')
  const blockQuery = useQuery({
    queryKey: ['block', blockHeightOrHash],
    // queryFn: () => explorerService.api.fetchBlock(blockHeightOrHash),
    queryFn: async () => {
      const res = await server.explorer("GET /blocks/{id}", { id: blockHeightOrHash })
      if (!res) throw new Error("Block not found")
      return res;
    },
  })

  const blockHash = blockQuery.data?.blockHash;
  const queryBlockTransactions = useQuery({
    queryKey: ['block-transactions', blockHash, currentPage, pageSizeParam, filter],
    queryFn: async () => {
      assert(!!blockHash)
      try {
        const haveFilter = !!filter;
        const isFilterAddress = haveFilter && filter?.startsWith("ck");
        const isFilterTransaction = haveFilter && filter?.startsWith("0x");
        if (haveFilter && !isFilterAddress && !isFilterTransaction) {
          return {
            total: 0,
            transactions: []
          }
        }
        // const { transactions, total, pageSize } = await explorerService.api.fetchTransactionsByBlockHash(blockHash, {
        //   page: currentPage,
        //   size: pageSizeParam,
        //   filter,
        // })
        const res: any = await server.explorer("GET /block_transactions/{id}", {
          id: blockHash,
          page: 1,
          pageSize: pageSizeParam,
          addressHash: isFilterAddress ? filter : "",
          txHash: isFilterTransaction ? filter : "",
        })
        return {
          transactions: res?.records ?? [],
          total: res?.total ?? 0,
          pageSize: res?.size ?? pageSizeParam,
        }
      } catch (e) {
        console.error(e)
        return {
          transactions: [],
          total: 0,
        }
      }
    },
    enabled: blockQuery.data?.blockHash != null,
  })

  const pageSize = queryBlockTransactions.data?.pageSize ?? pageSizeParam

  return (
    <Content>
      <div className="container flex flex-col gap-4 sm:gap-5 pb-[20px]">
        <QueryResult query={blockQuery} delayLoading defaultLoadingClassName='min-h-[400px]'>
          {block => (
            <>
              <HashCardHeader hash={blockHash ?? ''} type="block" />
              <BlockOverview block={block} />
              <QueryResult query={queryBlockTransactions} delayLoading>
                {data => (
                  <BlockList
                    onPageChange={setPage}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    total={data?.total ?? 0}
                    transactions={data?.transactions ?? []}
                    blockId={blockHeightOrHash}
                    setPageSize={setPageSize}
                  />
                )}
              </QueryResult>
            </>
          )}
        </QueryResult>
      </div>
    </Content>
  )
}

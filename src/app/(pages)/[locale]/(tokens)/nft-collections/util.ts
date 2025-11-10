import { includes } from '@/utils/array'
import { useSortParam } from '@/hooks'

const NFTSortByTypes = ['h24_ckb_transactions_count', 'holders_count', 'items_count', 'block_timestamp'] as const
type NFTSortByType = (typeof NFTSortByTypes)[number]

export const useNFTCollectionsSortParam = () =>
  useSortParam<NFTSortByType>(s => includes(NFTSortByTypes, s), 'block_timestamp.desc')

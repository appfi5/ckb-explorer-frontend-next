import server from '@/server'
import { create } from 'zustand'


type BlockChainInfoStore = {
  blockNumber: number
  statistics: APIExplorer.IndexStatisticResponse
  alerts: string[]
  updateStatistics: () => Promise<void>
  // updateBlockNumber: () => Promise<void>
}

export const useBlockChainInfo = create<BlockChainInfoStore>((set, get) => ({
  statistics: {
    type: "",
    tipBlockNumber: 0,
    averageBlockTime: 0,
    currentEpochDifficulty: 0,
    hashRate: 0,
    epochInfo: {
      epochNumber: 0,
      epochLength: 0,
      index: 0,
    },
    estimatedEpochTime: 0,
    transactionsLast24hrs: 0,
    transactionsCountPerMinute: 0,
    // reorgStartedAt: null,
  },
  blockNumber: 0,
  alerts: [],

  updateStatistics: async () => {
    const data = await server.explorer("GET /statistics");
    if (data) {
      set({ statistics: data, blockNumber: data.tipBlockNumber })
    }
  },

  // updateBlockNumber: async () => {
  //   const data = await server.explorer("GET /statistics/{fieldName}", { fieldName: "tip_block_number" });
  //   if (data) {
  //     set({ blockNumber: data.tipBlockNumber })
  //   }
  // },

}))


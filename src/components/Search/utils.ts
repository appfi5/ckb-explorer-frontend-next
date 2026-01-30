import server from "@/server";
import { SearchRangeCode } from "./SearchRangeSelect";
import clientDB from "@/database";
import type { UDT } from "@/database/udts/tool";
import { toast } from "sonner";
import i18n from "i18next";
import { addPrefixForHash, containSpecialChar } from "@/utils/string";
import { getReverseAddresses } from "@/services/DidService";
import { ethToCKb } from "@/utils/did";
import { isMainnet } from "@/utils/chain";

export enum SearchResultType {
  Block = "block",
  Transaction = "ckb_transaction",
  Address = "address",
  // LockHash = "lock_hash",
  UDT = "udt",
  NFTCollection = "nft-collection",
  NFTItem = "nft",
  DID = "did",
}

export type SearchResult<T extends SearchResultType, A> = {
  id: number;
  type: T;
  attributes: A;
}

export type AggregateSearchResult =
  | SearchResult<SearchResultType.Block, { number: number, blockHash: string }>
  | SearchResult<SearchResultType.Transaction, { blockNumber: string, transactionHash: string }>
  | SearchResult<SearchResultType.Address, { addressHash: string }>
  | SearchResult<SearchResultType.DID, { did: string, address: string }>
  // | SearchResult<SearchResultType.LockHash, { addressHash: string }>
  | SearchResult<SearchResultType.UDT, UDT>
  | SearchResult<SearchResultType.NFTCollection, {
    collectionId?: string
    collectionName: string
    id: number
    type: SearchResultType.NFTCollection
    typeScriptHash: string
    iconUrl?: string
  }>
  | SearchResult<SearchResultType.NFTItem, {
    collectionId?: string
    collectionName: string
    id: number
    type: SearchResultType.NFTCollection
    typeScriptHash: string
    iconUrl?: string
    tokenId: string
  }>

export const getURLByAggregateSearchResult = (
  result: AggregateSearchResult,
) => {
  const { type, attributes } = result;
  switch (type) {

    case SearchResultType.Block:
      return `/block/${attributes.blockHash}`;

    case SearchResultType.Transaction:
      return `/transaction/${attributes.transactionHash}`;

    case SearchResultType.Address:
      return `/address/${attributes.addressHash}`;
    case SearchResultType.DID:
      return `/address/${attributes.address}`;
    // case SearchResultType.LockHash:
    //   return `/address/${attributes.lockHash}`;
    case SearchResultType.UDT:
      return `/udts/${attributes.typeHash}`;

    case SearchResultType.NFTCollection:
      return `/nft-collections/${attributes.typeScriptHash}`;
    case SearchResultType.NFTItem:
      return `/nft-collections/${attributes.typeScriptHash}/${attributes.tokenId}`;
    default:
      break;
  }
};

export const getDisplayNameByAggregateSearchResult = (
  result: AggregateSearchResult,
) => {
  const { type, attributes } = result;
  if (type === SearchResultType.Block) {
    return attributes.number;
  }
  if (type === SearchResultType.Transaction) {
    return attributes.transactionHash;
  }
  if (type === SearchResultType.Address) {
    return attributes.addressHash;
  }
  // if (type === SearchResultType.LockHash) {
  //   return attributes.lockHash;
  // }
  if (type === SearchResultType.UDT) {
    return attributes.name ?? attributes.symbol;
  }
  // if (type === SearchResultType.TypeScript) {
  //   return attributes.scriptHash;
  // }
  // if (type === SearchResultType.LockScript) {
  //   return attributes.codeHash;
  // }
  // if (type === SearchResultType.BtcTx) {
  //   return attributes.transactionHash;
  // }
  if (type === SearchResultType.NFTCollection) {
    return attributes.collectionName;
  }
  if (type === SearchResultType.NFTItem) {
    return attributes.tokenId;
  }
  if (type === SearchResultType.DID) {
    return attributes.did;
  }
  // if (type === SearchResultType.BtcAddress) {
  //   return attributes.addressHash;
  // }
  // if (type === SearchResultType.FiberGraphNode) {
  //   return attributes.peerId;
  // }
};

export const ALLOW_SEARCH_TYPES = [
  SearchResultType.Address,
  SearchResultType.Block,
  // SearchResultType.BtcTx,
  // SearchResultType.LockHash,
  // SearchResultType.LockScript,
  SearchResultType.Transaction,
  // SearchResultType.TypeScript,
  // SearchResultType.TokenItem,
  SearchResultType.UDT,
  SearchResultType.NFTCollection,
  SearchResultType.NFTItem,
  SearchResultType.DID,
  // SearchResultType.BtcAddress,
];

const isHash = (val: string) => /^(0x)?[0-9A-Fa-f]{64}$/.test(val);

async function coreSearch(searchValue: string, filterBy: number | SearchRangeCode) {
  const res = await server.explorer("GET /suggest_queries", {
    q: searchValue,
    filterBy: +filterBy,
  }) as Array<Record<string, any>> | null;
  if (!res) return [];
  const resList = Array.isArray(res) ? res : [res];
  // console.log("GET /suggest_queries", res, results_old);
  const results = resList.map(item => {
    return {
      type: item.type,
      id: item.id,
      attributes: item,
    };
  });
  return results as AggregateSearchResult[];
}
export async function fetchAggregateSearchResult(
  searchValue: string,
  filterBy = SearchRangeCode.Base,
): Promise<AggregateSearchResult[]> {
  const fixedSearchVal = addPrefixForHash(searchValue);
  if (filterBy === SearchRangeCode.UDT) {
    let list = [];
    if (isHash(fixedSearchVal)) {
      const udtRes = await clientDB.udt.get(fixedSearchVal);
      if (udtRes) {
        list.push(udtRes)
      }
    } else {
      list = await clientDB.udt.filterByNameOrSymbol(fixedSearchVal);
    }

    return list.map(item => {
      return {
        type: SearchResultType.UDT,
        id: Math.random(),
        attributes: item,
      };
    });
  }

  // let results_old = await explorerService.api
  //   .fetchAggregateSearchResult(addPrefixForHash(searchValue))
  //   .then((res) => res.data)
  //   .catch(() => [] as AggregateSearchResult[]);
  const results = await coreSearch(fixedSearchVal, filterBy);

  if ((filterBy === SearchRangeCode.Base) && isHash(fixedSearchVal) && !results.length) {
    const blockHashQueryResult = await coreSearch(fixedSearchVal, SearchRangeCode.BlockHash);
    if (blockHashQueryResult.length) {
      results.push(...blockHashQueryResult);
    } else {
      const addressLockHashQueryResult = await coreSearch(fixedSearchVal, SearchRangeCode.AddressLockHash);
      if (addressLockHashQueryResult.length) {
        results.push(...addressLockHashQueryResult);
      }
    }
  }

  if ((filterBy === SearchRangeCode.NFT_Collections_Name) && isHash(fixedSearchVal) && !results.length) {
    const batchQuery = await Promise.all([
      coreSearch(fixedSearchVal, SearchRangeCode.NFT_Collections_ClusterTypeHash),
      coreSearch(fixedSearchVal, SearchRangeCode.NFT_Collections_ClusterId),
      coreSearch(fixedSearchVal, SearchRangeCode.NFT_Collections_TokenId),
    ]);
    const collectionsHashQueryResults = batchQuery.flat();
    if (collectionsHashQueryResults.length) {
      results.push(...collectionsHashQueryResults);
    }
    // if(nftSNQueryResult.length) {
    //   results.push(...nftSNQueryResult);
    // }
  }

  if (isMainnet() && filterBy === SearchRangeCode.Base && /\w*\.bit$/.test(searchValue)) {
    // search .bit name
    const list = await getReverseAddresses(searchValue);
    const ETH_COIN_TYPE = "60";
    const ethAddr = list?.find(
      (item) => item.key_info.coin_type === ETH_COIN_TYPE,
    );
    if (ethAddr) {
      const ckbAddr = ethToCKb(ethAddr.key_info.key);
      results.push({
        id: Math.random(),
        type: SearchResultType.DID,
        attributes: {
          did: searchValue,
          address: ckbAddr,
        },
      })
      // results = [
      //   ...results,

      // ];
    }
  }

  return results;
}

export const getURLBySearchValue = async (searchValue: string) => {
  // check whether is btc address
  // if (isValidBTCAddress(searchValue)) {
  //   return `/address/${searchValue}`;
  // }
  // if (/\w*\.bit$/.test(searchValue)) {
  //   // search .bit name
  //   const list = await getReverseAddresses(searchValue);
  //   const ETH_COIN_TYPE = "60";
  //   const ethAddr = list?.find(
  //     (item) => item.key_info.coin_type === ETH_COIN_TYPE,
  //   );
  //   if (ethAddr) {
  //     const ckbAddr = DidEthToCkb(ethAddr.key_info.key);
  //     return `/address/${ckbAddr}`;
  //   }
  // }
  // TODO: Is this replace needed?
  const query = addPrefixForHash(searchValue).replace(",", "");
  if (!query || containSpecialChar(query)) {
    toast.error(i18n.t("search.no_search_result"));
    return;
    // return `/search/fail?q=${query}`;
  }
  // if (isChainTypeError(query)) {

  //   toast.error(i18n.t("common.qrcode"));
  //   debugger;
  //   // return `/search/fail?type=${SearchFailType.CHAIN_ERROR}&q=${query}`;
  //   return;
  // }

  try {
    const data = await fetchAggregateSearchResult(addPrefixForHash(query));
    return getURLByAggregateSearchResult(data[0]);
  } catch (error) {
    toast.error(i18n.t("search.no_search_result"));
    return;
    // return `/search/fail?q=${query}`;
  }
};

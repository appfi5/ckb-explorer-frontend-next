

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { isMainnet } from "@/utils/chain";
import type { SelectPortalProps } from "@radix-ui/react-select";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";


export enum SearchRangeCode {
  Base = '0',
  BlockHash = '1',
  AddressLockHash = '2',
  TypeHash = '3',
  TypeIdArgs = '4',
  LockCodeHash = '5',
  TypeCodeHash = '6',
  BTC_TxId = '7',
  BTC_AddressHash = '8',
  UDT = '9',
  NFT_Collections_TokenId = '10',
  NFT_Collections_Name = '11',
  NFT_Collections_ClusterId = '12',
  NFT_Collections_ClusterTypeHash = '13',
}

/**
 * 0-未指定；
 * 1-块哈希；
 * 2-地址LockHash；
 * 3-TypeHash；
 * 4-typeId的args；
 * 5-lock的codeHash；
 * 6-type的codeHash; 
 * 7-比特币交易的txid；
 * 8-比特币地址哈希；
 * 9-Udt的name_or_symbol；
 * 10-nft_collections的sn；
 * 11-nft_collections的name；
 * 12-fiber_graph_nodes
 * */
export const useSearchOptions = () => {
  const { t } = useTranslation("search")
  return [
    { value: SearchRangeCode.Base, name: t("option.base"), placeholder: isMainnet() ? t("placeholder.base") : t("placeholder.base_testnet") },
    // { value: SearchRangeCode.BlockHash, name: "Block Hash" },
    // { value: SearchRangeCode.AddressLockHash, name: "Address Lock Hash" },
    // { value: SearchRangeCode.TypeHash, name: "Type Hash" },
    // { value: SearchRangeCode.TypeIdArgs, name: "Type Id Args" },
    // { value: SearchRangeCode.LockCodeHash, name: "Lock Code Hash" },
    // { value: SearchRangeCode.TypeCodeHash, name: "Type Code Hash" },
    // { value: SearchRangeCode.BTC_TxId, name: "BTC TxId" },
    // { value: SearchRangeCode.BTC_AddressHash, name: "BTC Address Hash" },
    { value: SearchRangeCode.UDT, name: t("option.udt"), placeholder: t("placeholder.udt") },
    // { value: SearchRangeCode.NFT_Collections_Sn, name: "NFT Collections Sn" },
    { value: SearchRangeCode.NFT_Collections_Name, name: t("option.nft"), placeholder: t("placeholder.nft") },
    // { value: "12", name: "Fiber Graph Nodes" },
  ]
}

type SearchRangeSelectProps = {
  triggerClassName?: string;
  onChange?: (value: string, placeholder: string) => void;
  popContainer?: SelectPortalProps['container']
}

export default function SearchRangeSelect(props: SearchRangeSelectProps) {
  const { onChange, popContainer, triggerClassName } = props
  const { t } = useTranslation("search")
  const searchOptions = useSearchOptions();
  const optionMap = searchOptions.reduce((acc, cur) => {
    acc[cur.value] = cur;
    return acc;
  }, {} as Record<string, any>)
  const [value, setValue] = useState(searchOptions[0]!.value);

  useEffect(() => {
    onChange?.(value, optionMap[value].placeholder || t("placeholder.input"))
  }, [value])

  return (
    <Select
      value={value}
      onValueChange={(value) => setValue(value)}
    >
      <SelectTrigger className={classNames("font-medium border-0 px-3 py-0! shadow-none!", triggerClassName)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent container={popContainer}>
        {
          searchOptions.map(tab => (
            <SelectItem key={tab.value} value={tab.value}>{tab.name}</SelectItem>
          ))
        }
      </SelectContent>
    </Select>
  )
}
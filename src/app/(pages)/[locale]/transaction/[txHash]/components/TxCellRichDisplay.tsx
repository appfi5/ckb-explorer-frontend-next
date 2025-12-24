import parseData, { parseType } from "@/components/Cell/dataDecoder"
import TwoSizeAmount from "@/components/TwoSizeAmount";
import { shannonToCkb } from "@/utils/util";
import CellCKBWithDataIcon from "@/assets/icons/cell_type.ckb.with-data.svg?component"
import CellUnknownIcon from "@/assets/icons/cell_type.unknown.svg?component"

import { useTranslation } from "react-i18next";
import Tips from "@/components/Tips";
import type { daoDataParseUnit } from "@/components/Cell/dataDecoder/dpu.dao";
import type { DataParseUnit } from "@/components/Cell/dataDecoder/tool";
import ScriptTag from "@/components/ScriptTag";
import type { udtDataParseUnit } from "@/components/Cell/dataDecoder/dpu.udt";
import { useQuery } from "@tanstack/react-query";
import clientDB from "@/database";
import { ccc, HasherCkb } from "@ckb-ccc/core";
import BigNumber from "bignumber.js";
import { isTypeIdScript, TYPE_ID_TAG } from "@/utils/typeid";
import { useState } from "react";
import TextEllipsis from "@/components/TextEllipsis";
import PixelArrowUpIcon from "@/assets/icons/pixel-arrow-up.svg?component"
import server from "@/server";
import IconBox from "@/components/IconBox";
import classNames from "classnames";
import CopyButton from "@/components/CopyButton";
import type { sporeDataParseUnit } from "@/components/Cell/dataDecoder/dpu.spore";
import { withNetwork } from "@/utils/withNetwork";
import Link from "next/link";
import AssetContainer from "@/components/AssetContainer";
import useDOBRender from "@/hooks/useDOBRender";
import { SearchRangeCode } from "@/components/Search/SearchRangeSelect";
import type { sporeClusterDataParseUnit } from "@/components/Cell/dataDecoder/dpu.sporeCluster";

type ParsedData<T> = T extends DataParseUnit ? ReturnType<T["parse"]> : never


type TxCellRichDisplayProps = {
  cell: APIExplorer.CellInputResponse | APIExplorer.CellOutputResponse
  // txHash: string
  // seq: number
  // since?: string
}

type CommonCellProps = {
  cell: APIExplorer.CellInputResponse | APIExplorer.CellOutputResponse
  ckbValue: string
}

export default function TxCellRichDisplay(props: TxCellRichDisplayProps) {
  const { cell } = props
  const decodeType = parseType({ typeScript: cell.typeScript });
  const ckbVal = shannonToCkb(cell.capacity);

  if (!cell.typeScript)
    return <TxCellCKB value={ckbVal} withData={!!cell.data && cell.data !== '0x'} />
  if (isTypeIdScript(cell.typeScript))
    return <TxCellTypeID cell={cell} />;
  switch (decodeType) {
    case "udt":
      return <TxCellUDT cell={cell} />
    case "spore":
      return <TxCellSpore cell={cell} />
    case "spore-cluster":
      return <TxCellSporeCluster cell={cell} />
    case "dao":
      return <TxCellDAO cell={cell} ckbValue={ckbVal} />
    default:
      return <TxCellUnknownType ckbValue={ckbVal} />
  }
}

function TxCellCKB({ value, withData }: { value: string, withData?: boolean }) {
  const { t } = useTranslation("cell")
  return (
    <div className="flex flex-row items-center justify-between">
      {withData && (
        <Tips
          trigger={<div className="size-7.5 rounded-full"><CellCKBWithDataIcon /></div>}
        >
          {t("message.ckb_cell_with_data")}
        </Tips>
      )}
      <TwoSizeAmount
        // format={[8]}
        amount={value}
        unit={<span className="ml-1">CKB</span>}
      />
    </div>
  )
}

const UNIQUE_ITEM_CLUSTER_NAME = "Unique items";
const UNIQUE_ITEM_CLUSTER_TYPEHASH = withNetwork({
  testnet: "0x2981ed0498836ae970473f56ebf61d8e0eaf2dbe97286d160658d7c2787ce69b",
  mainnet: "0xcf9e0cdbd169550492b29d3d1181d27048ab80126b797840965d2864607a892d",
}, "")
function TxCellSpore({ cell }: Pick<TxCellRichDisplayProps, "cell">) {
  const [expanded, setExpanded] = useState(false)
  const tokenId = cell.typeScript.args;
  const { data: cellData } = useQuery({
    queryKey: ["cell_data_hash", cell.id],
    queryFn: async () => {
      let cellData: string | undefined = cell.data;
      if (cellData && cellData === "0x") {
        const cellDataRes = await server.explorer("GET /cell_output_data/{id}", { id: cell.id });
        cellData = cellDataRes?.data;
      }
      return cellData;
    },
    enabled: !!cell.id,
  })
  const { data: decodeData } = useQuery({
    queryKey: ["cell_data_decode_content", cell.id],
    queryFn: async () => {
      const decodedContent = parseData({ typeScript: cell.typeScript }, cellData!);
      return decodedContent?.content as ParsedData<typeof sporeDataParseUnit>;
    },
    enabled: !!cell.id && ((cellData?.length ?? 0) > 2),
  })
  const clusterId = decodeData?.clusterId;
  const { data: { clusterName, clusterTypeHash } = {} } = useQuery({
    queryKey: ['nft-collection_name', clusterId || UNIQUE_ITEM_CLUSTER_TYPEHASH],
    queryFn: async () => {
      if (!clusterId) {
        return { clusterName: UNIQUE_ITEM_CLUSTER_NAME, clusterTypeHash: UNIQUE_ITEM_CLUSTER_TYPEHASH };
      }
      const queryRes = await server.explorer("GET /suggest_queries", { q: clusterId, filterBy: +SearchRangeCode.NFT_Collections_ClusterId })
      // const nft = await server.explorer("GET /nfts/{tokenId}", { tokenId })
      if (!queryRes?.[0]) {
        throw new Error('NFT Collection not found')
      }
      return { clusterName: queryRes[0].collectionName, clusterTypeHash: queryRes[0].typeScriptHash };
    },
    enabled: !!decodeData,
  })

  return (
    <div className="relative flex flex-col gap-2.5">
      <IconBox
        data-clickable
        onClick={(e) => {
          e.stopPropagation()
          setExpanded(!expanded)
        }}
        className={classNames("absolute right-0 top-0", {
          "rotate-0": expanded,
          "rotate-180": !expanded,
        })}
      >
        <PixelArrowUpIcon />
      </IconBox>
      <div>
        {
          expanded
            ? (<span className="text-[#999999]">Detail</span>)
            : (
              <div className="flex flex-row gap-2.5 items-center">
                {
                  clusterTypeHash ? (
                    <Link
                      data-clickable
                      className="underline"
                      onClick={e => e.stopPropagation()}
                      href={`/nft-collections/${clusterTypeHash}`}>
                      <span>{clusterName || ""}</span>
                    </Link>
                  )
                    : (<span></span>)
                }
                <ScriptTag category="type" script={cell.typeScript} />
              </div>
            )
        }
      </div>
      {
        expanded
          ? (
            <div className="flex flex-row gap-6 mt-4">
              <DOBCover cellData={cellData} tokenId={tokenId} />
              <div className="flex flex-col gap-4">
                <ScriptTag category="type" script={cell.typeScript} />
                <div>
                  {
                    clusterTypeHash ? (
                      <Link
                        data-clickable
                        className="underline hover:text-primary"
                        onClick={e => e.stopPropagation()}
                        href={`/nft-collections/${clusterTypeHash}`}>
                        <span>{clusterName || ""}</span>
                      </Link>
                    )
                      : (<span></span>)
                  }
                </div>
                <div className="flex flex-row items-center gap-1">
                  <div>ID:</div>
                  <div data-clickable className="flex flex-row items-center gap-1.5" onClick={e => e.stopPropagation()}>
                    <TextEllipsis text={tokenId} ellipsis={{ head: 8, tail: -8 }} />
                    <CopyButton size="size-4" text={tokenId} />
                  </div>
                </div>
              </div>

            </div>
          )
          : null
      }
    </div>
  )
}

function TxCellSporeCluster({ cell }: Pick<TxCellRichDisplayProps, "cell">) {
  const [expanded, setExpanded] = useState(false)
  const clusterId = cell.typeScript.args;
  const cellData = cell.data;
  // const { data: cellData } = useQuery({
  //   queryKey: ["cell_data_hash", cell.id],
  //   queryFn: async () => {
  //     let cellData: string | undefined = cell.data;
  //     if (cellData && cellData === "0x") {
  //       const cellDataRes = await server.explorer("GET /cell_output_data/{id}", { id: cell.id });
  //       cellData = cellDataRes?.data;
  //     }
  //     return cellData;
  //   },
  //   enabled: !!cell.id,
  // })
  const { data: decodeData } = useQuery({
    queryKey: ["cell_data_decode_content", cell.id],
    queryFn: async () => {
      const decodedContent = parseData({ typeScript: cell.typeScript }, cellData!);
      return decodedContent?.content as ParsedData<typeof sporeClusterDataParseUnit>;
    },
    enabled: !!cell.id && ((cellData?.length ?? 0) > 2),
  })
  const clusterTypeHash = ccc.Script.from(cell.typeScript).hash();
  const clusterName = decodeData?.name ?? "";

  return (
    <div className="relative flex flex-col gap-2.5">
      <IconBox
        data-clickable
        onClick={(e) => {
          e.stopPropagation()
          setExpanded(!expanded)
        }}
        className={classNames("absolute right-0 top-0", {
          "rotate-0": expanded,
          "rotate-180": !expanded,
        })}
      >
        <PixelArrowUpIcon />
      </IconBox>
      <div>
        {
          expanded
            ? (<span className="text-[#999999]">Detail</span>)
            : (
              <div className="flex flex-row gap-2.5 items-center">
                {
                  clusterTypeHash ? (
                    <Link
                      data-clickable
                      className="underline"
                      onClick={e => e.stopPropagation()}
                      href={`/nft-collections/${clusterTypeHash}`}>
                      <span>{clusterName || ""}</span>
                    </Link>
                  )
                    : (<span></span>)
                }
                <ScriptTag category="type" script={cell.typeScript} />
              </div>
            )
        }
      </div>
      {
        expanded
          ? (
            <div className="flex flex-row gap-6 mt-4">
              <AssetContainer className="size-25 rounded-lg">
                <img
                  className="w-full h-full object-scale-down"
                  src="/images/spore_placeholder.svg"
                />
              </AssetContainer>
              <div className="flex flex-col gap-4">
                <ScriptTag category="type" script={cell.typeScript} />
                <div>
                  {
                    clusterTypeHash ? (
                      <Link
                        data-clickable
                        className="underline hover:text-primary"
                        onClick={e => e.stopPropagation()}
                        href={`/nft-collections/${clusterTypeHash}`}>
                        <span>{clusterName || ""}</span>
                      </Link>
                    )
                      : (<span></span>)
                  }
                </div>
                <div className="flex flex-row items-center gap-1">
                  <div>Cluster ID:</div>
                  <div data-clickable className="flex flex-row items-center gap-1.5" onClick={e => e.stopPropagation()}>
                    <TextEllipsis text={clusterId} ellipsis={{ head: 8, tail: -8 }} />
                    <CopyButton size="size-4" text={clusterId} />
                  </div>
                </div>
              </div>

            </div>
          )
          : null
      }
    </div>
  )
}

function DOBCover({ cellData, tokenId }: { cellData?: string, tokenId: string }) {
  const { data: nftCoverImg, isLoading } = useDOBRender({ type: "dob", data: cellData, id: tokenId })
  return (
    <AssetContainer className="size-25 rounded-lg">
      {
        !isLoading && (
          <img
            className="h-full w-full object-scale-down"
            src={nftCoverImg}
            alt="cover"
            loading="lazy"
          />
        )
      }
    </AssetContainer>
  )
}

function TxCellTypeID({ cell }: Pick<TxCellRichDisplayProps, "cell">) {
  const [expanded, setExpanded] = useState(false)
  const typeHash = ccc.Script.from(cell.typeScript).hash();
  const { data: dataHash } = useQuery({
    queryKey: ["cell_data_hash", cell.id],
    queryFn: async () => {
      const wholeCellData = await server.explorer("GET /cell_output_data/{id}", { id: cell.id });
      if (wholeCellData) {
        const hasher = new HasherCkb();
        hasher.update(wholeCellData.data)
        const hash = hasher.digest();
        return hash;
      }
      return undefined
    },
    enabled: !!cell.id && expanded,
  })
  return (
    <div className="relative flex flex-col gap-2.5">
      <IconBox
        data-clickable
        onClick={(e) => {
          e.stopPropagation()
          setExpanded(!expanded)
        }}
        className={classNames("absolute right-0 top-0", {
          "rotate-0": expanded,
          "rotate-180": !expanded,
        })}
      >
        <PixelArrowUpIcon />
      </IconBox>
      <div>
        {
          expanded
            ? (<span className="text-[#999999]">Detail</span>)
            : (
              <div className="flex flex-row gap-2.5 items-center">
                <span>typeHash; dataHash</span>
                <ScriptTag category="type" script={cell.typeScript} />
              </div>
            )
        }
      </div>
      {
        expanded
          ? (
            <>
              <ScriptTag category="type" script={cell.typeScript} />
              <div className="flex flex-row items-center justify-between">
                <div>typeHash</div>
                <div data-clickable className="flex flex-row items-center gap-1.5" onClick={e => e.stopPropagation()}>
                  <TextEllipsis text={typeHash} ellipsis={{ head: 8, tail: -8 }} />
                  <CopyButton size="size-4" text={typeHash} />
                </div>
              </div>
              {
                !!dataHash && (
                  <div className="flex flex-row items-center justify-between">
                    <div>dataHash</div>
                    <div data-clickable className="flex flex-row items-center gap-1.5" onClick={e => e.stopPropagation()}>
                      <TextEllipsis text={dataHash} ellipsis={{ head: 8, tail: -8 }} />
                      <CopyButton size="size-4" text={dataHash} />
                    </div>
                  </div>
                )
              }

            </>
          )
          : null
      }
    </div>
  )
}

function TxCellUDT({ cell }: Pick<TxCellRichDisplayProps, "cell">) {
  const typeScript = cell.typeScript;
  const decodeContent = parseData({ typeScript }, cell.data);
  const decodedData = decodeContent?.content as ParsedData<typeof udtDataParseUnit>;
  const typeHash = ccc.Script.from(typeScript).hash();
  const { data: udtInfo, isLoading } = useQuery({
    queryKey: ["udt_info", typeScript],
    queryFn: async () => {
      const udt = await clientDB.udt.get(typeScript)
      return udt
    }
  })
  if (isLoading) return null
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-2.5">
        {udtInfo?.name ? (
          <>
            <img
              src={udtInfo.icon}
              alt={udtInfo.name}
              className="size-7.5 rounded-full"
            />
            {udtInfo.name}
          </>
        ) : (
          <div>Unknown UDT (#<span className="font-hash">{typeHash.slice(-4)}</span>)</div>
        )}
      </div>
      <TwoSizeAmount
        // format={[udtInfo?.decimalPlaces || 0]}
        amount={new BigNumber(decodedData.amount).dividedBy(10 ** (udtInfo?.decimalPlaces ?? 0).toString())}
      />
    </div>

  )
}

function TxCellDAO({ cell, ckbValue }: CommonCellProps) {
  const decodeContent = parseData({ typeScript: cell.typeScript }, cell.data);
  const decodedData = decodeContent?.content as ParsedData<typeof daoDataParseUnit>;
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-2.5">
        {!!decodedData.blockNumber ? "DAO Withdraw" : "DAO Deposit"}
        <ScriptTag category="type" script={cell.typeScript} />
      </div>
      <TwoSizeAmount
        // format={[8]}
        amount={ckbValue}
        unit={<span className="ml-1">CKB</span>}
      />
    </div>
  )
}

function TxCellUnknownType({ ckbValue }: { ckbValue: string }) {
  const { t } = useTranslation("cell")
  return (
    <div className="flex flex-row items-center justify-between">
      <Tips
        trigger={<div className="size-7.5 rounded-full"><CellUnknownIcon /></div>}
      >
        {t("message.cell_unknown")}
      </Tips>
      <TwoSizeAmount
        // format={[8]}
        amount={ckbValue}
        unit={<span className="ml-1">CKB</span>}
      />
    </div>
  )
}
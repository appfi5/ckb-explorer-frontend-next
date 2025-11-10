import server from "@/server"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import styles from './index.module.scss'
import Image from "next/image"
import Link from "next/link"
import { localeNumberString } from "@/utils/number"
import classNames from "classnames"
import CellType_Script from "@/assets/icons/cell_type.script.svg?component"
import CellType_CKB from "@/assets/icons/nervos.white.png"
import OutlinkIcon from "@/assets/icons/outlink.svg?component"
import type { Cell } from "@/models/Cell"
import { useTranslation } from "react-i18next"
import CellModal from "@/components/Cell/CellModal"
import TextEllipsis from "@/components/TextEllipsis"
import TwoSizeAmount from "@/components/TwoSizeAmount"
import { shannonToCkb } from "@/utils/util"
import dayjs from "dayjs"
import LoadMore from "@/components/LoadMore"
import Loading from "@/components/Loading"
import SortIcon from "@/components/icons/sort"
import { useMemo, useState } from "react"
import Tooltip from "@/components/Tooltip"
import SortTimeIcon from "@/components/icons/sort-by-time"
import Empty from "@/components/Empty"
import { CellType } from "@/components/Cell/utils"
import clientDB from "@/database"
import parseData from "@/components/Cell/dataDecoder"
import BigNumber from "bignumber.js"
import DateTime from "@/components/DateTime"

const PAGE_SIZE = 20;

export type LiveCellsProps = {
  address: string;
  listContainerClassName?: string;
  cellRange: "CKB" | "Other" | { name: string, typeHash: string }
}
export default function LiveCells(props: LiveCellsProps) {
  const { address, listContainerClassName, cellRange } = props;
  const { t } = useTranslation();
  // const [sort, setSort] = useState<"block_timestamp.asc" | "block_timestamp.desc" | "capacity.desc" | "capacity.asc">("block_timestamp.desc");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["address live cells", address, cellRange?.typeHash || cellRange],
    // queryFn: async ({ pageParam }) => {
    //   const page = pageParam;
    //   const boundStatus = address.startsWith('ckb') || address.startsWith('ckt') ? undefined : 'bound'
    //   const res = await explorerService.api.fetchAddressLiveCells({ address, page, size: PAGE_SIZE, sort, boundStatus, tag: "" })
    //   return {
    //     data: res.data,
    //     nextPage: page + 1,
    //     total: res.total,
    //   }
    // },
    queryFn: async ({ pageParam }) => {
      const typeHash = cellRange === "Other"
        ? "others"
        : cellRange === "CKB"
          ? "ckb"
          : (cellRange as { typeHash: string })?.typeHash
      // const boundStatus = address.startsWith('ckb') || address.startsWith('ckt') ? false : true;
      const res = await server.explorer("GET /address_live_cells/{address}", {
        address,
        page: pageParam,
        pageSize: PAGE_SIZE,
        typeHash: typeHash
      });
      const list = res?.records || [];
      const total = res?.total || 0;
      return {
        data: list,
        total: total,
      }
    },
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPageParam * PAGE_SIZE >= lastPage.total) return null
      return lastPageParam + 1
    },
    initialPageParam: 1,
  })

  const cells = data?.pages.map(page => page.data).flat() ?? []
  const total = data?.pages[0]?.total ?? 0

  return (
    <>
      <div className="flex flex-row justify-between">
        <span className="font-medium">{t("address.count_utxo")}: {!!data ? total : ""}</span>
      </div>
      <div className="@container">
        <div className={classNames("grid grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-3 @6xl:grid-cols-4 gap-[20px] max-h-[380px] overflow-y-auto rounded-[4px]", listContainerClassName)}>
          {
            cells.map(cell => (
              <CellCard key={cell.id} cell={cell} />
            ))
          }
          {
            !cells.length && isLoading && (
              <div className="flex items-center justify-center col-span-full min-h-[40px]">
                <Loading />
              </div>
            )
          }
          {
            !cells.length && !isLoading && (
              <div className="col-span-full">
                <Empty />
              </div>
            )
          }
          {
            hasNextPage ? (
              <div className="col-span-full">
                <LoadMore
                  onLoadMore={fetchNextPage}
                />
              </div>
            ) : null
          }
        </div>
      </div>
    </>
  )
}


const defaultCellIcon = {
  "script": CellType_Script,
}

function CellCard({ cell }: { cell: APIExplorer.LiveCellsResponse }) {
  const { t } = useTranslation();
  const { data: udtInfo } = useQuery({
    queryKey: ["udt", cell.typeHash],
    enabled: cell.cellType === CellType.UDT
      || cell.cellType === CellType.XUDT
      || cell.cellType === CellType.XUDT_COMPATIBLE,
    queryFn: async () => {
      const udt = await clientDB.udt.get(cell.typeHash)
      return udt
    }
  })

  const fields = useMemo(() => {
    const tempList = [
      {
        label: t('cell.out_point'),
        content: (
          <Link href={`/transaction/${cell.txHash}`} className="underline hover:text-primary">
            <TextEllipsis
              text={`${cell.txHash}:${cell.cellIndex}`}
              ellipsis={{ head: 9, tail: -10 }}
            />
          </Link>
        )
      },
      {
        label: t('cell.time'),
        content: (
          <DateTime date={+cell.blockTimestamp} showRelative />
        )
      }
    ]
    switch (cell.cellType) {
      case CellType.NORMAL:
        tempList.unshift({
          label: t('address.amount'),
          content: (
            <TwoSizeAmount
              integerClassName="font-menlo"
              decimalClassName="font-menlo text-xs"
              amount={shannonToCkb(cell.capacity)}
              unit={<span className="font-medium ml-1">CKB</span>}
            />
          )
        });
        break;
      case CellType.UDT:
      case CellType.XUDT:
      case CellType.XUDT_COMPATIBLE:
        const udtData = parseData({ cellType: cell.cellType }, cell.data)?.content;
        tempList.unshift({
          label: t('address.amount'),
          content: (
            <TwoSizeAmount
              integerClassName="font-menlo"
              decimalClassName="font-menlo text-xs"
              amount={new BigNumber(udtData?.amount ?? 0).dividedBy(10 ** (udtInfo?.decimalPlaces ?? 0)).toString()}
              unit={<span className="font-medium ml-1">{udtInfo?.symbol}</span>}
            />
          )
        });
        break;
      default:
        tempList.splice(1, 0, {
          label: t('cell.capacity'),
          content: (
            <TwoSizeAmount
              integerClassName="font-menlo"
              decimalClassName="font-menlo text-xs"
              amount={shannonToCkb(cell.capacity)}
              unit={<span className="font-medium ml-1">CKB</span>}
            />
          )
        });
    }
    return tempList;
  }, [cell])

  return (
    <CellModal cell={cell}>
      <div className={classNames(styles.cellCard, "rounded-md cursor-pointer")}>
        <div className="flex items-center justify-between bg-[#232323] dark:bg-primary rounded-t-sm">
          <div className="flex gap-[8px] items-center p-2 leading-[22px]">
            {/* <div className="size-[24px] p-0.5 rounded-full overflow-hidden"> */}
            <Image className="size-[24px] rounded-full" src={CellType_CKB} alt="" />
            {/* <CellType_Script width="100%" height="100%" stroke="var(--color-primary)" /> */}
            {/* </div> */}
            <span className="font-medium text-[#EDF2F2]">{t("cell.in_block")}:</span>
            <Link
              className={classNames(styles.blockNumber, "flex gap-[4px] items-center justify-center hover:text-primary text-[#EDF2F2] font-medium")}
              href={`/block/${cell.blockNumber}`}
              onClick={(e) => { e.stopPropagation() }}
            >
              {localeNumberString(cell.blockNumber)}
              <OutlinkIcon className={classNames(styles.icon, "flex items-center justify-center border-[#ddd] border-[1px] rounded-[4px] bg-[rgba(255,255,255,0.1))]")} width={20} height={20} />
            </Link>

          </div>
          <span></span>
        </div>
        <div className="flex flex-col gap-2 bg-[#fbfbfb] dark:bg-[#363839] border border-[#eee] dark:border-[#4C4C4C] rounded-b-sm px-2 pt-3 pb-4">
          {
            fields.map(field => (
              <div key={field.label} className="flex flex-row items-center justify-between">
                <div className="text-[#909399]">{field.label}</div>
                {field.content}
              </div>
            ))
          }
        </div>
      </div>
    </CellModal>
  )
}
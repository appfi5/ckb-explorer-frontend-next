import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table"
import { useTranslation } from "react-i18next";
import { flexRender, getCoreRowModel, useReactTable, type Column, type ColumnDef } from "@tanstack/react-table";
import { useState, type CSSProperties } from "react";
import Link from "next/link";
import TextEllipsis from "@/components/TextEllipsis";
import dayjs from "dayjs";
import Card from "@/components/Card";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Pagination from "@/components/Pagination";
import { sleep } from "@ckb-ccc/core";
import Loading from "@/components/Loading";
import Empty from "@/components/Empty";
import server from "@/server";


type DataType = any;
const getCommonPinningStyles = (column: Column<DataType>): CSSProperties => {
  const isPinned = column.getIsPinned()
  const canPin = column.getCanPin()
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right')

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-4px 0 4px -4px gray inset'
      : isFirstRightPinnedColumn
        ? '4px 0 4px -4px gray inset'
        : undefined,
    left: canPin ? `${column.getStart('left')}px` : undefined,
    // right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: 1, // isPinned ? 0.95 : 1,
    position: canPin ? 'sticky' : 'relative',
    width: column.getSize(),
    zIndex: canPin ? 1 : 0,
  }
}


function HisTable({ loading, list }: { loading: boolean, list: DataType[] }) {
  const { t } = useTranslation("tokens");
  const columns: ColumnDef<DataType>[] = [
    {
      header: t("transaction.tx"),
      accessorKey: 'transactionHash',
      cell: ({ row }) => {
        const txHash = row.original.txHash;
        return (
          <Link
            href={`/transaction/${txHash}`}
          >
            <TextEllipsis
              text={txHash}
              className="inline underline hover:text-primary"
              ellipsis="transaction"
            />
          </Link>
        )
      },
    },
    {
      header: t('transaction.action'),
      accessorKey: 'action',
      enablePinning: false,
    },
    {
      header: t('transaction.age'),
      accessorKey: 'blockTimestamp',
      enablePinning: false,
      cell: ({ row }) => (
        <div className="font-menlo">{
          dayjs(+row.original.blockTimestamp).format("YYYY/MM/DD HH:mm:ssZZ")
        }</div>
      ),
    },
    {
      header: t("transaction.from"),
      accessorKey: 'from',
      enablePinning: false,
      cell: ({ row }) => {
        const fromAddr = row.original.from
        return (
          <Link
            href={`/address/${fromAddr}`}
          >
            <TextEllipsis
              text={fromAddr}
              className="inline underline hover:text-primary"
              ellipsis="address"
            />
          </Link>
        )
      }
    },
    {
      header: t("transaction.to"),
      accessorKey: 'to',
      enablePinning: false,
      cell: ({ row }) => {
        const toAddr = row.original.to
        return (
          <Link
            href={`/address/${toAddr}`}
          >
            <TextEllipsis
              text={toAddr}
              className="inline underline hover:text-primary"
              ellipsis="address"
            />
          </Link>
        )
      }
    },
  ];
  const table = useReactTable<DataType>({
    data: list,
    columns,
    enableRowPinning: true,
    enableColumnPinning: true,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      columnPinning: {
        left: []
      }
    },
  })

  return (
    <Table onScroll={e => {
      table.getAllColumns()[0]?.pin(e.target.scrollLeft > 0 ? "left" : false)
    }}>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="border-none!">
            {headerGroup.headers.map((header) => {
              // console.log("header.column", header.column);
              return (
                <TableHead
                  key={header.id}
                  style={{ ...getCommonPinningStyles(header.column) }}
                  className={header.column.className}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
            // className="hover:bg-transparent"
            // data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} style={{ ...getCommonPinningStyles(cell.column) }} className="bg-card h-[60px]">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-60 text-center">
              {!loading && <Empty />}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default function NFTTransactionsHistory({ collectionId, tokenId }: { collectionId: string, tokenId: string }) {
  const { t } = useTranslation("tokens");
  const [currentPage, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const query = useQuery({
    queryKey: ["nft-transactions", currentPage, pageSize, collectionId, tokenId],
    queryFn: async () => {
      const list = await server.explorer("GET /nft/collections/{typeScriptHash}/transfers", {
        typeScriptHash: collectionId,
        page: currentPage,
        pageSize,
        tokenId,
        txHash: "",
        addressHash: "",
        action: "",
      })
      return {
        data: list?.records ?? [],
        total: list?.total,
        current: currentPage
      }
    },
    placeholderData: keepPreviousData
  })
  const loading = query.isLoading || query.isPlaceholderData;
  const total = query.data?.total ?? 0;
  return (
    <Card className="p-6">
      <div className="text-lg font-medium mb-7">{t("title.activity")}</div>
      <div className="relative">
        {
          loading && (
            <div className="absolute top-0 bottom-0 left-0 right-0 z-2 flex items-center justify-center bg-white/10 dark:bg-[#111]/10">
              <Loading />
            </div>
          )
        }
        <HisTable loading={loading} list={query.data?.data ?? []} />
        <Pagination
          total={total}
          currentPage={currentPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          onChange={setPage}
        />
      </div>
    </Card>
  )
}



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
import { flexRender, getCoreRowModel, useReactTable, type Column, type ColumnDef } from "@tanstack/react-table"
import type { CSSProperties } from "react";
import Empty from "../Empty";


export type CommonTableProps<T> = {
  loading?: boolean;
  columns: ColumnDef<T>[];
  dataSource: T[];
}

export default function TanstackTable<T>(props: CommonTableProps<T>) {
  const { loading, columns, dataSource } = props
  const table = useReactTable<T>({
    data: dataSource,
    columns,
    enableRowPinning: false,
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
      // table.getAllColumns()[0]?.pin(e.target.scrollLeft > 0 ? "left" : false)
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
          <TableRow className="hover:bg-transparent!">
            <TableCell colSpan={columns.length} className="h-60 text-center">
              {!loading && <Empty />}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}


function getCommonPinningStyles<T>(column: Column<T>): CSSProperties {
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
"use client"

import { type ReactElement, type ReactNode, Fragment } from 'react'
import type { LinkProps } from 'next/link'
import { TableTitleRow, TableContentRow, TableTitleRowItem } from '@/components/Table/TableComp'
import { TableContentItem, TableMinerContentItem } from '@/components/Table'
import { type Transaction } from '@/models/Transaction'
import Capacity from '@/components/Capacity'
import { shannonToCkb } from '@/utils/util'
import { localeNumberString } from '@/utils/number'
import { parseSimpleDate, dayjs } from '@/utils/date'
import { useMediaQuery } from "@/hooks";
import DateTime from '@/components/DateTime'

export interface Column<T> {
  title: ReactElement
  key?: string
  width?: string | number
  textDirection?: 'left' | 'right' | 'center'
  textWidth?: string
  getLinkProps?: (data: T) => LinkProps
  render?: (data: T) => ReactNode
  className?: string
  headerClassName?: string
}

export function Table<T>({
  columns,
  dataSource,
  isTransactionFree
}: {
  columns: Column<T>[]
  dataSource: T[]
  isTransactionFree: boolean
}): ReactElement {
  const isMaxW = useMediaQuery(`(max-width: 1111px)`)
  const getTableContentDataList = (transaction: Transaction, index: number) => {
    const blockReward = <Capacity capacity={shannonToCkb(transaction.capacityInvolved)} unit={null} textDirection="right" integerClassName="font-bold" />
    const blockFreeReward = <Capacity capacity={shannonToCkb(transaction.transactionFee)} unit={null} textDirection="right" />

    return [
      {
        width: '30%',
        to: `/block/${transaction.transactionHash}`,
        content: transaction.transactionHash,
        textDirection: 'left',
        textWidth: isMaxW ? '150px' : '300px',
        isTextActive: true,
        linkType: 'transaction'
      },
      !!isTransactionFree && {
        width: '20%',
        to: `/block/${transaction.blockNumber}`,
        content: <div className='underline font-menlo hover:text-[var(--color-primary)]'>{localeNumberString(transaction.blockNumber)}</div>,
        textDirection: 'left',
      },
      !!isTransactionFree && {
        width: '25%',
        textDirection: 'left',
        content: <div className="inline-block max-w-full w-[100%] break-all whitespace-normal font-menlo"><DateTime date={transaction.blockTimestamp} showRelative /></div>,
      },
      !isTransactionFree && {
        width: '25%',
        to: `/block/${transaction.createTimestamp}`,
        textDirection: 'left',
        content: <div className="inline-block max-w-full w-[100%] break-all whitespace-normal font-menlo"><DateTime date={transaction.createTimestamp!} showRelative /></div>,
      },
      {
        width: '25%',
        content: blockReward,
        textDirection: 'right',
        bold: true,
      },
      // !isTransactionFree && {
      //   width: '20%',
      //   content: blockFreeReward,
      //   textDirection: 'right',
      //   bold: true,
      // },
    ]
  }

  return (
    <div>
      <TableTitleRow>
        {
          columns.map(col => (
            <TableTitleRowItem key={col.key} width={col.width} textDirection={col.textDirection}>
              {col.title}
            </TableTitleRowItem>
          ))
        }
      </TableTitleRow>

      {
        dataSource.map(
          (dataItem: any, listIndex: number) => {
            return (
              <TableContentRow key={listIndex}>
                {getTableContentDataList(dataItem, listIndex).map(
                  (data: any, index: number) => {
                    const key = index;
                    return (
                      <Fragment key={key}>
                        {data.content === dataItem.transactionHash ? (
                          <TableMinerContentItem width={data.width} content={data.content} textWidth={data.textWidth} textCenter isTextActive={data.isTextActive} linkType={data.linkType} />
                        ) : (
                          <TableContentItem width={data.width} content={data.content} to={data.to} textDirection={data.textDirection} bold={data.bold} isTextActive={data.isTextActive} />
                        )}
                      </Fragment>
                    )
                  },
                )}
              </TableContentRow>
            )
          }
        )
      }
    </div>
  )
}

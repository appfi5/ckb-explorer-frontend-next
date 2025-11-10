"use client"
import { Fragment, useMemo, type FC } from 'react'
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { parseSimpleDate, dayjs } from '@/utils/date'
import Content from '@/components/Content'
import { TableContentItem, TableMinerContentItem } from '@/components/Table'
import { TableTitleRow, TableContentRow, TableTitleRowItem } from '@/components/Table/TableComp'
import { deprecatedAddrToNewAddr, shannonToCkb } from '@/utils/util'
import { DELAY_BLOCK_NUMBER } from '@/constants/common'
import { localeNumberString } from '@/utils/number'
import Capacity from '@/components/Capacity'
import AddressText from '@/components/AddressText'
import { useIsMobile, useMediaQuery, usePaginationParamsInListPage, useSortParam } from '@/hooks'
import Pagination from '@/components/Pagination'
import styles from './styles.module.scss'
import type { Block } from '@/models/Block'
import { type CardCellFactory, CardListWithCellsList } from '@/components/CardList'
import Link from 'next/link'
import server from '@/server';
import Loading from '@/components/Loading';
import SortButton from '@/components/SortButton'
import { useTheme } from "@/components/Theme";
import DownloadIcon from '@/components/icons/download'
import type { TFunction } from 'i18next'
import { useCurrentLanguage } from '@/utils/i18n'
import DateTime from '@/components/DateTime';

const BlockValueItem = ({ value, to }: { value: string; to: string }) => (
  <div className={styles.highLightValue}>
    <Link href={to}>
      <span>{value}</span>
    </Link>
  </div>
)

type BlockListSortByType = 'height' | 'transactions' | 'reward'

interface TableTitleData {
  title: string
  width: string
  sortRule?: BlockListSortByType
  textDirection?: 'left' | 'right' | 'center'
}

interface TableContentData {
  width: string
  to?: string
  content: string
  textDirection?: 'left' | 'right' | 'center'
  bold?: boolean
  textWidth?: string
  isTextActive?: boolean
}

const LoadingSection = () => <Loading className='min-h-[200px]' />

const getTableContentDataList = (block: Block, index: number, page: number, isMaxW: boolean, t: TFunction<"common", undefined>, currentLanguage: string) => {
  const blockReward =
    !block.reward
      ? <div className={`font-menlo text-[#999] ${currentLanguage === 'zh' && 'text-[14px]'}`}>{t("block.pending")}</div>
      : <Capacity capacity={shannonToCkb(block.reward)} textDirection="right" unit={null} integerClassName="font-bold text-[16px]" />
  // index < DELAY_BLOCK_NUMBER && page === 1 ? (
  //   <div className={`${styles.blockRewardContainer}`}>
  //     <Capacity capacity={shannonToCkb(block.reward)} unit={null} textDirection="right" />
  //   </div>
  // ) : (
  //   <div className={styles.blockRewardPanel}>
  //     <Capacity capacity={shannonToCkb(block.reward)} unit={null} textDirection="right" />
  //   </div>
  // )

  return [
    {
      width: isMaxW ? '16%' : '14%',
      to: `/block/${block.number}`,
      content: localeNumberString(block.number),
      textDirection: 'left',
      isTextActive: true,
      bold: true,
    },
    {
      width: isMaxW ? '28%' : '35%',
      content: block.minerHash,
      textDirection: 'left',
      textWidth: isMaxW ? '150px' : '300px',
    },
    {
      width: isMaxW ? '19%' : '21%',
      content: (
        <div className="inline-block max-w-full w-[100%] break-all whitespace-normal">
          <DateTime date={block.timestamp} showRelative />
        </div>
      ),
      textDirection: 'left',
      textWidth: isMaxW ? '150px' : '300px',
    },
    {
      width: isMaxW ? '17%' : '10%',
      content: `${block.transactionsCount}`,
      textDirection: 'right',
      bold: true,
    },
    {
      width: '20%',
      content: blockReward,
      textDirection: 'right',
      bold: true,
    },
  ] as TableContentData[]
}

const BlockCardGroup: FC<{ blocks: Block[]; isFirstPage: boolean }> = ({ blocks, isFirstPage }) => {
  const { t } = useTranslation()
  const items: CardCellFactory<Block>[] = [
    {
      title: t('home.height'),
      content: block => <BlockValueItem value={localeNumberString(block.number)} to={`/block/${block.number}`} />,
    },
    {
      title: t('block.miner'),
      content: block => (
        <div className={styles.highLightValue}>
          <AddressText
            disableTooltip
            monospace={false}
            linkProps={{
              href: `/address/${block.minerHash}`,
            }}
          >
            {block.minerHash}
          </AddressText>
        </div>
      ),
    },
    {
      title: t('home.time'),
      content: block => parseSimpleDate(block.timestamp),
    },
    {
      title: t('home.transactions'),
      content: block => localeNumberString(block.transactionsCount),
    },
    {
      title: t('home.block_reward'),
      content: (block, index) =>
        !block.reward
          ? t("block.pending")
          : <Capacity capacity={shannonToCkb(block.reward)} textDirection="left" unit={null} />
      // index < DELAY_BLOCK_NUMBER && isFirstPage ? (
      //   <div className={styles.blockRewardContainer}>
      //     <Capacity capacity={shannonToCkb(block.reward)} unit={null} />
      //   </div>
      // ) : (
      //   <div className={styles.blockRewardPanel}>
      //     <Capacity capacity={shannonToCkb(block.reward)} unit={null} />
      //   </div>
      // ),
    },
  ]

  return (
    <CardListWithCellsList
      className={styles.blockCardGroup}
      dataSource={blocks}
      getDataKey={block => block.number}
      cells={items}
    />
  )
}

const BlockListPage = () => {
  const router = useRouter();
  const [t] = useTranslation()
  const isMobile = useIsMobile()
  const isMaxW = useMediaQuery(`(max-width: 1111px)`)
  const [theme, toggleTheme] = useTheme();
  const { currentPage, pageSize, setPage, setPageSize } = usePaginationParamsInListPage()
  const currentLanguage = useCurrentLanguage()

  // const { sortBy, orderBy, sort, handleSortClick } = useSortParam<BlockListSortByType>(s =>
  //   s ? ['height', 'transactions', 'reward'].includes(s) : false,
  // )
  const sortParam = useSortParam<BlockListSortByType>(s => s ? ['height', 'transactions', 'reward'].includes(s) : false,)
  const { sortBy, orderBy, sort, handleSortClick } = sortParam;

  const ListTitles: TableTitleData[] = useMemo(
    () => [
      {
        title: t('home.height'),
        width: isMaxW ? '16%' : '14%',
        // sortRule: 'height',
        textDirection: 'left',
      },
      {
        title: t('block.miner'),
        width: isMaxW ? '28%' : '35%',
        textDirection: 'left',
      },
      {
        title: t('home.time'),
        width: isMaxW ? '19%' : '21%',
        textDirection: 'left',
      },
      {
        title: t('home.transactions'),
        width: isMaxW ? '17%' : '10%',
        // sortRule: 'transactions',
        textDirection: 'right',
      },
      {
        title: t('home.block_reward'),
        width: '20%',
        // sortRule: 'reward',
        textDirection: 'right',
      },
    ],
    [t, isMaxW],
  )

  const query = useQuery({
    queryKey: ['blocks', currentPage, pageSize, sort],
    // queryFn: async () => {
    //   const { data, meta } = await explorerService.api.fetchBlocks(currentPage, pageSize, sort)
    //   return {
    //     blocks: data.map(wrapper => wrapper.attributes),
    //     total: meta?.total ?? 0,
    //   }
    // }

    queryFn: async () => {
      const res = await server.explorer("GET /blocks", { page: currentPage, pageSize: pageSize, sort: sort ? sort : '' })
      return {
        blocks: res?.records ?? [],
        total: res?.total ?? 0,
      }
    }
  })
  const { data, isLoading } = query
  const blocks = data?.blocks ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / pageSize)

  const blockList = blocks.map((b: any) => ({
    ...b,
    minerHash: deprecatedAddrToNewAddr(b.minerHash),
  }))

  return (
    <Content>
      <div className={`${styles.blockListPanel} container`}>
        <div className="flex items-center justify-between font-medium text-[20px] leading-[28px] mb-[12px]">
          {t("home.blocks")}
          {/* <PixelBorderBlock
            className="cursor-pointer h-[32px]"
            borderColor={theme === 'light' ? "#F0F1F8" : "#999999"}
            contentClassName='flex items-center justify-center gap-[5px] px-[12px] leading-[20px]'
            onClick={() => {
              const link = '/export-transactions?type=blocks'
              router.push(link)
            }}
          >
            <DownloadIcon color="#999999" className="mt-[3px]" />
            <span className='font-medium text-[14px] text-[#999999]'>{t("export_transactions.csv_export")}</span>
          </PixelBorderBlock> */}
        </div>
        {
          isMobile ? <div>
            {/* <TableTitleRow>
              {
                ListTitles.filter(data => data.sortRule).map((data: TableTitleData) => (
                  <TableTitleRowItem key={data.title}>
                    <div>{data.title}</div>
                    <button
                      type="button"
                      className={styles.sortIcon}
                      data-order={sortBy === data.sortRule ? orderBy : undefined}
                      onClick={() => handleSortClick(data.sortRule)}
                    >
                      <InteImage src={SortIcon} alt="" />
                    </button>
                    <SortButton field={data.sortRule} sortParam={sortParam} />
                  </TableTitleRowItem>
                ))
              }
            </TableTitleRow> */}
            {isLoading ? <LoadingSection /> : <BlockCardGroup blocks={blockList} isFirstPage={currentPage === 1} />}
          </div> : <div>
            <TableTitleRow>
              {
                ListTitles.map((data: TableTitleData) => (
                  <TableTitleRowItem key={data.title} width={data.width} textDirection={data.textDirection}>
                    <div>{data.title}</div>
                    {data.sortRule && (
                      // <button
                      //   type="button"
                      //   className={styles.sortIcon}
                      //   data-order={sortBy === data.sortRule ? orderBy : undefined}
                      //   onClick={() => handleSortClick(data.sortRule)}
                      // >
                      //   <InteImage src={SortIcon} alt="" />
                      // </button>
                      <SortButton field={data.sortRule} sortParam={sortParam} />
                    )}
                  </TableTitleRowItem>
                ))
              }
            </TableTitleRow>
            {isLoading ? (
              <LoadingSection />
            ) : (
              blockList.map(
                (block: Block, blockIndex: number) =>
                  block && (
                    <TableContentRow key={block.number}>
                      {getTableContentDataList(block, blockIndex, currentPage, isMaxW, t, currentLanguage).map(
                        (data: TableContentData, index: number) => {
                          const key = index
                          return (
                            <Fragment key={key}>
                              {data.content === block.minerHash ? (
                                <TableMinerContentItem width={data.width} content={data.content} textWidth={data.textWidth} linkType="address" textCenter />
                              ) : (
                                <TableContentItem width={data.width} content={data.content} to={data.to} textDirection={data.textDirection} bold={data.bold} isTextActive={data.isTextActive} />
                              )}
                            </Fragment>
                          )
                        },
                      )}
                    </TableContentRow>
                  ),
              )
            )}
          </div>
        }
        <Pagination
          currentPage={currentPage}
          total={total}
          onChange={setPage}
          paginationType="list"
          setPageSize={setPageSize}
          pageSize={pageSize}
        />
      </div>
    </Content>
  )
}
export default BlockListPage
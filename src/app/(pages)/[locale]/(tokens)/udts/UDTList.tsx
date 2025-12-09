'use client'
import type { UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { FC } from 'react'
import type { ReactNode } from 'react'
import { useMemo, useState, useEffect } from 'react'
import dayjs from 'dayjs'
import classNames from 'classnames'
import type { TFunction } from 'i18next'
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams, useParams } from 'next/navigation'
import type { XUDT } from '@/models/Xudt'
import Content from '@/components/Content'
import Pagination from '@/components/Pagination'
import SortButton from '@/components/SortButton'
import { MultiFilterButton } from '@/components/MultiFilterButton'
import { localeNumberString } from '@/utils/number'
import Loading from '@/components/Loading'
import styles from './styles.module.scss'
import { usePaginationParamsInPage, useSearchParams as useCustomSearchParams, useSortParam } from '@/hooks'
import { QueryResult } from '@/components/QueryResult'
// import { SubmitTokenInfo } from '@/components/SubmitTokenInfo'
import { BooleanT } from '@/utils/array'
import FtFallbackIcon from '@/assets/ft_fallback_icon.png'
import Tooltip from '@/components/Tooltip'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { XUDT_CODE_URL } from '@/constants/common'
import InteImage from "@/components/InteImage"
import Card from '@/components/Card'
import server from '@/server';
import clientDB from "@/database";
import TokenTag from '@/components/TokenTag'


type SortField = 'h24CkbTransactionsCount' | 'addressesCount' | 'created_time' | 'mint_status'

interface XudtsProps {
  isXudts: boolean;
  isPagination?: boolean;
}

const createGetfilterList = (isXudts: boolean) => (t: TFunction) => [
  {
    key: 'layer-1-asset',
    value: t('xudt.tags.layer-1-asset'),
    title: <TokenTag tagName="layer-1-asset" />,
    to: isXudts ? '/xudts/xudt' : '/xudts/udts',
  },
  {
    key: 'layer-2-asset',
    value: t('xudt.tags.layer-2-asset'),
    title: <TokenTag tagName="layer-2-asset" />,
    to: isXudts ? '/xudts/xudt' : '/xudts/udts',
  },
  {
    key: 'supply-limited',
    value: t('xudt.tags.supply-limited'),
    title: <TokenTag tagName="supply-limited" />,
    to: isXudts ? '/xudts/xudt' : '/xudts/udts',
  },
  // {
  //   key: 'utility',
  //   value: t('xudt.tags.utility'),
  //   title: <XUDTTag tagName="utility" />,
  //   to: isXudts ? '/xudts/xudt' : '/xudts/udts',
  // },
]

const TokenInfo: FC<{ token: XUDT }> = ({ token }) => {
  const { t } = useTranslation()
  const router = useRouter();

  const symbol = token.symbol || `#${token.typeScriptHash.substring(token.typeScriptHash.length - 4)}`

  const fields: { name: string; value: ReactNode }[] = [
    {
      name: t('xudt.transactions'),
      value: localeNumberString(token.h24CkbTransactionsCount),
    },
    {
      name: t('xudt.unique_addresses'),
      value: localeNumberString(token.addressesCount),
    },
    // {
    //   name: t('xudt.created_time'),
    //   value: token.createdAt ? dayjs(+token.createdAt).format('YYYY-MM-DD') : null,
    // },
  ].filter(BooleanT())

  return (
    <Card
      key={token.typeScriptHash}
      className={styles.tokensCard}
      onClick={() => router.push(`/udts/${token.typeScriptHash}`)}
    >
      {/* {token.published && ( */}
      <dl className={styles.tokenInfo}>
        <dt className={styles.title}>Name</dt>
        <dd>
          <InteImage src={token.icon ? token.icon : FtFallbackIcon} alt="latest blocks" className={styles.icon} />
          <Link className={styles.link} href={`/udts/${token.typeScriptHash}`}>
            {symbol}
          </Link>
        </dd>
      </dl>
      {/* )} */}
      {token.published && (
        <dl className={styles.tokenInfo}>
          <dt className={styles.title}>Symbol</dt>
          {token.fullName ? <dd className={styles.value}>{token.fullName}</dd> : null}
        </dl>
      )}
      {fields.map(field => (
        <dl className={styles.tokenInfo}>
          <dt className={styles.title}>{field.name}</dt>
          <dd className={styles.value}>{field.value}</dd>
        </dl>
      ))}
      <div className={styles.tokenInfo} style={{ flexDirection: 'row' }}>
        {token.xudtTags?.map(tag => (
          <TokenTag tagName={tag} key={tag} />
        ))}
      </div>
    </Card>
  )
}

export function TokensCard({
  query,
  sortParam,
  isEmpty,
  isXudts
}: {
  query: UseQueryResult<
    {
      tokens: XUDT[]
      total: number
      pageSize: number
    },
    unknown
  >
  sortParam?: ReturnType<typeof useSortParam<SortField>>
  isEmpty: boolean
  isXudts: boolean
}) {
  const { t } = useTranslation()
  const filterList = createGetfilterList(isXudts)(t);
  const sortParamByQuery = useSortParam<SortField>(undefined, 'h24CkbTransactionsCount.desc')
  const { sortBy, orderBy, handleSortClick, updateOrderBy } = sortParam ?? sortParamByQuery
  return (
    <>
      {/* <Card className="p-2!" shadow={false}>
        <div className="flex flex-wrap gap-2">
          <span className={classNames(styles.sortOption, 'mr-auto')}>
            {t('xudt.title.tags')}
            // <MultiFilterButton filterName="tags" key="" filterList={filterList} />
          </span>
          <div className="flex items-center">
            <Select value={sortBy} onValueChange={value => handleSortClick(value as SortField)}>
              <SelectTrigger className="border-r-0! rounded-r-none!">
                <SelectValue placeholder="sorting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transactions">{t('xudt.transactions')}</SelectItem>
                <SelectItem value="created_time">{t('xudt.created_time')}</SelectItem>
                <SelectItem value="addresses_count">{t('xudt.unique_addresses')}</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="rounded-l-none! dark:border-[#4C4C4C]! dark:bg-transparent!"
              variant="outline"
              size="icon"
              onClick={() => updateOrderBy(orderBy === 'desc' ? 'asc' : 'desc')}
            >
              {orderBy === 'desc' ? <ArrowDownWideNarrow /> : <ArrowUpNarrowWide />}
            </Button>
          </div>
        </div>
      </Card> */}

      {isEmpty ? (
        <div className={styles.tokensContentEmpty}>{t('xudt.tokens_empty')}</div>
      ) : (
        <QueryResult
          query={query}
          errorRender={() => <div className={styles.tokensContentEmpty}>{t('xudt.tokens_empty')}</div>}
          loadingRender={() => (
            <div className={styles.tokensLoadingPanel}>
              <Loading />
            </div>
          )}
        >
          {data => (
            <div>
              {data?.tokens.map(token => (
                <TokenInfo key={token.typeScriptHash} token={token} />
              ))}
            </div>
          )}
        </QueryResult>
      )}
    </>
  )
}

const TokenTable: FC<{
  query: UseQueryResult<
    {
      tokens: XUDT[]
      total: number
      pageSize: number
    },
    unknown
  >
  sortParam?: ReturnType<typeof useSortParam<SortField>>
  isEmpty: boolean
  isXudts: boolean
}> = ({ query, sortParam, isEmpty, isXudts }) => {
  const { t } = useTranslation()
  const RGBPP_VIEW = 'rgbpp'
  const searchParams = useSearchParams()
  const isRgbppView = searchParams.get('view') === RGBPP_VIEW
  const filterList = createGetfilterList(isXudts)(t);
  const router = useRouter();
  const getNewSearchParams = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      newParams.set(key, value)
    })
    return newParams.toString()
  }

  const nullableColumns = [
    {
      title: `${t('xudt.symbol')}&${t('xudt.name')}`,
      className: styles.colName,
      key: 'name',
      render: (token: XUDT) => {
        const symbol = token.symbol || `#${token.typeScriptHash.substring(token.typeScriptHash.length - 4)}`
        return (
          <div className={styles.container}>
            <InteImage src={token.icon ? token.icon : FtFallbackIcon} alt="latest blocks" className={styles.icon} />
            <div className={styles.right}>
              <div className={styles.symbolAndName}>
                {symbol}
                {/* <Link className={styles.link} href={`/udts/${token.typeScriptHash}`}>
                  {symbol}
                </Link> */}
                {/* {token.published ? (
                  <>
                    <Link className={styles.link} href={`/udts/${token.typeScriptHash}`}>
                      {symbol}
                    </Link>
                    <Tooltip trigger={<span className={styles.name}>{token.fullName}</span>}>{token.fullName}</Tooltip>
                  </>
                ) : (
                  symbol
                )} */}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      title: (
        <span>
          {t('xudt.title.tags')}
          {/* <MultiFilterButton filterName="tags" key="" filterList={filterList} /> */}
        </span>
      ),
      key: 'tags',
      render: (token: XUDT) => (
        <div className="flex flex-wrap gap-2 sm:py-[10px]">
          {token.xudtTags?.map(tag => (
            <TokenTag tagName={tag} key={tag} />
          ))}
        </div>
      ),
    },
    // {
    //   title: (
    //     <span>
    //       {t('xudt.created_time')}
    //       <SortButton field="created_time" sortParam={sortParam} />
    //     </span>
    //   ),
    //   className: styles.colCreatedTime,
    //   key: 'created_time',
    //   render: (token: XUDT) => token.createdAt ? <span className='text-[#232323] text-[16px] dark:text-white'>{dayjs(+token.createdAt).format('YYYY/MM/DD HH:mm:ssZZ')}</span> : '',
    // },
    {
      title: (
        <div className="w-full flex justify-end items-center">
          <span>{t('xudt.transactions')}</span>
          <SortButton field="h24CkbTransactionsCount" sortParam={sortParam} />
        </div>
      ),
      className: styles.colTransactions,
      key: 'transactions',
      render: (token: XUDT) => localeNumberString(token.h24CkbTransactionsCount),
    },
    isRgbppView
      ? {
        title: (
          <Tooltip
            trigger={
              <Link
                href={`/xudts/xudt?${getNewSearchParams({ view: 'ckb' })}`}
                style={{ color: 'var(--color-primary)' }}
              >
                {t('xudt.rgbpp_holders_count')}
              </Link>
            }
          >
            {t('xudt.display_rgbpp_holders')}
          </Tooltip>
        ),
        key: 'holders_count',
        className: styles.colTransactions,
        render: (token: XUDT) => localeNumberString(token.holdersCount),
      }
      : {
        title: (<div className="w-full flex justify-end items-center">
          <span>{t('xudt.address_count')}</span>
          <SortButton field="addressesCount" sortParam={sortParam} />
        </div>),
        className: styles.colTransactions,
        key: 'addresses_count',
        render: (token: XUDT) => localeNumberString(token.addressesCount)
      },
  ]
  const columns = nullableColumns.filter(BooleanT())

  let content: ReactNode = null
  if (query.isLoading) {
    content = (
      <tr>
        <td colSpan={columns.length}>
          <Loading className={styles.loading} show />
        </td>
      </tr>
    )
  } else if (isEmpty) {
    content = (
      <tr>
        <td colSpan={columns.length}>
          <div className={styles.tokensContentEmpty}>{t('xudt.tokens_empty')}</div>
        </td>
      </tr>
    )
  } else {
    content = (
      <>
        {(query.data?.tokens ?? []).map(token => (
          <tr key={token.typeScriptHash} className="hover:bg-[#F5F5F5] dark:hover:bg-[#303030] cursor-pointer" onClick={() => router.push(`/udts/${token.typeScriptHash}`)}>
            {columns.map(column => (
              <td key={column.key} className={column.className} style={{ width: `${100 / columns.length}%` }}>
                {column.render?.(token)}
              </td>
            ))}
          </tr>
        ))}
      </>
    )
  }

  return (
    <table className={styles.tokensTable}>
      <thead>
        <tr>
          {columns.map(column => (
            <th key={column.key} style={{ width: `${100 / columns.length}%` }}>
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{content}</tbody>
    </table>
  )
}

const UDTList = ({ isXudts, isPagination }: XudtsProps) => {
  const { t } = useTranslation()
  const searchParams = useCustomSearchParams('tags')
  const tags = searchParams.tags || ''
  const [isSubmitTokenInfoModalOpen, setIsSubmitTokenInfoModalOpen] = useState<boolean>(false)
  const { currentPage, pageSize: _pageSize, setPage, setPageSize } = usePaginationParamsInPage()
  const sortParam = useSortParam<SortField>(undefined, 'h24CkbTransactionsCount.desc')
  const { sort } = sortParam


  const query = useQuery({
    queryKey: ['xudts', currentPage, _pageSize, sort, tags, 'true'],
    queryFn: async (): Promise<{
      tokens: XUDT[];
      total: number;
      pageSize: number;
    }> => {
      const result: any = await server.explorer("GET /udts", { page: currentPage, pageSize: _pageSize, sort: sort ? sort : '', tags })
      const udtRegisterInfos = await clientDB.udt.get();

      if (result.length === 0) {
        throw new Error('Tokens empty');
      }
      const bMap = new Map(udtRegisterInfos.map(item => [item.typeHash, item]));
      const updatedA = result.records.map((a: any) => bMap.has(a.typeScriptHash) ? { ...a, ...bMap.get(a.typeScriptHash) } : a);
      return {
        tokens: updatedA.map((token: XUDT) => ({
          ...token,
          xudtTags: token.tags?.filter(tag => !['rgb++', 'rgbpp-compatible'].includes(tag)),
        })),
        total: result.total,
        pageSize,
      };
    },
    retry: 1,
    staleTime: 60000,
  });

  const total = query.data?.total ?? 0
  const pageSize = query.data?.pageSize ?? _pageSize
  // const totalPages = Math.ceil(total / pageSize)

  const isEmpty = useMemo(() => {
    if (query.isLoading) return false;

    const hasTags = tags !== '';
    const hasData = total > 0;

    return (hasTags && !hasData) || (!hasTags && !hasData);
  }, [query.isLoading, total, tags]);

  return (
    <Content>
      <div className={classNames(styles.tokensPanel, 'container')}>
        <div className={styles.tokensTitlePanel}>
          <div className={styles.title}>
            <span className={styles.titleText}>{t('udt.udts')}</span>
            <span className={styles.description}>{t('udt.description')}</span>
          </div>

          {/* <button
            type="button"
            className={styles.submitTokenInfoBtn}
            onClick={() => setIsSubmitTokenInfoModalOpen(true)}
          >
            {t('udt.submit_token_info')}
          </button> */}
        </div>

        <div className={styles.cards}>
          <TokensCard query={query} sortParam={sortParam} isEmpty={isEmpty} isXudts={isXudts} />
        </div>
        <div className={styles.table}>
          <TokenTable query={query} sortParam={sortParam} isEmpty={isEmpty} isXudts={isXudts} />
        </div>

        {/* {!!isPagination && <Pagination
          total={total}
          currentPage={currentPage}
          pageSize={pageSize}
          // totalPages={isEmpty ? 0 : totalPages}
          onChange={setPage}
          setPageSize={setPageSize}
        />} */}
        <Pagination
          total={total}
          currentPage={currentPage}
          pageSize={pageSize}
          // totalPages={isEmpty ? 0 : totalPages}
          onChange={setPage}
          setPageSize={setPageSize}
        />
      </div>
      {/* {isSubmitTokenInfoModalOpen ? (
        <SubmitTokenInfo tagFilters={['xudt']} onClose={() => setIsSubmitTokenInfoModalOpen(false)} />
      ) : null} */}
    </Content>

  )
}

export default UDTList
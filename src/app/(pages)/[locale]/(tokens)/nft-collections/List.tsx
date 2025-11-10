
import { useMemo, type ReactNode, Fragment } from 'react'
import classNames from 'classnames'
import { Trans, useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react'
import type { NFTCollection } from '@/server/dataTypes'
import SortButton from '@/components/SortButton'
import SelectedCheckIcon from '@/assets/selected_check_icon.svg'
import FilterIcon from './filter.svg'
import { getPrimaryColor } from '@/constants/common'
import { useSearchParams, useMediaQuery, useSortParam } from '@/hooks'
import styles from './styles.module.scss'
import { useNFTCollectionsSortParam } from './util'
import { parseSimpleDate, dayjs } from '@/utils/date'
import MultiFilterButton from '@/components/MultiFilterButton'
import { whiteList } from '@/components/NFTTag'
import Card from '@/components/Card'
import Tooltip from '@/components/Tooltip'
import Popover from '@/components/Popover'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import InteImage from '@/components/InteImage'
import { TableTitleRow, TableContentRow, TableTitleRowItem } from '@/components/Table/TableComp'
import { TableContentItem, TableMinerContentItem } from '@/components/Table'
import { useRouter } from "next/navigation";
import Loading from '@/components/Loading'
import TokenTag from '@/components/TokenTag'
import DateTime from '@/components/DateTime'

const primaryColor = getPrimaryColor()
function useFilterList(): Record<'title' | 'value', string>[] {
  const { t } = useTranslation()
  return [
    {
      value: 'all',
      title: t('nft.all-type'),
    },
    {
      value: 'm_nft',
      title: t('nft.m_nft'),
    },
    {
      value: 'nrc721',
      title: t('nft.nrc_721'),
    },
    {
      value: 'cota',
      title: t('nft.cota'),
    },
    {
      value: 'spore',
      title: t('nft.dobs'),
    },
  ]
}

const getFilterList = (t: TFunction) =>
  [
    {
      key: 'invalid',
      value: t('xudt.tags.invalid'),
      title: <TokenTag key="invalid" tagName="invalid" />,
      to: '/nft-collections',
    },
    {
      key: 'suspicious',
      value: t('xudt.tags.suspicious'),
      title: <TokenTag key="suspicious" tagName="suspicious" />,
      to: '/nft-collections',
    },
    {
      key: 'out-of-length-range',
      value: t('xudt.tags.out-of-length-range'),
      title: <TokenTag key="out-of-length-range" tagName="out-of-length-range" />,
      to: '/nft-collections',
    },
    {
      key: 'rgb++',
      value: t('xudt.tags.rgb++'),
      title: <TokenTag key="rgb++" tagName="rgb++" />,
      to: '/nft-collections',
    },
    {
      key: 'duplicate',
      value: t('xudt.tags.duplicate'),
      title: <TokenTag key="duplicate" tagName="duplicate" />,
      to: '/nft-collections',
    },
    {
      key: 'layer-1-asset',
      value: t('xudt.tags.layer-1-asset'),
      title: <TokenTag key="layer-1-asset" tagName="layer-1-asset" />,
      to: '/nft-collections',
    },
    {
      key: 'layer-2-asset',
      value: t('xudt.tags.layer-2-asset'),
      title: <TokenTag key="layer-2-asset" tagName="layer-2-asset" />,
      to: '/nft-collections',
    },
    {
      key: 'supply-limited',
      value: t('xudt.tags.supply-limited'),
      title: <TokenTag key="supply-limited" tagName="supply-limited" />,
      to: '/nft-collections',
    },
  ].filter(f => whiteList.includes(f.key))

export const isTxFilterType = (s?: string): boolean => {
  return s ? ['all', 'm_nft', 'nrc721', 'cota', 'spore'].includes(s) : false
}

const TypeFilter = () => {
  const { t } = useTranslation()
  const { type } = useSearchParams('type')
  const isActive = isTxFilterType(type)
  const list = useFilterList()
  return (
    <div className={styles.typeFilter} data-is-active={isActive}>
      {t('nft.standard')}
      <Popover trigger={<InteImage src={FilterIcon} className={styles.filter} />}>
        <div className={styles.filterItems}>
          {list.map(f => (
            <Link
              key={f.value}
              href={`/nft-collections?${new URLSearchParams({ type: f.value })}`}
              data-is-active={f.value === type}
            >
              {f.title}
              <InteImage src={SelectedCheckIcon} />
            </Link>
          ))}
        </div>
      </Popover>
    </div>
  )
}

const Tags = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.colTags}>
      {t('xudt.title.tags')}
      <MultiFilterButton filterName="tags" key="" filterList={getFilterList(t)} />
    </div>
  )
}

const HolderMinterSort = () => {
  const { t } = useTranslation()
  const sortParam = useNFTCollectionsSortParam()
  const { sortBy, handleSortClick } = sortParam

  return (
    <div className={styles.holderMinted}>
      <div
        className={classNames({
          [styles.sortActive]: sortBy === 'holders_count',
        })}
        onClick={() => handleSortClick('holders_count')}
        role="button"
        tabIndex={0}
      >
        {t('nft.holder')}
        {sortBy === 'holders_count' && <SortButton field="holders_count" sortParam={sortParam} />}
      </div>
      <span className={styles.divider}>/</span>
      <div
        className={classNames({
          [styles.sortActive]: sortBy === 'items_count',
        })}
        onClick={() => handleSortClick('items_count')}
        role="button"
        tabIndex={0}
      >
        {t('nft.minted')}
        {sortBy === 'items_count' && <SortButton field="items_count" sortParam={sortParam} />}
      </div>
    </div>
  )
}

const TypeInfo: React.FC<{ nft: NFTCollection }> = ({ nft: item }) => {
  const { t } = useTranslation()
  return t(`glossary.${item.standard}`) ? (
    <Tooltip
      trigger={<span>{t(`nft.${item.standard === 'spore' ? 'dobs' : item.standard}`)}</span>}
      placement="top"
      contentClassName={styles.nftTooltip}
    >
      <Trans
        i18nKey={`glossary.${item.standard}`}
        components={{
          cota_link: (

            <a
              href="https://talk.nervos.org/t/rfc-cota-a-compact-token-aggregator-standard-for-extremely-low-cost-nfts-and-fts/6338"
              target="_blank"
              rel="noreferrer"
            />
          ),
          m_nft_link: (

            <a href="https://github.com/nervina-labs/ckb-nft-scripts" target="_blank" rel="noreferrer" />
          ),
        }}
      />
    </Tooltip>
  ) : (
    t(`nft.${item.standard}`)
  )
}

type BlockListSortByType = 'h24_ckb_transactions_count' | 'holders_count' | 'items_count' | 'block_timestamp'

const displayTagList = [
  "supply-limited",
  // "out-of-length-range",
  // "invalid",
  // "duplicate",
  "layer-1-asset",
  "layer-2-asset",
  // "verified-on-platform",
  // "unnamed",
  // "supply-unlimited",

  "rgbpp-compatible",
  "rgb++",
  // "suspicious",
  // "utility",
]
const getTableContentDataList = (nftItem: NFTCollection, index: number, isMaxW: boolean, t: TFunction<"common", undefined>) => {
  // let typeHash: string | null = null
  // try {
  //   if (nftItem.type_script) {
  //     typeHash = scriptToHash({
  //       codeHash: nftItem.type_script.code_hash,
  //       hashType: nftItem.type_script.hash_type,
  //       args: nftItem.type_script.args,
  //     })
  //   }
  // } catch {
  //   typeHash = nftItem.sn
  // }
  // const annotation = DEPRECATED_DOB_COLLECTION.find(i => i.id === typeHash)

  const displayTagSet = new Set(displayTagList);
  return [
    {
      width: '15%',
      textDirection: 'left',
      isTextActive: true,
      bold: true,
      content: <div className='flex items-center gap-2'>
        <InteImage
          src={nftItem.icon_url || '/images/spore_placeholder.svg'}
          alt={nftItem.name}
          width={48}
          height={48}
          className="rounded-[4px] object-scale-down"
        />
        <div>
          {
            nftItem.standard === 'spore' && nftItem.creator === '' ? 'Unique items' : nftItem.name.length > 6 ? <Tooltip
              trigger={<span className='font-menlo'>{`${nftItem.name.slice(0, 6)}...`}</span>}
              placement="top"
            >{nftItem.name}</Tooltip> : nftItem.name
          }
        </div>
      </div>
    },
    {
      width: '18%',
      content: nftItem.tags ? <div className={styles.tags}>
        {nftItem.tags?.map(tag => (
          displayTagSet.has(tag) ? (
            <TokenTag key={tag} tagName={tag} />
          ) : (
            <span key={tag}>-</span>
          )
        ))}
      </div> : '-',
      textDirection: 'left',
    },
    {
      width: '15%',
      content: `${nftItem.h24CkbTransactionsCount}`,
      textDirection: 'left',
    },
    {
      width: '15%',
      content: `${(nftItem.holdersCount ?? 0).toLocaleString('en')}/${(nftItem.itemsCount ?? 0).toLocaleString(
        'en',
      )}`,
      textDirection: 'left',
    },
    {
      width: '19%',
      content: nftItem.blockTimestamp 
        ? (
          <div className="inline-block max-w-full w-[100%] break-all whitespace-normal pr-[10px]">
            <DateTime date={nftItem.blockTimestamp} showRelative />
          </div>
        ) 
        : '-'
      ,
      textDirection: 'left',
    },
    {
      width: '18%',
      content: nftItem.creator ? nftItem.creator : '-',
      textDirection: 'left',
      textWidth: isMaxW ? '140px' : '200px',
    }
  ]
}


const LoadingComponent = () => (
  <div className='w-full min-h-[200px] flex items-center justify-center'><Loading show /></div>
)

export const ListOnDesktop: React.FC<{ isLoading: boolean; list: NFTCollection[] }> = ({ list, isLoading }) => {
  const { t } = useTranslation()
  const router = useRouter();
  const isMaxW = useMediaQuery(`(max-width: 1200px)`)
  const sortParam = useSortParam<BlockListSortByType>(s => s ? ['h24_ckb_transactions_count', 'holders_count', 'items_count', 'block_timestamp'].includes(s) : false,)

  const ListTitles: any[] = useMemo(
    () => [
      {
        title: t('nft.collection_name'),
        width: '15%',
        textDirection: 'left',
      },
      {
        title: <Tags />,
        width: '18%',
        textDirection: 'left',
      },
      {
        title: t('nft.transactions'),
        width: '15%',
        sortRule: 'h24_ckb_transactions_count',
        textDirection: 'left',
      },
      {
        title: <HolderMinterSort />,
        width: '15%',
        textDirection: 'left',
      },
      {
        title: t('nft.created_time'),
        width: '19%',
        sortRule: 'block_timestamp',
        textDirection: 'left',
      },
      {
        title: t('nft.minter_address'),
        width: '18%',
        textDirection: 'left',
      },
    ],
    [t, isMaxW],
  )

  return (
    <div>
      <TableTitleRow>
        {
          ListTitles.map((data) => (
            <TableTitleRowItem key={data.title} width={data.width} textDirection={data.textDirection}>
              <div>{data.title}</div>
              {data.sortRule && (
                <SortButton field={data.sortRule} sortParam={sortParam} />
              )}
            </TableTitleRowItem>
          ))
        }
      </TableTitleRow>
      {
        isLoading ? <LoadingComponent /> : list.length ? list.map(
          (item, itemIndex) =>
            item && (
              <TableContentRow key={itemIndex} className="hover:bg-[#F5F5F5] dark:hover:bg-[#363839] cursor-pointer" onClick={() => router.push(`/nft-collections/${item.typeScriptHash}`)}>
                {getTableContentDataList(item, itemIndex, isMaxW, t).map(
                  (data: any, index: number) => {
                    const key = index
                    return (
                      <Fragment key={key}>
                        {data.content === item.creator ? (
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
        ) : <div className={styles.noRecord}>{t(`nft.no_record`)}</div>
      }
    </div>
  )
}

export const ListOnMobile: React.FC<{ isLoading: boolean; list: NFTCollection[] }> = ({ list, isLoading }) => {
  const { t } = useTranslation()
  const { sortBy, orderBy, handleSortClick, updateOrderBy } = useNFTCollectionsSortParam()

  return (
    <>
      <Card className="p-2!" shadow={false}>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex flex-nowrap items-center max-w-full mr-auto">
            {t('xudt.title.tags')}
            <MultiFilterButton filterName="tags" key="" filterList={getFilterList(t)} />
          </div>
          <div className="flex items-center">
            <Select
              value={sortBy}
              onValueChange={value => handleSortClick(value as BlockListSortByType)}
            >
              <SelectTrigger className="border-r-0! rounded-r-none!">
                <SelectValue placeholder="sorting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transactions">{t('nft.transactions')}</SelectItem>
                <SelectItem value="holder">{t('nft.holder')}</SelectItem>
                <SelectItem value="minted">{t('nft.minted')}</SelectItem>
                <SelectItem value="timestamp">{t('nft.created_time')}</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className={`${styles.sortButton} rounded-l-none!`}
              variant="outline"
              size="icon"
              onClick={() => updateOrderBy(orderBy === 'desc' ? 'asc' : 'desc')}
            >
              {orderBy === 'desc' ? <ArrowDownWideNarrow /> : <ArrowUpNarrowWide />}
            </Button>
          </div>
        </div>
      </Card>

      {isLoading ? <LoadingComponent /> : list.length ? list.map(item => {
        const itemName: string = item.standard === 'spore' && item.creator === '' ? 'Unique items' : item.name
        // let typeHash: string | null = null
        // try {
        //   if (item.type_script) {
        //     typeHash = scriptToHash({
        //       codeHash: item.type_script.code_hash,
        //       hashType: item.type_script.hash_type,
        //       args: item.type_script.args,
        //     })
        //   }
        // } catch {
        //   // ignore
        // }
        // const annotation = DEPRECATED_DOB_COLLECTION.find(i => i.id === typeHash)
        return (
          <Card key={item.id} className={styles.tokensCard}>
            <div>
              <dl className={styles.tokenInfo}>
                <dt className={styles.title}>Name</dt>
                <dd>
                  {/* {item.icon_url ? (
                        <img
                          src={`${patchMibaoImg(item.icon_url)}?size=small`}
                          alt="cover"
                          loading="lazy"
                          className={styles.icon}
                          onError={handleNftImgError}
                        />
                      ) : (
                        <img
                          src={
                            item.standard === 'spore' ? '/images/spore_placeholder.svg' : '/images/nft_placeholder.png'
                          }
                          alt="cover"
                          loading="lazy"
                          className={styles.icon}
                        />
                      )} */}
                  <Link
                    // href={`/${item.standard === 'spore' ? 'dob' : 'nft'}-collections/${typeHash || item.id}`}
                    href={`/nft-collections/${item.typeScriptHash}`}
                    title={itemName}
                    className={styles.link}
                  >
                    {itemName}
                  </Link>
                </dd>
              </dl>
              <div className={styles.name} />
            </div>
            <dl className={styles.tokenInfo}>
              <dt>{`${t('nft.holder')}/${t('nft.minted')}`}</dt>
              <dd>
                {`${(item.holdersCount ?? 0).toLocaleString('en')}/${(item.itemsCount ?? 0).toLocaleString(
                  'en',
                )}`}
              </dd>
            </dl>
            <dl className={styles.tokenInfo}>
              <dt>{t('nft.transactions')}</dt>
              <dd>{item.h24CkbTransactionsCount}</dd>
            </dl>
            <dl className={styles.tokenInfo}>
              <dt>{t('nft.created_time')}</dt>
              <dd>{item.blockTimestamp === null ? '' : parseSimpleDate(item.blockTimestamp)}</dd>
            </dl>
            {item.creator ? (
              <dl className={styles.tokenInfo}>
                <dt>{t(`nft.minter_address`)}</dt>
                <dd>
                  <Tooltip
                    trigger={
                      <Link
                        href={`/address/${item.creator}`}
                        style={{
                          color: primaryColor,
                          fontWeight: 500,
                        }}
                      >{`${item.creator.slice(0, 8)}...${item.creator.slice(-8)}`}</Link>
                    }
                  >
                    {item.creator}
                  </Tooltip>
                </dd>
              </dl>
            ) : null}
            <dl className={styles.tokenInfo} style={{ flexDirection: 'row' }}>
              {/* {annotation ? <Annotation content={annotation.reason} /> : null} */}
              {item.tags && item.tags.map(tag => (
                <TokenTag key={tag} tagName={tag} />
              ))}
            </dl>
          </Card>
        )
      }) : <div className={styles.noRecord}>{t(`nft.no_record`)}</div>}
    </>
  )
}

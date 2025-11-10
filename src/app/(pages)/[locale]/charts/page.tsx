"use client"
import { type ReactNode, useState, useEffect, useCallback, useMemo, useRef } from 'react'
import 'default-passive-events'
import { useTranslation } from 'react-i18next'
import Content from '@/components/Content'

import { useIsMobile } from '@/hooks'
import { HelpTip } from '@/components/HelpTip'
import styles from './index.module.scss'

import { TransactionCountChart } from './(activities)/transaction-count/page'
import { AddressCountChart } from './(activities)/address-count/page'
import { KnowledgeSizeChart } from './(activities)/knowledge-size/page'
import { CellCountChart } from './(activities)/cell-count/page'
import { CkbHodlWaveChart } from './(activities)/ckb-hodl-wave/page'
import { AddressBalanceRankChart } from './(activities)/address-balance-rank/page'
import { BalanceDistributionChart } from './(activities)/balance-distribution/page'
import { ContractResourceDistributedChart } from './(activities)/contract-resource-distributed/page'
import { ActiveAddressesChart } from './(activities)/active-addresses/page'
import { AssetActivityChart } from './(activities)/asset-activity/page'
import { TxFeeHistoryChart } from './(activities)/tx-fee-history/page'

import { BlockTimeDistributionChart } from './(block)/block-time-distribution/page'
import { EpochTimeDistributionChart } from './(block)/epoch-time-distribution/page'
import { AverageBlockTimeChart } from './(block)/average-block-time/page'

import { DifficultyHashRateChart } from './(mining)/difficulty-hash-rate/page'
import { DifficultyUncleRateEpochChart } from './(mining)/epoch-time-length/page'
import { DifficultyChart } from './(mining)/difficulty/page'
import { HashRateChart } from './(mining)/hash-rate/page'
import { UncleRateChart } from './(mining)/uncle-rate/page'
import { MinerAddressDistributionChart } from './(mining)/miner-address-distribution/page'
import { MinerVersionDistributionChart } from './(mining)/miner-version-distribution/page'
import { NodeCountryDistributionChart } from './(mining)/node-country-distribution/page'
import NodeGeoDistributionChart from './(mining)/node-geo-distribution/page'

import { TotalSupplyChart } from './(monetary)/total-supply/page'
import { AnnualPercentageCompensationChart } from './(monetary)/nominal-apc/page'
import { SecondaryIssuanceChart } from './(monetary)/secondary-issuance/page'
import { InflationRateChart } from './(monetary)/inflation-rate/page'
import { LiquidityChart } from './(monetary)/liquidity/page'

import { TotalDaoDepositChart } from './(nervosDao)/total-dao-deposit/page'
import { NewDaoDepositChart } from './(nervosDao)/new-dao-deposit/page'
import { CirculationRatioChart } from './(nervosDao)/circulation-ratio/page'
import Link from 'next/link'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'

interface ChartData {
  title: string
  chart: ReactNode
  path: string
  description?: string
}

interface ChartCategory {
  id: string
  category: string
  charts: ChartData[]
}

const ChartTitle = ({ chartData }: { chartData: ChartData }) => (
  <div className="chartCardTitlePenal">
    <div className="chartCardTitle">{chartData.title}</div>
    {chartData.description && <HelpTip iconProps={{ alt: 'chart help' }}>{chartData.description}</HelpTip>}
  </div>
)

const ChartCard = ({ chartData }: { chartData: ChartData }) => {
  const isMobile = useIsMobile()
  return (
    <div className={styles.chartCardPanel}>
      {isMobile && <ChartTitle chartData={chartData} />}
      <Link href={chartData.path}>
        {!isMobile && <ChartTitle chartData={chartData} />}
        <div className="chartCardBody">{chartData.chart}</div>
      </Link>
    </div>
  )
}

const useChartsData = () => {
  const { t } = useTranslation()
  
  return useMemo<ChartCategory[]>(() => [
    {
      id: 'category_activities',
      category: t('statistic.category_activities'),
      charts: [
        {
          title: `${t('statistic.top_50_holders')}`,
          chart: <AddressBalanceRankChart isThumbnail />,
          path: '/charts/address-balance-rank',
          description: t('statistic.balance_ranking_description'),
        },
        {
          title: `${t('statistic.transaction_count')}`,
          chart: <TransactionCountChart isThumbnail />,
          path: '/charts/transaction-count',
        },
        {
          title: `${t('statistic.address_count')}`,
          chart: <AddressCountChart isThumbnail />,
          path: '/charts/address-count',
          description: t('statistic.address_count_description'),
        },
        {
          title: t('statistic.cell_count'),
          chart: <CellCountChart isThumbnail />,
          path: '/charts/cell-count',
        },
        {
          title: t('statistic.ckb_hodl_wave'),
          chart: <CkbHodlWaveChart isThumbnail />,
          path: '/charts/ckb-hodl-wave',
        },
        {
          title: `${t('statistic.balance_distribution')}`,
          chart: <BalanceDistributionChart isThumbnail />,
          path: '/charts/balance-distribution',
          description: t('statistic.balance_distribution_description'),
        },
        {
          title: `${t('statistic.tx_fee_history')}`,
          chart: <TxFeeHistoryChart isThumbnail />,
          path: '/charts/tx-fee-history',
          description: t('statistic.tx_fee_description'),
        },
        // {
        //   title: `${t('statistic.contract_resource_distributed')}`,
        //   chart: <ContractResourceDistributedChart isThumbnail />,
        //   path: '/charts/contract-resource-distributed',
        //   description: t('statistic.contract_resource_distributed_description'),
        // },
        {
          title: `${t('statistic.active_addresses')}`,
          chart: <ActiveAddressesChart isThumbnail />,
          path: '/charts/active-addresses',
          description: t('statistic.active_addresses_description'),
        },
        {
          title: t('statistic.asset_activity'),
          chart: <AssetActivityChart isThumbnail />,
          path: '/charts/asset-activity',
          description: t('statistic.asset_activity_description'),
        },
        {
          title: `${t('statistic.knowledge_size')}`,
          chart: <KnowledgeSizeChart isThumbnail />,
          path: '/charts/knowledge-size',
          description: t('statistic.knowledge_size'),
        },
      ],
    },
    {
      id: 'category_block',
      category: t('statistic.category_block'),
      charts: [
        {
          title: `${t('statistic.block_time_distribution')}`,
          chart: <BlockTimeDistributionChart isThumbnail />,
          path: '/charts/block-time-distribution',
          description: t('statistic.block_time_distribution_description'),
        },
        {
          title: `${t('statistic.epoch_time_distribution')}`,
          chart: <EpochTimeDistributionChart isThumbnail />,
          path: '/charts/epoch-time-distribution',
          description: t('statistic.epoch_time_distribution_description'),
        },
        {
          title: `${t('statistic.average_block_time')}`,
          chart: <AverageBlockTimeChart isThumbnail />,
          path: '/charts/average-block-time',
          description: t('statistic.average_block_time_description'),
        },
      ],
    },
    {
      id: 'category_mining',
      category: t('statistic.category_mining'),
      charts: [
        {
          title: `${t('block.difficulty')} & ${t('block.hash_rate')} & ${t('block.uncle_rate')}`,
          chart: <DifficultyHashRateChart isThumbnail />,
          path: '/charts/difficulty-hash-rate',
        },
        {
          title: `${t('block.epoch_time')} & ${t('block.epoch_length')}`,
          chart: <DifficultyUncleRateEpochChart isThumbnail />,
          path: '/charts/epoch-time-length',
        },
        {
          title: `${t('block.difficulty')}`,
          chart: <DifficultyChart isThumbnail />,
          path: '/charts/difficulty',
        },
        {
          title: `${t('block.hash_rate')}`,
          chart: <HashRateChart isThumbnail />,
          path: '/charts/hash-rate',
          description: t('glossary.hash_rate'),
        },
        {
          title: `${t('block.uncle_rate')}`,
          chart: <UncleRateChart isThumbnail />,
          path: '/charts/uncle-rate',
          description: t('statistic.uncle_rate_description'),
        },
        // {
        //   title: `${t('statistic.miner_addresses_rank')}`,
        //   chart: <MinerAddressDistributionChart isThumbnail />,
        //   path: '/charts/miner-address-distribution',
        // },
        // {
        //   title: `${t('statistic.miner_version_distribution')}`,
        //   chart: <MinerVersionDistributionChart isThumbnail />,
        //   path: '/charts/miner-version-distribution',
        // },
        {
          title: `${t('statistic.node_country_distribution')}`,
          chart: <NodeCountryDistributionChart isThumbnail />,
          path: '/charts/node-country-distribution',
        },
        {
          title: `${t('statistic.node_geo_distribution')}`,
          chart: <NodeGeoDistributionChart isThumbnail />,
          path: '/charts/node-geo-distribution',
        },
      ],
    },
    {
      id: 'nervos_dao',
      category: t('blockchain.nervos_dao'),
      charts: [
        {
          title: `${t('statistic.total_dao_deposit_title')}`,
          chart: <TotalDaoDepositChart isThumbnail />,
          path: '/charts/total-dao-deposit',
          description: t('statistic.total_dao_deposit_description'),
        },
        {
          title: `${t('statistic.new_dao_deposit_title')}`,
          chart: <NewDaoDepositChart isThumbnail />,
          path: '/charts/new-dao-deposit',
        },
        {
          title: `${t('statistic.circulation_ratio')}`,
          chart: <CirculationRatioChart isThumbnail />,
          path: '/charts/circulation-ratio',
          description: t('statistic.deposit_to_circulation_ratio_description'),
        },
      ],
    },
    {
      id: 'category_monetary',
      category: t('statistic.category_monetary'),
      charts: [
        {
          title: `${t('statistic.total_supply')}`,
          chart: <TotalSupplyChart isThumbnail />,
          path: '/charts/total-supply',
          description: t('statistic.total_supply_description'),
        },
        {
          title: `${t('statistic.nominal_apc')}`,
          chart: <AnnualPercentageCompensationChart isThumbnail />,
          path: '/charts/nominal-apc',
          description: t('statistic.nominal_rpc_description'),
        },
        {
          title: `${t('nervos_dao.secondary_issuance')}`,
          chart: <SecondaryIssuanceChart isThumbnail />,
          path: '/charts/secondary-issuance',
          description: t('statistic.secondary_issuance_description'),
        },
        {
          title: `${t('statistic.inflation_rate')}`,
          chart: <InflationRateChart isThumbnail />,
          path: '/charts/inflation-rate',
          description: t('statistic.inflation_rate_description'),
        },
        {
          title: `${t('statistic.liquidity')}`,
          chart: <LiquidityChart isThumbnail />,
          path: '/charts/liquidity',
        },
      ],
    },
  ], [t])
}


const Charts = () => {
  const { t } = useTranslation()
  const chartsData = useChartsData()
  const [activeCategoryId, setActiveCategoryId] = useState<string>('category_activities') // 默认选中第一个分类
  const isMobile = useIsMobile()
  const headerRef = useRef<HTMLDivElement>(null)

  const scrollToCategory = useCallback((categoryId: string) => {
    const targetElement = document.getElementById(categoryId)
    if (!targetElement || !headerRef.current) return 
    const headerHeight = headerRef.current.offsetHeight
    const targetRect = targetElement.getBoundingClientRect()
    const targetTop = targetElement.offsetTop - headerHeight - 70

    window.scrollTo({
      top: targetTop,
      behavior: 'smooth'
    })
    // setActiveCategoryId(categoryId)
  }, [headerRef])

  // 滚动时自动更新选中的分类
  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return 
      const scrollPosition = window.scrollY + headerRef.current.offsetHeight + 70

      for (const category of chartsData) {
        const element = document.getElementById(category.id)
        if (!element) continue

        const elementTop = element.offsetTop 
        const elementBottom = elementTop + element.offsetHeight 

        // 若滚动位置在当前分类区间内，更新选中态
        if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
          setActiveCategoryId(category.id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() 

    return () => window.removeEventListener('scroll', handleScroll)
  }, [chartsData]) 

  return (
    <Content>
      <div className={`${styles.chartsContent} container bg-white md:p-[20px] my-[20px]! shadow-[0_2px_8px_0_rgba(0,0,0,0.1)]`}>
        <div ref={headerRef} className="sticky top-[64px] z-9 bg-white dark:bg-[#232323E5]">
          <div className="font-medium p-[16px] md:p-0 text-[20px]">{t("statistic.charts_title")}</div>
          {!isMobile && <Tabs
            type="underline"
            value={activeCategoryId}
            onValueChange={(value) => scrollToCategory(value)}
            className='w-[675px]'
          >
            <TabsList className='gap-[60px]! text-[18px]!'>
              {
                chartsData.map(chartData => (
                  <TabsTrigger className={styles.tabsTriggerStyle} value={chartData.id} key={chartData.id}>{chartData.category}</TabsTrigger>
                ))
              }
            </TabsList>
          </Tabs>}
        </div>

        {chartsData.map(chartData => (
          <div id={chartData.id} key={chartData.category} className="my-5 mx-[10px] md:mx-0 px-[10px] py-[20px] bg-[#F5F9FB] dark:bg-[#303030] rounded-[16px] md:px-[20px] md:pt-[12px] md:pb-[20px]">
            <div className="text-[16px] font-medium mb-[12px] text-[#232323] dark:text-[#FFFFFF]">{chartData.category}</div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-[20px]">
              {chartData.charts.map(chart => (
                <ChartCard chartData={chart} key={chart.title} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Content>
  )
}
export default Charts;

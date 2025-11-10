"use client"
import { useCallback, useState } from 'react'
import type { CallbackDataParams } from 'echarts/types/dist/shared'
import { useTranslation } from 'react-i18next'
import type { EChartsOption } from 'echarts'
import { useCurrentLanguage } from '@/utils/i18n'
import { DATA_ZOOM_CONFIG, assertIsArray, parseNumericAbbr } from '@/utils/chart'
import { shannonToCkb, shannonToCkbDecimal } from '@/utils/util'
import { localeNumberString } from '@/utils/number'
import { tooltipColor, tooltipWidth, SmartChartPage, type SmartChartPageProps } from '../../components/common'
import { type ChartItem } from '@/server/dataTypes'
import { useAdaptPCEllipsis } from '@/hooks'
import { type ChartColorConfig } from '@/constants/common'
import EllipsisMiddle from '@/components/EllipsisMiddle'
import styles from './addressRankingBalance.module.scss'
import Tooltip from '@/components/Tooltip'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Capacity from '@/components/Capacity';
import server from "@/server";
import { useChartTheme } from "@/hooks/useChartTheme";
const getAddressWithRanking = (statisticAddressBalanceRanks: ChartItem.AddressBalanceRank[], ranking?: string) => {
  if (!ranking) return ''
  const addressBalanceRank = statisticAddressBalanceRanks.find(rank => Number(rank.ranking) === Number(ranking))
  return addressBalanceRank ? addressBalanceRank.address : ''
}

const useOption = () => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
  const { axisLabelColor, axisLineColor, chartThemeColor } = useChartTheme()
  return (
    statisticAddressBalanceRanks: ChartItem.AddressBalanceRank[],
    chartColor: ChartColorConfig,
    isMobile: boolean,
    isThumbnail = false,
    getAdaptAddressText: (address: string) => string,
  ): EChartsOption => {
    const gridThumbnail = {
      left: '4%',
      right: '10%',
      top: '8%',
      bottom: '6%',
      containLabel: true,
    }
    const grid = {
      left: '5%',
      right: '3%',
      top: isMobile ? '3%' : '8%',
      bottom: '5%',
      containLabel: true,
    }
    return {
      color: chartThemeColor.colors,
      tooltip: !isThumbnail
        ? {
          trigger: 'axis',
          formatter: dataList => {
            assertIsArray(dataList)
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage === 'en' ? 60 : 35)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.address'))} ${getAdaptAddressText(
              getAddressWithRanking(statisticAddressBalanceRanks, dataList[0].name),
            )}</div>`
            result += `<div>${tooltipColor(chartThemeColor.colors[0])}${widthSpan(t('statistic.balance'))} \
            ${localeNumberString(dataList[0].data as number)} ${t('common.ckb_unit')}</div>`
            result += `<div>${tooltipColor(chartThemeColor.colors[0])}${widthSpan(t('statistic.rank'))} ${dataList[0].name
              }</div>`
            return result
          },
        }
        : undefined,
      grid: isThumbnail ? gridThumbnail : grid,
      dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
      xAxis: [
        {
          name: isMobile || isThumbnail ? '' : t('statistic.rank'),
          nameTextStyle: {
            color: axisLabelColor
          },
          nameLocation: 'middle',
          nameGap: 30,
          type: 'category',
          boundaryGap: false,
          data: statisticAddressBalanceRanks.map(data => data.ranking),
          axisLabel: {
            color: axisLabelColor
          },
          axisLine: {
            lineStyle: {
              color: axisLineColor 
            }
          },
          axisTick: {
            lineStyle: {
              color: axisLineColor 
            }
          }
        },
      ],
      yAxis: [
        {
          position: 'left',
          name: isMobile || isThumbnail ? '' : `${t('statistic.balance_ranking')} ${t('statistic.log')}`,
          nameTextStyle: {
            color: axisLabelColor
          },
          type: 'log',
          logBase: 10,
          scale: true,
          axisLine: {
            lineStyle: {
              color: axisLineColor 
            }
          },
          axisTick: {
            lineStyle: {
              color: axisLineColor 
            }
          },
          axisLabel: {
            color: axisLabelColor,
            formatter: (value: number) => `${parseNumericAbbr(value)}`,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: axisLineColor, 
              type: 'dashed',
            }
          }
        },
      ],
      series: [
        {
          name: t('statistic.balance_ranking'),
          type: 'bar',
          yAxisIndex: 0,
          barWidth: 8,
          data: statisticAddressBalanceRanks.map(data => shannonToCkb(data.balance)),
        },
      ],
    }
  }
}

const toCSV = (statisticAddressBalanceRanks: ChartItem.AddressBalanceRank[]) =>
  statisticAddressBalanceRanks
    ? statisticAddressBalanceRanks.map(data => [data.ranking, shannonToCkbDecimal(data.balance, 8)])
    : []

export const AddressBalanceRankChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const router = useRouter();
  const [t] = useTranslation()
  const [statisticAddressBalanceRanks, setStatisticAddressBalanceRanks] = useState<ChartItem.AddressBalanceRank[]>([])

  const handleClick = useCallback(
    (param: CallbackDataParams) => {
      if (param && param.name && statisticAddressBalanceRanks.length > 0) {
        const address = getAddressWithRanking(statisticAddressBalanceRanks, param.name)
        if (address) {
          // history.push(`/${language}/address/${address}`)
          router.push(`/address/${address}`)
        }
      }
    },
    [statisticAddressBalanceRanks],
  )

  const adaptPCEllipsis = useAdaptPCEllipsis(60)
  const parseOption = useOption()
  const getEChartOption: SmartChartPageProps<ChartItem.AddressBalanceRank>['getEChartOption'] = useCallback(
    (...args) => parseOption(...args, address => adaptPCEllipsis(address, 6)),
    [adaptPCEllipsis, parseOption],
  )

  if (isThumbnail) {
    return (
      <SmartChartPage
        title={t('statistic.top_50_holders')}
        description={t('statistic.balance_ranking_description')}
        isThumbnail={isThumbnail}
        chartProps={{ onClick: !isThumbnail ? handleClick : undefined }}
        // fetchData={explorerService.api.fetchStatisticAddressBalanceRank}
        fetchData={() => server.explorer("GET /statistics/{fieldName}", { fieldName: "address_balance_ranking" })}
        onFetched={setStatisticAddressBalanceRanks}
        getEChartOption={getEChartOption}
        toCSV={toCSV}
        queryKey="fetchStatisticAddressBalanceRank"
        typeKey="addressBalanceRanking"
      />
    )
  }

  return (
    <div className='container bg-[white] dark:bg-[#232323E5] dark:border-2 dark:border-[#282B2C] md:shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] rounded-[8px] p-[20px] my-[20px]!'>
      <SmartChartPage
        title={t('statistic.top_50_holders')}
        description={t('statistic.balance_ranking_description')}
        isThumbnail={isThumbnail}
        chartProps={{ onClick: !isThumbnail ? handleClick : undefined }}
        // fetchData={explorerService.api.fetchStatisticAddressBalanceRank}
        fetchData={() => server.explorer("GET /statistics/{fieldName}", { fieldName: "address_balance_ranking" })}
        onFetched={setStatisticAddressBalanceRanks}
        getEChartOption={getEChartOption}
        toCSV={toCSV}
        queryKey="fetchStatisticAddressBalanceRank"
        isNoDefaultStyle={true}
        typeKey="addressBalanceRanking"
      />
      <div className={`${styles.list} mt-[16px]`}>
        <table>
          <thead className='bg-[#F5F9FB] dark:bg-[#303030] h-[46px]'>
            <tr>
              <th>{t('statistic.rank')}</th>
              <th>{t('statistic.address')}</th>
              <th>{`${t('statistic.balance')}(CKB)`}</th>
            </tr>
          </thead>
          <tbody>
            {statisticAddressBalanceRanks.map(data => {
              const b = shannonToCkbDecimal(data.balance, 8)
              const r = Math.round(b)

              return (
                <tr key={data.address} className='h-[63px] border-b-[1px] border-[#EEEEEE] dark:border-[#4C4C4C] text-[16px]'>
                  <td className='font-menlo'>{data.ranking}</td>
                  <td className={styles.address}>
                    <Link href={`/address/${data.address}`}>
                      <EllipsisMiddle>{data.address}</EllipsisMiddle>
                    </Link>
                  </td>
                  <td className='h-full flex flex-row items-center gap-[2px] leading-[63px]'>
                    {r === b ? null : (
                      <Tooltip trigger={<span className={styles.roundSign}>~</span>} placement="top">
                        {t('statistic.rounded')}
                      </Tooltip>
                    )}
                    <div className="h-[63px] leading-[63px] font-menlo">{localeNumberString(r)}</div>
                    {/* <Capacity capacity={shannonToCkb(r)} textDirection="left" contentClassName="h-[63px] leading-[63px]" /> */}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AddressBalanceRankChart

"use client"
import { useState } from 'react'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import type { EChartsOption } from 'echarts'
import type { YAXisOption } from 'echarts/types/dist/shared'
import { useTranslation } from 'react-i18next'
import { getCustomDataZoomConfig, assertIsArray, handleAxis } from '@/utils/chart'
import { tooltipColor, tooltipWidth, SmartChartPage } from '../../components/common'
import { type ChartItem } from '@/server/dataTypes'
import { type ChartColorConfig, IS_MAINNET, MAX_CHART_COUNT } from '@/constants/common'
import styles from '../styles.module.scss'
import type { TFunction } from 'i18next'
import server from "@/server";
import { useChartTheme } from "@/hooks/useChartTheme";

const getOption =
  ({ type, t, language }: { type: 'log' | 'linear'; t: TFunction; language: string }) =>
    (
      statisticTransactionCounts: ChartItem.TransactionCount[],
      chartColor: ChartColorConfig,
      isMobile: boolean,

      isThumbnail = false,
    ): EChartsOption => {
      const { axisLabelColor, axisLineColor, chartThemeColor } = useChartTheme();

      const gridThumbnail = {
        left: '4%',
        right: '10%',
        top: '8%',
        bottom: '6%',
        containLabel: true,
      }
      const grid = {
        left: '3%',
        right: '3%',
        top: isMobile ? '3%' : '8%',
        bottom: isMobile ? '20%' : '12%',
        containLabel: true,
      }
      return {
        color: chartThemeColor.colors,
        tooltip: !isThumbnail
          ? {
            confine: true,
            trigger: 'axis',
            formatter: dataList => {
              assertIsArray(dataList)
              const widthSpan = (value: string) => tooltipWidth(value, language === 'en' ? 120 : 65)
              let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.date'))} ${(dataList[0].data as string[])[0]
                }</div>`
              result += `<div>${tooltipColor(chartThemeColor.colors[0])}${widthSpan(
                t('statistic.transaction_count'),
              )} ${handleAxis((dataList[0].data as string[])[1], 2)}</div>`
              return result
            },
          }
          : undefined,
        grid: isThumbnail ? gridThumbnail : grid,
        dataZoom: getCustomDataZoomConfig({isMobile, isThumbnail}),
        xAxis: [
          {
            // name: isMobile || isThumbnail ? '' : t('statistic.date'),
            nameTextStyle: {
              color: axisLabelColor
            },
            nameLocation: 'middle',
            nameGap: 30,
            type: 'category',
            boundaryGap: false,
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
            ...(type === 'log' ? { logBase: 10 } : { scale: true }),
            position: 'left',
            name:
              isMobile || isThumbnail
                ? ''
                : `${t('statistic.transaction_count')} ${t(type === 'log' ? 'statistic.log' : '')}`,
            nameTextStyle: {
              color: axisLabelColor
            },
            type: type === 'log' ? 'log' : 'value',
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
              formatter: (value: number) => handleAxis(new BigNumber(value)),
            } as YAXisOption['axisLabel'],
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
            name: t('statistic.transaction_count'),
            type: 'line',
            yAxisIndex: 0,
            symbol: isThumbnail ? 'none' : 'circle',
            symbolSize: 3,
          },
        ],
        dataset: {
          source: statisticTransactionCounts.map(data => [
            dayjs(+data.createdAtUnixtimestamp * 1000).format('YYYY/MM/DD'),
            new BigNumber(data.transactionsCount).toNumber(),
          ]),
        },
      }
    }

const toCSV = (statisticTransactionCounts: ChartItem.TransactionCount[]) =>
  statisticTransactionCounts
    ? statisticTransactionCounts.map(data => [data.createdAtUnixtimestamp, data.transactionsCount])
    : []

export const TransactionCountChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const { t, i18n } = useTranslation()
  const [scaleType, setScaleType] = useState<'linear' | 'log'>(IS_MAINNET ? 'log' : 'linear')
  const [selectedRange, setSelectedRange] = useState<number>(MAX_CHART_COUNT)

  const onScaleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScaleType(e.target.value as 'linear' | 'log')
  }

  const chart = (
    <SmartChartPage
      title={t('statistic.transaction_count')}
      isThumbnail={isThumbnail}
      // fetchData={explorerService.api.fetchStatisticTransactionCount}
      fetchData={() => server.explorer("GET /daily_statistics/{indicator}", { indicator: "transactions_count" })}
      getEChartOption={getOption({ type: scaleType, t, language: i18n.language })}
      toCSV={toCSV}
      queryKey="fetchStatisticTransactionCount"
    />
  )

  if (isThumbnail) return chart

  const SearchNode = <div className={styles.scaleSelector}>
    <input
      type="radio"
      id="linear"
      name="scaleType"
      value="linear"
      checked={scaleType === 'linear'}
      onChange={onScaleTypeChange}
    />
    <label htmlFor="linear" className={styles.radioLabel}>
      <span className={styles.radioItem}></span>
      <span>Linear Scale</span>
    </label>
    <input
      type="radio"
      id="log"
      name="scaleType"
      value="log"
      checked={scaleType === 'log'}
      onChange={onScaleTypeChange}
    />
    <label htmlFor="log" className={styles.radioLabel}>
      <span className={styles.radioItem}></span>
      <span>Log Scale</span>
    </label>
  </div>

  return (
    <div className={styles.container}>
      <SmartChartPage
        title={t('statistic.transaction_count')}
        isThumbnail={isThumbnail}
        // fetchData={explorerService.api.fetchStatisticTransactionCount}
        fetchData={() => server.explorer("GET /daily_statistics/{indicator}", { indicator: "transactions_count", limit: selectedRange })}
        getEChartOption={getOption({ type: scaleType, t, language: i18n.language })}
        toCSV={toCSV}
        queryKey="fetchStatisticTransactionCount"
        queryNode={SearchNode}
        showTimeRange={true}
        onSelectedRangeChange={setSelectedRange}
        selectedRange={selectedRange}
      />
    </div>
  )
}

export default TransactionCountChart

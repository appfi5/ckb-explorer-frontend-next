"use client"
import { useState } from 'react'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import type { EChartsOption } from 'echarts'
import type { YAXisOption } from 'echarts/types/dist/shared'
import { DATA_ZOOM_CONFIG, assertIsArray, handleAxis } from '@/utils/chart'
import { tooltipColor, tooltipWidth, SmartChartPage } from '../../components/common'
import { shannonToCkbDecimal } from '@/utils/util'
import { type ChartItem } from '@/server/dataTypes'
import { type ChartColorConfig, IS_MAINNET } from '@/constants/common'
import styles from '../styles.module.scss'
import type { TFunction } from 'i18next'
import server from "@/server";
import { useChartTheme } from "@/hooks/useChartTheme";

const getOption =
  ({ type, t, language }: { type: 'log' | 'linear'; t: TFunction; language: string }) =>
    (
      statisticTxFeeHistories: ChartItem.TransactionFee[],
      chartColor: ChartColorConfig,
      isMobile: boolean,

      isThumbnail = false,
    ): EChartsOption => {
      const { axisLabelColor, axisLineColor, chartThemeColor } = useChartTheme()

      const gridThumbnail = {
        left: '4%',
        right: '10%',
        top: '8%',
        bottom: '6%',
        containLabel: true,
      }
      const grid = {
        left: '6%',
        right:  isMobile ? '8%' : '3%',
        top: isMobile ? '4%' : '8%',
        bottom: '5%',
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
              const widthSpan = (value: string) => tooltipWidth(value, language === 'en' ? 145 : 90)
              let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.date'))} ${(dataList[0].data as string[])[0]
                }</div>`
              result += `<div>${tooltipColor(chartThemeColor.colors[0])}${widthSpan(t('statistic.tx_fee'))} ${handleAxis(
                (dataList[0].data as string[])[1],
              )}</div>`
              return result
            },
          }
          : undefined,
        grid: isThumbnail ? gridThumbnail : grid,
        dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
        xAxis: [
          {
            name: isMobile || isThumbnail ? '' : t('statistic.date'),
            nameLocation: 'middle',
            nameGap: 30,
            type: 'category',
            boundaryGap: false,
            splitLine: {
              show: false,
            },
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
            name: isMobile || isThumbnail ? '' : `${t('statistic.tx_fee')} ${t(type === 'log' ? 'statistic.log' : '')}`,
            nameTextStyle: {
              color: axisLabelColor
            },
            type: type === 'log' ? 'log' : 'value',
            axisLabel: {
              color: axisLabelColor,
              formatter: (value: number) => handleAxis(new BigNumber(value)),
            } as YAXisOption['axisLabel'],
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
            name: t('statistic.tx_fee'),
            type: 'line',
            yAxisIndex: 0,
            symbol: isThumbnail ? 'none' : 'circle',
            symbolSize: 3,
          },
        ],
        dataset: {
          source: statisticTxFeeHistories.map(d => [
            dayjs(+d.createdAtUnixtimestamp * 1000).format('YYYY/MM/DD'),
            shannonToCkbDecimal(d.totalTxFee, 4),
          ]),
        },
      }
    }

const toCSV = (statisticTxFeeHistories: ChartItem.TransactionFee[]) =>
  statisticTxFeeHistories
    ? statisticTxFeeHistories.map(data => [data.createdAtUnixtimestamp, shannonToCkbDecimal(data.totalTxFee, 8)])
    : []

export const TxFeeHistoryChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const { t, i18n } = useTranslation()
  const [scaleType, setScaleType] = useState<'linear' | 'log'>(IS_MAINNET ? 'log' : 'linear')

  const onScaleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScaleType(e.target.value as 'linear' | 'log')
  }

  const chart = (
    <SmartChartPage
      title={t('statistic.tx_fee_history')}
      description={t('statistic.tx_fee_description')}
      isThumbnail={isThumbnail}
      // fetchData={explorerService.api.fetchStatisticTxFeeHistory}
      fetchData={() => server.explorer("GET /daily_statistics/{indicator}", { indicator: "total_tx_fee" })}
      getEChartOption={getOption({ type: scaleType, t, language: i18n.language })}
      toCSV={toCSV}
      queryKey="fetchStatisticTxFeeHistory"
    />
  )

  if (isThumbnail) return chart;

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
      {/* {chart} */}
      <SmartChartPage
        title={t('statistic.tx_fee_history')}
        description={t('statistic.tx_fee_description')}
        isThumbnail={isThumbnail}
        // fetchData={explorerService.api.fetchStatisticTxFeeHistory}
        fetchData={() => server.explorer("GET /daily_statistics/{indicator}", { indicator: "total_tx_fee" })}
        getEChartOption={getOption({ type: scaleType, t, language: i18n.language })}
        toCSV={toCSV}
        queryKey="fetchStatisticTxFeeHistory"
        queryNode={SearchNode}
      />

    </div>
  )
}

export default TxFeeHistoryChart

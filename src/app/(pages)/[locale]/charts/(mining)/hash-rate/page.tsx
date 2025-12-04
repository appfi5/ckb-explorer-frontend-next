"use client"
import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import type { EChartsOption } from 'echarts'
import { DATA_ZOOM_CONFIG, assertIsArray, handleAxis } from '@/utils/chart'
import { handleHashRate } from '@/utils/number'
import { tooltipColor, tooltipWidth, SmartChartPage } from '../../components/common'
import { type ChartItem } from '@/server/dataTypes'
import { useCurrentLanguage } from '@/utils/i18n'
import { type ChartColorConfig } from '@/constants/common'
import server from '@/server'
import { useChartTheme } from "@/hooks/useChartTheme";

const useOption = (
  statisticHashRates: ChartItem.HashRate[],
  chartColor: ChartColorConfig,
  isMobile: boolean,

  isThumbnail = false,
): EChartsOption => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
  const { axisLabelColor, axisLineColor, chartThemeColor } = useChartTheme()

  const gridThumbnail = {
    left: '4%',
    right: '10%',
    top: '8%',
    bottom: '6%',
    containLabel: true,
  }
  const grid = {
    left: '3%',
    right: isMobile ? '10%' : '3%',
    top: '5%',
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
          const widthSpan = (value: string) => tooltipWidth(value, currentLanguage === 'en' ? 75 : 50)
          let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.date'))} ${(dataList[0].data as string[])[0]
            }</div>`
          result += `<div>${tooltipColor(chartThemeColor.colors[0])}${widthSpan(t('block.hash_rate'))} ${handleHashRate(
            Number(((dataList[0]).data as string[])[1])
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
        name: isMobile || isThumbnail ? '' : t('block.hash_rate'),
        nameTextStyle: {
          color: axisLabelColor
        },
        type: 'value',
        scale: true,
        axisLabel: {
          formatter: (value: number) => handleAxis(new BigNumber(value)),
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
        name: t('block.hash_rate'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
      },
    ],
    dataset: {
      source: statisticHashRates.map(data => [
        dayjs(+data.createdAtUnixtimestamp * 1000).format('YYYY/MM/DD'),
        new BigNumber(data.avgHashRate).toNumber() * 1000,
      ]),
      dimensions: ['timestamp', 'value'],
    },
  }
}

const toCSV = (statisticHashRates: ChartItem.HashRate[]) =>
  statisticHashRates ? statisticHashRates.map(data => [data.createdAtUnixtimestamp, data.avgHashRate]) : []

export const HashRateChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={t('block.hash_rate')}
      description={t('glossary.hash_rate')}
      isThumbnail={isThumbnail}
      // fetchData={explorerService.api.fetchStatisticHashRate}
      fetchData={async () => {
        const resList = await server.explorer("GET /daily_statistics/{indicator}", { indicator: "avg_hash_rate" });
        return resList?.reduce((oList, item) => {
          if(!+item.avgHashRate) return oList;
          const iItem = item as unknown as ChartItem.HashRate;
          item.avgHashRate = new BigNumber(item.avgHashRate).multipliedBy(1000).toString()
          oList.push(iItem)
          return oList;
        }, [] as ChartItem.HashRate[]) ?? [];
      }}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchStatisticHashRate"
    />
  )
}

export default HashRateChart

"use client"
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import type { EChartsOption } from 'echarts'
import type { CallbackDataParams } from 'echarts/types/dist/shared'
import { tooltipColor, tooltipWidth, SmartChartPage } from '../../components/common'
import { DATA_ZOOM_CONFIG, assertIsArray } from '@/utils/chart'
import { type ChartItem } from '@/server/dataTypes'
import { useCurrentLanguage } from '@/utils/i18n'
import { type ChartColorConfig } from '@/constants/common'
import server from "@/server";
import { useChartTheme } from "@/hooks/useChartTheme";

const useOption = (
  statisticUncleRates: ChartItem.UncleRate[],
  chartColor: ChartColorConfig,
  isMobile: boolean,

  isThumbnail = false,
): EChartsOption => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
  const { axisLabelColor, axisLineColor,chartThemeColor } = useChartTheme()

  const gridThumbnail = {
    left: '4%',
    right: '12%',
    top: '8%',
    bottom: '6%',
    containLabel: true,
  }
  const grid = {
    left: '3%',
    right: isMobile ? '12%' : '5%',
    top: '5%',
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
          const widthSpan = (value: string) => tooltipWidth(value, currentLanguage === 'en' ? 75 : 50)
          let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.date'))} ${(dataList[0].data as string[])[0]
            }</div>`
          result += `<div>${tooltipColor(chartThemeColor.colors[0])}${widthSpan(t('block.uncle_rate'))} ${(dataList[0].data as string[])[1]
            }%</div>`
          return result
        },
      }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    /* Selection starts from 1% because the uncle rate starts from 0 on launch */
    dataZoom: DATA_ZOOM_CONFIG.map(zoom => ({ ...zoom, show: !isThumbnail, start: 1 })),
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
        name: isMobile || isThumbnail ? '' : t('block.uncle_rate'),
        nameTextStyle: {
          color: axisLabelColor
        },
        type: 'value',
        scale: true,
        axisLabel: {
          formatter: (value: number) => `${value}%`,
          color: axisLabelColor,
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
        name: t('block.uncle_rate'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        markLine: {
          symbol: 'none',
          data: [
            {
              name: t('block.uncle_rate_target'),
              yAxis: 2.5,
            },
          ],
          label: {
            formatter: (params: CallbackDataParams) => `${params.value}%`,
            color: axisLabelColor
          },
        },
      },
    ],
    dataset: {
      source: statisticUncleRates.map(data => [
        dayjs(+data.createdAtUnixtimestamp * 1000).format('YYYY/MM/DD'),
        (+data.uncleRate * 100).toFixed(2),
      ]),
    },
  }
}

const toCSV = (statisticUncleRates: ChartItem.UncleRate[]) =>
  statisticUncleRates ? statisticUncleRates.map(data => [data.createdAtUnixtimestamp, data.uncleRate]) : []

export const UncleRateChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={t('block.uncle_rate')}
      description={t('statistic.uncle_rate_description')}
      isThumbnail={isThumbnail}
      // fetchData={explorerService.api.fetchStatisticUncleRate}
      fetchData={() => server.explorer("GET /daily_statistics/{indicator}", { indicator: "uncle_rate" })}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchStatisticUncleRate"
    />
  )
}

export default UncleRateChart

"use client"
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import type { EChartsOption } from 'echarts'
import { parseSimpleDate, parseSimpleDateNoSecond } from '@/utils/date'
import { tooltipColor, tooltipWidth, type SeriesItem, SmartChartPage } from '../../components/common'
import { localeNumberString } from '@/utils/number'
import { DATA_ZOOM_CONFIG, assertIsArray, assertSerialsItem } from '@/utils/chart'
import { type ChartItem } from '@/server/dataTypes'
import { useCurrentLanguage } from '@/utils/i18n'
import { type ChartColorConfig } from '@/constants/common'
import server from "@/server";
import { useChartTheme } from "@/hooks/useChartTheme";

const useOption = (
  statisticAverageBlockTimes: ChartItem.AverageBlockTime[],
  chartColor: ChartColorConfig,
  isMobile: boolean,
  isThumbnail = false,
): EChartsOption => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
  const { axisLabelColor, axisLineColor,chartThemeColor } = useChartTheme()

  const gridThumbnail = {
    left: '3%',
    right: '3%',
    top: '8%',
    bottom: '6%',
    containLabel: true,
  }
  const grid = {
    left: '2%',
    right: '3%',
    top: isMobile ? '25%' : '12%',
    bottom: '5%',
    containLabel: true,
  }

  const widthSpan = (value: string) => tooltipWidth(value, currentLanguage === 'en' ? 180 : 100)

  const parseTooltip = ({ seriesName, data, color }: SeriesItem & { data?: string[] }): string => {
    if (seriesName === t('statistic.daily_moving_average') && data?.[1]) {
      return `<div>${tooltipColor(color)}${widthSpan(t('statistic.daily_moving_average'))} ${localeNumberString(
        data[1],
      )}</div>`
    }
    if (seriesName === t('statistic.weekly_moving_average') && data?.[2]) {
      return `<div>${tooltipColor(color)}${widthSpan(t('statistic.weekly_moving_average'))} ${localeNumberString(
        data[2],
      )}</div>`
    }
    return ''
  }

  return {
    color: chartThemeColor.colors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: dataList => {
            assertIsArray(dataList)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.date'))} ${parseSimpleDateNoSecond(
              new Date((dataList[0].data as string[])[0]),
              '/',
              false,
            )}</div>`
            dataList.forEach(data => {
              assertSerialsItem(data)
              result += parseTooltip({ ...(data as SeriesItem) })
            })
            return result
          },
        }
      : undefined,
    legend: !isThumbnail
      ? {
          icon: 'roundRect',
          data: [
            {
              name: t('statistic.daily_moving_average'),
            },
            {
              name: t('statistic.weekly_moving_average'),
            },
          ],
          textStyle: {
            color: axisLabelColor
          },
          left: isMobile ? '0px' : 'center', 
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    /* Selection starts from 1% because the average block time is extremely high on launch */
    dataZoom: DATA_ZOOM_CONFIG.map(zoom => ({ ...zoom, show: !isThumbnail, start: 1 })),
    xAxis: [
      {
        name: isMobile || isThumbnail ? '' : t('statistic.date'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category', // TODO: use type: time
        boundaryGap: false,
        splitLine: {
          show: false,
        },
        axisLabel: {
          formatter: (value: string) => dayjs(value).format('YYYY/MM/DD'),
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
        name: isMobile || isThumbnail ? '' : t('statistic.daily_moving_average'),
        nameTextStyle: {
          align: 'left',
          color: axisLabelColor
        },
        type: 'value',
        scale: true,
        axisLabel: {
          formatter: (value: number) => localeNumberString(value),
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
      {
        position: 'right',
        splitLine: { show: false },
        name: isMobile || isThumbnail ? '' : t('statistic.weekly_moving_average'),
        type: 'value',
        scale: true,
        nameTextStyle: {
          align: 'right',
        },
        axisLine: {
          lineStyle: {
            color: chartThemeColor.colors[1],
          },
        },
        axisLabel: {
          formatter: (value: number) => localeNumberString(value),
        },
      },
    ],
    series: [
      {
        name: t('statistic.daily_moving_average'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        encode: {
          x: 'timestamp',
          y: 'daily',
        },
      },
      {
        name: t('statistic.weekly_moving_average'),
        type: 'line',
        yAxisIndex: 1,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        encode: {
          x: 'timestamp',
          y: 'weekly',
        },
      },
    ],
    dataset: {
      source: statisticAverageBlockTimes.map(data => [
        parseSimpleDate(data.timestamp * 1000),
        (Number(data.avgBlockTimeDaily) / 1000).toFixed(2),
        (Number(data.avgBlockTimeWeekly) / 1000).toFixed(2),
      ]),
      dimensions: ['timestamp', 'daily', 'weekly'],
    },
  }
}

const toCSV = (statisticAverageBlockTimes: ChartItem.AverageBlockTime[]) =>
  statisticAverageBlockTimes
    ? statisticAverageBlockTimes.map(data => [data.timestamp, data.avgBlockTimeDaily, data.avgBlockTimeWeekly])
    : []

export const AverageBlockTimeChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={t('statistic.average_block_time')}
      description={t('statistic.average_block_time_description')}
      isThumbnail={isThumbnail}
      // fetchData={explorerService.api.fetchStatisticAverageBlockTimes}
      fetchData={() => server.explorer("GET /distribution_data/{indicator}", { indicator: "average_block_time" })}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="averageBlockTime"
      typeKey="averageBlockTime"
    />
  )
}

export default AverageBlockTimeChart

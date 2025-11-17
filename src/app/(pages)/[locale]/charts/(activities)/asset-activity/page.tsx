"use client"
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import type { EChartsOption } from 'echarts'
import { parseSimpleDate, parseSimpleDateNoSecond } from '@/utils/date'
import { tooltipColor, tooltipWidth, type SeriesItem, SmartChartPage } from '../../components/common'
import { localeNumberString } from '@/utils/number'
import { DATA_ZOOM_CONFIG, assertIsArray, assertSerialsItem, handleAxis } from '@/utils/chart'
import { type ChartItem } from '@/server/dataTypes'
import { useCurrentLanguage } from '@/utils/i18n'
import { type ChartColorConfig } from '@/constants/common'
import { useChartTheme } from "@/hooks/useChartTheme";
import server from "@/server";

const toChangeData = (data: ChartItem.AssetActivity[]) =>
  data.sort((a, b) => {
    return (
      Number(a.createdAtUnixtimestamp) - Number(b.createdAtUnixtimestamp)
    );
  })

const useOption = (
  data: ChartItem.AssetActivity[],
  chartColor: ChartColorConfig,
  isMobile: boolean,
  isThumbnail = false,
): EChartsOption => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
  const { axisLabelColor, axisLineColor, chartThemeColor } = useChartTheme()
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
    top: isMobile ? '18%' : '10%',
    bottom: '5%',
    containLabel: true,
  }

  const widthSpan = (value: string) => tooltipWidth(value, currentLanguage === 'en' ? 180 : 100)

  const parseTooltip = ({ seriesName, data, color }: SeriesItem & { data?: string[] }): string => {
    if (seriesName === t('statistic.udt_holders') && data?.[1]) {
      return `<div>${tooltipColor(color)}${widthSpan(t('statistic.udt_holders'))} ${localeNumberString(data[1])}</div>`
    }
    if (seriesName === t('statistic.udt_txs') && data?.[2]) {
      return `<div>${tooltipColor(color)}${widthSpan(t('statistic.udt_txs'))} ${localeNumberString(data[2])}</div>`
    }
    return ''
  }

  return {
    color: chartThemeColor.colors,
    tooltip: !isThumbnail
      ? {
        confine: true,
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
            name: t('statistic.udt_holders'),
            textStyle: {
              color: axisLabelColor
            }
          },
          {
            name: t('statistic.udt_txs'),
            textStyle: {
              color: axisLabelColor
            }
          },
        ],
      }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    /* Selection starts from 1% because the average block time is extremely high on launch */
    dataZoom: DATA_ZOOM_CONFIG.map(zoom => ({ ...zoom, show: !isThumbnail, start: 1 })),
    xAxis: [
      {
        name: isMobile || isThumbnail ? '' : t('statistic.date'),
        nameTextStyle: {
          color: axisLabelColor
        },
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
        name: isMobile || isThumbnail ? '' : t('statistic.udt_holders'),
        nameTextStyle: {
          align: 'left',
          color: axisLabelColor
        },
        type: 'value',
        scale: true,
        axisLabel: {
          formatter: (value: number) => handleAxis(value),
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
        name: isMobile || isThumbnail ? '' : t('statistic.udt_txs'),
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
          formatter: (value: number) => handleAxis(value),
        },
      },
    ],
    series: [
      {
        name: t('statistic.udt_holders'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        encode: {
          x: 'timestamp',
          y: 'holders',
        },
      },
      {
        name: t('statistic.udt_txs'),
        type: 'line',
        yAxisIndex: 1,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        encode: {
          x: 'timestamp',
          y: 'txs',
        },
      },
    ],
    dataset: {
      source: toChangeData(data).map(item => [
        parseSimpleDate(+item.createdAtUnixtimestamp * 1000),
        item.holdersCount,
        item.ckbTransactionsCount,
      ]),
      dimensions: ['timestamp', 'holders', 'txs'],
    },
  }
}

const toCSV = (data: ChartItem.AssetActivity[]) =>
  (data && toChangeData(data))?.map(item => [item.createdAtUnixtimestamp, item.holdersCount, item.ckbTransactionsCount]) ?? []

export const AssetActivityChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()

  return (
    <SmartChartPage
      title={t('statistic.asset_activity')}
      description={t('statistic.asset_activity_description')}
      isThumbnail={isThumbnail}
      // fetchData={explorerService.api.fetchStatisticAssetActivity}
      fetchData={() => server.explorer("GET /udt_hourly_statistics")}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchAssetActivity"
    />
  )
}

export default AssetActivityChart

"use client"
import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import type { EChartsOption } from 'echarts'
import { DATA_ZOOM_CONFIG, assertIsArray, handleAxis } from '@/utils/chart'
import { tooltipColor, tooltipWidth, SmartChartPage } from '../../components/common'
import { type ChartItem } from '@/server/dataTypes'
import { useCurrentLanguage } from '@/utils/i18n'
import { type ChartColorConfig } from '@/constants/common'
import server from "@/server";
import { useChartTheme } from "@/hooks/useChartTheme";

const useOption = (
  statisticAddressCounts: ChartItem.AddressCount[],
  chartColor: ChartColorConfig,
  isMobile: boolean,
  isThumbnail = false,
): EChartsOption => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
  const { axisLabelColor, axisLineColor,chartThemeColor } = useChartTheme()

  const gridThumbnail = {
    left: '4%',
    right: '10%',
    top: '8%',
    bottom: '6%',
    containLabel: true,
  }
  const grid = {
    left: '3%',
    right: isMobile ? '9%' : '3%',
    top: isMobile ? '3%' : '8%',
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
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage === 'en' ? 155 : 110)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.date'))} ${
              (dataList[0].data as string[])[0]
            }</div>`
            result += `<div>${tooltipColor(chartThemeColor.colors[0])}\
          ${widthSpan(t('statistic.address_count'))} ${handleAxis((dataList[0].data as string[])[1], 2)}</div>`
            return result
          }, 
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
    xAxis: [
      {
        name: isMobile || isThumbnail ? '' : t('statistic.date'),
        nameTextStyle: {
          color: axisLabelColor
        },
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
        position: 'left',
        name: isMobile || isThumbnail ? '' : t('statistic.address_count'),
        nameTextStyle: {
          align: 'left',
          color: axisLabelColor
        },
        type: 'value',
        scale: true,
        axisLabel: {
          color: axisLabelColor,
          formatter: (value: number) => handleAxis(new BigNumber(value)),
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
        name: t('statistic.address_count'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
      },
    ],
    dataset: {
      source: statisticAddressCounts.map(data => [
        dayjs(+data.createdAtUnixtimestamp * 1000).format('YYYY/MM/DD'),
        new BigNumber(data.addressesCount).toNumber(),
      ]),
    },
  }
}

const toCSV = (statisticAddressCounts?: ChartItem.AddressCount[]) =>
  statisticAddressCounts ? statisticAddressCounts.map(data => [data.createdAtUnixtimestamp, data.addressesCount]) : []

export const AddressCountChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={t('statistic.address_count')}
      description={t('statistic.address_count_description')}
      isThumbnail={isThumbnail}
      // fetchData={explorerService.api.fetchStatisticAddressCount}
      fetchData={() => server.explorer("GET /daily_statistics/{indicator}", { indicator: "addresses_count" })}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchStatisticAddressCount"
    />
  )
}

export default AddressCountChart

"use client"
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import type { EChartsOption } from 'echarts'
import { useCurrentLanguage } from '@/utils/i18n'
import { tooltipColor, tooltipWidth, SmartChartPage } from '../../components/common'
import { DATA_ZOOM_CONFIG, assertIsArray } from '@/utils/chart'
import { type ChartItem } from '@/server/dataTypes'
import { type ChartColorConfig,MAX_CHART_COUNT } from '@/constants/common'
import server from "@/server";
import { useChartTheme } from "@/hooks/useChartTheme";

const useOption = (
  statisticCirculationRatios: ChartItem.CirculationRatio[],
  chartColor: ChartColorConfig,
  isMobile: boolean,
  isThumbnail = false,
): EChartsOption => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
  const { axisLabelColor, axisLineColor, chartThemeColor, dataZoomColor } = useChartTheme()
  const gridThumbnail = {
    left: '4%',
    right: '10%',
    top: '8%',
    bottom: '6%',
    containLabel: true,
  }
  const grid = {
    left: '3%',
    right: isMobile ? '8%' : '3%',
    top: '5%',
    bottom: '10%',
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
          const widthSpan = (value: string) => tooltipWidth(value, currentLanguage === 'en' ? 185 : 165)
          let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.date'))} ${(dataList[0].data as string[])[0]
            }</div>`
          if (dataList[0].data) {
            result += `<div>${tooltipColor(chartThemeColor.colors[0])}${widthSpan(t('statistic.circulation_ratio'))} ${(dataList[0].data as string[])[1]
              }%</div>`
          }
          return result
        },
      }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    // dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
    dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG.map(config => ({
      ...config,
      showDataShadow: false,
      backgroundColor: 'transparent',
      dataBackgroundColor: dataZoomColor[1],
      fillerColor: dataZoomColor[0],
      handleStyle: {
        color: dataZoomColor[1],
        borderColor: dataZoomColor[1]
      },
      bottom: 15,
      height: 40,
    })),
    xAxis: [
      {
        // name: isMobile || isThumbnail ? '' : t('statistic.date'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: false, axisLabel: {
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
        name: isMobile || isThumbnail ? '' : t('statistic.circulation_ratio'),
        nameTextStyle: {
          align: 'left',
        },
        type: 'value',
        scale: true,
        axisLine: {
          lineStyle: {
            color: chartThemeColor.colors[0],
          },
        },
        axisLabel: {
          formatter: (value: number) => `${value}%`,
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
        name: t('statistic.circulation_ratio'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
      },
    ],
    dataset: {
      source: statisticCirculationRatios.map(data => [
        dayjs(+data.createdAtUnixtimestamp * 1000).format('YYYY/MM/DD'),
        (+data.circulationRatio * 100).toFixed(2),
      ]),
    },
  }
}

const toCSV = (statisticCirculationRatios: ChartItem.CirculationRatio[]) =>
  statisticCirculationRatios
    ? statisticCirculationRatios.map(data => [data.createdAtUnixtimestamp, data.circulationRatio])
    : []

export const CirculationRatioChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  const [selectedRange, setSelectedRange] = useState<number>(MAX_CHART_COUNT)
  return (
    <SmartChartPage
      title={t('statistic.circulation_ratio')}
      description={t('statistic.deposit_to_circulation_ratio_description')}
      isThumbnail={isThumbnail}
      fetchData={() => server.explorer("GET /daily_statistics/{indicator}", { indicator: "circulation_ratio", limit: selectedRange })}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchStatisticCirculationRatio"
      showTimeRange={true}
      onSelectedRangeChange={setSelectedRange}
      selectedRange={selectedRange}
    />
  )
}

export default CirculationRatioChart

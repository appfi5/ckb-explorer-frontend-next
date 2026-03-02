"use client"
import { useState } from 'react'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import type { EChartsOption } from 'echarts'
import { assertIsArray, handleAxis, getCustomDataZoomConfig } from '@/utils/chart'
import { handleDifficulty } from '@/utils/number'
import { tooltipColor, tooltipWidth, SmartChartPage } from '../../components/common'
import { type ChartItem } from '@/server/dataTypes'
import { useCurrentLanguage } from '@/utils/i18n'
import { type ChartColorConfig, MAX_CHART_COUNT } from '@/constants/common'
import server from "@/server";
import { useChartTheme } from "@/hooks/useChartTheme";

const useOption = (
  statisticDifficulties: ChartItem.Difficulty[],
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
    right: isMobile ? '8%' : '3%',
    top: '5%',
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
          const widthSpan = (value: string) => tooltipWidth(value, currentLanguage === 'en' ? 70 : 35)
          let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.date'))} ${(dataList[0].data as string[])[0]
            }</div>`
          result += `<div>${tooltipColor(chartThemeColor.colors[0])}\
          ${widthSpan(t('block.difficulty'))} ${handleDifficulty((dataList[0].data as string[])[1])}</div>`
          return result
        },
      }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    dataZoom: getCustomDataZoomConfig({isMobile, isThumbnail}),
    xAxis: [
      {
        // name: isMobile || isThumbnail ? '' : t('statistic.date'),
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
        name: isMobile || isThumbnail ? '' : t('block.difficulty'),
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
        name: t('block.difficulty'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        encode: {
          x: 'timestamp',
          y: 'value',
        },
      },
    ],
    dataset: {
      source: statisticDifficulties.map(data => [
        dayjs(+data.createdAtUnixtimestamp * 1000).format('YYYY/MM/DD'),
        new BigNumber(data.avgDifficulty).toNumber(),
      ]),
      dimensions: ['timestamp', 'value'],
    },
  }
}

const toCSV = (statisticDifficulties: ChartItem.Difficulty[]) =>
  statisticDifficulties ? statisticDifficulties.map(data => [data.createdAtUnixtimestamp, data.avgDifficulty]) : []

export const DifficultyChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  const [selectedRange, setSelectedRange] = useState<number>(MAX_CHART_COUNT)
  return (
    <SmartChartPage
      title={t('block.difficulty')}
      isThumbnail={isThumbnail}
      // fetchData={explorerService.api.fetchStatisticDifficulty}      
      fetchData={() => server.explorer("GET /daily_statistics/{indicator}", { indicator: "avg_difficulty", limit: selectedRange })}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchStatisticDifficulty"
      showTimeRange={true}
      onSelectedRangeChange={setSelectedRange}
      selectedRange={selectedRange}
    />
  )
}

export default DifficultyChart

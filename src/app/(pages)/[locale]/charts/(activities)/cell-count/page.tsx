"use client"
import { useState } from 'react'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import type { EChartsOption } from 'echarts'
import { useCurrentLanguage } from '@/utils/i18n'
import {
  assertIsArray,
  assertSerialsDataIsStringArrayOf4,
  assertSerialsItem,
  handleAxis,
  getCustomDataZoomConfig
} from '@/utils/chart'
import { tooltipColor, tooltipWidth, type SeriesItem, SmartChartPage } from '../../components/common'
import { type ChartItem } from '@/server/dataTypes'
import { type ChartColorConfig, MAX_CHART_COUNT } from '@/constants/common'
import server from "@/server";
import { useChartTheme } from "@/hooks/useChartTheme";

const widthSpan = (value: string, currentLanguage: App.Language) =>
  tooltipWidth(value, currentLanguage === 'en' ? 125 : 80)

const useTooltip = () => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
  return ({ seriesName, data, color }: SeriesItem & { data: [string, string, string, string] }): string => {
    if (seriesName === t('statistic.dead_cell')) {
      return `<div>${tooltipColor(color)}${widthSpan(t('statistic.dead_cell'), currentLanguage)} ${handleAxis(
        data[2],
        2,
      )}</div>`
    }
    if (seriesName === t('statistic.all_cells')) {
      return `<div>${tooltipColor(color)}${widthSpan(t('statistic.all_cells'), currentLanguage)} ${handleAxis(
        data[1],
        2,
      )}</div>`
    }
    if (seriesName === t('statistic.live_cell')) {
      return `<div>${tooltipColor(color)}${widthSpan(t('statistic.live_cell'), currentLanguage)} ${handleAxis(
        data[3],
        2,
      )}</div>`
    }
    return ''
  }
}

const useOption = (
  statisticCellCounts: ChartItem.CellCount[],
  chartColor: ChartColorConfig,
  isMobile: boolean,

  isThumbnail = false,
): EChartsOption => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
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
    right: isMobile ? '7%' : '3%',
    top: isMobile ? '15%' : '8%',
    bottom: isMobile ? '20%' : '12%',
    containLabel: true,
  }
  const parseTooltip = useTooltip()
  const colors = chartThemeColor.cellCount
  return {
    color: colors,
    tooltip: !isThumbnail
      ? {
        confine: true,
        trigger: 'axis',
        formatter: dataList => {
          assertIsArray(dataList)
          let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.date'), currentLanguage)} ${(dataList[0].data as string[])[0]
            }</div>`
          dataList.forEach(data => {
            assertSerialsItem(data)
            assertSerialsDataIsStringArrayOf4(data)
            result += parseTooltip(data)
          })
          return result
        },
      }
      : undefined,
    legend: {
      icon: 'roundRect',
      data: isThumbnail
        ? []
        : [
          {
            name: t('statistic.all_cells'),
          },
          {
            name: t('statistic.live_cell'),
          },
          {
            name: t('statistic.dead_cell'),
          },
        ],
      selected: {
        [t('statistic.all_cells')]: true,
        [t('statistic.live_cell')]: true,
        [t('statistic.dead_cell')]: true,
      },
      textStyle: {
        color: axisLabelColor
      },
      orient: 'horizontal',
      left: 'center',
    },
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
        position: 'left',
        type: 'value',
        scale: true,
        axisLabel: {
          formatter: (value: number) => handleAxis(new BigNumber(value)),
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
        name: t('statistic.all_cells'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: `${colors[0]}80` }, // 80是十六进制透明度（32%）
              { offset: 1, color: `${colors[0]}00` }  // 00是完全透明
            ]
          }
        },
        lineStyle: {
          width: 4,
        },
      },
      {
        name: t('statistic.dead_cell'),
        type: 'line',
        stack: 'sum',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: `${colors[1]}80` },
              { offset: 1, color: `${colors[1]}00` }
            ]
          }
        },
      },
      {
        name: t('statistic.live_cell'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        stack: 'sum',
        symbolSize: 3,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: `${colors[2]}80` },
              { offset: 1, color: `${colors[2]}00` }
            ]
          }
        },
      },
    ],
    dataset: {
      source: statisticCellCounts.map(data => {
        const dead = new BigNumber(data.deadCellsCount);
        const live = new BigNumber(data.liveCellsCount);
        const all = dead.plus(live);

        return [
          dayjs(+data.createdAtUnixtimestamp * 1000).format('YYYY/MM/DD'),
          all.toFixed(0),
          dead.toFixed(0),
          live.toFixed(0),
        ]
      }),
      dimensions: ['timestamp', 'all', 'live', 'dead'],
    },
  }
}

const toCSV = (statisticCellCounts: ChartItem.CellCount[]) =>
  statisticCellCounts
    ? statisticCellCounts.map(data => [
      data.createdAtUnixtimestamp,
      data.allCellsCount,
      data.liveCellsCount,
      data.deadCellsCount,
    ])
    : []

export const CellCountChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  const [selectedRange, setSelectedRange] = useState<number>(MAX_CHART_COUNT)
  return (
    <SmartChartPage
      title={t('statistic.cell_count')}
      isThumbnail={isThumbnail}
      // fetchData={explorerService.api.fetchStatisticCellCount}
      fetchData={() => server.explorer("GET /daily_statistics/{indicator}", { indicator: "live_cells_count-dead_cells_count", limit: selectedRange })}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchStatisticCellCount"
      showTimeRange={true}
      onSelectedRangeChange={setSelectedRange}
      selectedRange={selectedRange}
    />
  )
}

export default CellCountChart

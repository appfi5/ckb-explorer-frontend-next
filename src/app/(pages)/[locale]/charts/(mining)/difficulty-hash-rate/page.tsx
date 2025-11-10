"use client"
import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import type { EChartsOption } from 'echarts'
import type { CallbackDataParams } from 'echarts/types/dist/shared'
import {
  DATA_ZOOM_CONFIG,
  assertIsArray,
  assertSerialsDataIsString,
  assertSerialsItem,
  handleAxis,
} from '@/utils/chart'
import { handleDifficulty, handleHashRate } from '@/utils/number'
import { tooltipColor, tooltipWidth, type SeriesItem, SmartChartPage } from '../../components/common'
import { type ChartItem } from '@/server/dataTypes'
import { useCurrentLanguage } from '@/utils/i18n'
import { type ChartColorConfig } from '@/constants/common'
import server from "@/server";
import { useChartTheme } from "@/hooks/useChartTheme";

const useOption = (
  statisticDifficultyHashRates: ChartItem.DifficultyHashRate[],
  chartColor: ChartColorConfig,
  isMobile: boolean,
  isThumbnail = false,
): EChartsOption => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
  const { axisLabelColor, axisLineColor,chartThemeColor } = useChartTheme()
  const gridThumbnail = {
    left: '4%',
    right: '4%',
    top: '8%',
    bottom: '6%',
    containLabel: true,
  }
  const grid = () => ({
    left: '3%',
    right: '3%',
    top: '12%',
    bottom: '5%',
    containLabel: true,
  })

  const widthSpan = (value: string) => tooltipWidth(value, currentLanguage === 'en' ? 70 : 50)

  const useTooltip = () => {
    return ({ seriesName, data, color }: SeriesItem & { data: string }): string => {
      if (seriesName === t('block.uncle_rate')) {
        return `<div>${tooltipColor(color)}${widthSpan(t('block.uncle_rate'))} ${data}%</div>`
      }
      if (seriesName === t('block.difficulty')) {
        return `<div>${tooltipColor(color)}${widthSpan(t('block.difficulty'))} ${handleDifficulty(data)}</div>`
      }
      if (seriesName?.startsWith(t('block.hash_rate'))) {
        return `<div>${tooltipColor(color)}${widthSpan(t('block.hash_rate'))} ${handleHashRate(data)}</div>`
      }
      return ''
    }
  }
  const parseTooltip = useTooltip()
  return {
    color: chartThemeColor.moreColors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: (dataList): string => {
            assertIsArray(dataList)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(t('block.epoch'))} ${dataList[0].name}</div>`
            dataList.forEach(data => {
              assertSerialsItem(data)
              assertSerialsDataIsString(data)
              result += parseTooltip(data)
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
              name: t('block.difficulty'),
            },
            {
              name: t('block.hash_rate_hps'),
            },
            {
              name: t('block.uncle_rate'),
            },
          ],
          textStyle: {
            color: axisLabelColor
          },
          left: isMobile ? '0px' : 'center', 
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid(),
    dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
    xAxis: [
      {
        name: isMobile || isThumbnail ? '' : t('block.epoch'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: false,
        data: statisticDifficultyHashRates.map(data => data.epochNumber),
        axisLabel: {
          formatter: (value: string) => value,
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
          align: 'left',
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
      {
        position: 'right',
        name: isMobile || isThumbnail ? '' : t('block.hash_rate_hps'),
        type: 'value',
        splitLine: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: chartThemeColor.moreColors[1],
          },
        },
        scale: true,
        axisLabel: {
          formatter: (value: number) => handleAxis(new BigNumber(value)),
        },
      },
      {
        position: 'right',
        type: 'value',
        max: 100,
        show: false,
        axisLabel: {
          formatter: () => '',
        },
      },
    ],
    series: [
      {
        name: t('block.difficulty'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticDifficultyHashRates.map(data => new BigNumber(data.difficulty).toString()),
      },
      {
        name: t('block.hash_rate_hps'),
        type: 'line',
        yAxisIndex: 1,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticDifficultyHashRates.map(data => new BigNumber(data.hashRate).toString()),
      },
      {
        name: t('block.uncle_rate'),
        type: 'line',
        smooth: true,
        yAxisIndex: 2,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        z: 0,
        markLine: isThumbnail
          ? undefined
          : {
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
        data: statisticDifficultyHashRates.map(data => (Number(data.uncleRate) * 100).toFixed(2)),
      },
    ],
  }
}

const toCSV = (statisticDifficultyHashRates: ChartItem.DifficultyHashRate[]) =>
  statisticDifficultyHashRates
    ? statisticDifficultyHashRates.map(data => [data.epochNumber, data.difficulty, data.hashRate, data.uncleRate])
    : []

export const DifficultyHashRateChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={`${t('block.difficulty')} & ${t('block.hash_rate')} & ${t('block.uncle_rate')}`}
      isThumbnail={isThumbnail}
      // fetchData={explorerService.api.fetchStatisticDifficultyHashRate}      
      fetchData={() => server.explorer("GET /epoch_statistics/{indicator}", { indicator: "difficulty-uncle_rate-hash_rate" })}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchStatisticDifficultyHashRate"
    />
  )
}

export default DifficultyHashRateChart

"use client"
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import type { EChartsOption } from 'echarts'
import type { ChartColorConfig } from '@/constants/common'
import { useCurrentLanguage } from '@/utils/i18n'
import {
  DATA_ZOOM_CONFIG,
  assertIsArray,
  assertSerialsItem,
  assertSerialsDataIsStringArrayOf10,
  handleAxis,
  variantColors,
} from '@/utils/chart'
import { tooltipColor, tooltipWidth, type SeriesItem, SmartChartPage } from '../../components/common'
import { type ChartItem } from '@/server/dataTypes'
import server from "@/server";
import { useChartTheme } from "@/hooks/useChartTheme";

const widthSpan = (value: string, currentLanguage: App.Language) =>
  tooltipWidth(value, currentLanguage === 'en' ? 125 : 80)

const useTooltip = () => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
  return ({
    seriesName,
    data,
    color,
  }: SeriesItem & {
    data: [string, string, string, string, string, string, string, string, string, string]
  }): string => {
    if (!data || !Array.isArray(data) || data.length < 10) {
      return ''
    }

    if (seriesName === t('statistic.24h')) {
      return `<div>${tooltipColor(color)}${widthSpan(t('statistic.24h'), currentLanguage)} ${handleAxis(data[1], 2)}%
      </div>`
    }

    if (seriesName === t('statistic.day_to_one_week')) {
      return `<div>${tooltipColor(color)}${widthSpan(t('statistic.day_to_one_week'), currentLanguage)} ${handleAxis(
        data[2],
        2,
      )}%</div>`
    }

    if (seriesName === t('statistic.one_week_to_one_month')) {
      return `<div>${tooltipColor(color)}${widthSpan(
        t('statistic.one_week_to_one_month'),
        currentLanguage,
      )} ${handleAxis(data[3], 2)}%</div>`
    }
    if (seriesName === t('statistic.one_month_to_three_months')) {
      return `<div>${tooltipColor(color)}${widthSpan(
        t('statistic.one_month_to_three_months'),
        currentLanguage,
      )} ${handleAxis(data[4], 2)}%</div>`
    }
    if (seriesName === t('statistic.three_months_to_six_months')) {
      return `<div>${tooltipColor(color)}${widthSpan(
        t('statistic.three_months_to_six_months'),
        currentLanguage,
      )} ${handleAxis(data[5], 2)}%</div>`
    }
    if (seriesName === t('statistic.six_months_to_one_year')) {
      return `<div>${tooltipColor(color)}${widthSpan(
        t('statistic.six_months_to_one_year'),
        currentLanguage,
      )} ${handleAxis(data[6], 2)}%</div>`
    }
    if (seriesName === t('statistic.one_year_to_three_years')) {
      return `<div>${tooltipColor(color)}${widthSpan(
        t('statistic.one_year_to_three_years'),
        currentLanguage,
      )} ${handleAxis(data[7], 2)}%</div>`
    }
    if (seriesName === t('statistic.over_three_years')) {
      return `<div>${tooltipColor(color)}${widthSpan(t('statistic.over_three_years'), currentLanguage)} ${handleAxis(
        data[8],
        2,
      )}%</div>`
    }
    if (seriesName === t('statistic.holder_count')) {
      return `<div>${tooltipColor(color)}${widthSpan(t('statistic.holder_count'), currentLanguage)} ${data[9]}</div>`
    }
    return ''
  }
}

const useOption = (
  statisticCkbHodlWaves: ChartItem.CkbHodlWaveHolderCount[],
  _: ChartColorConfig,
  isMobile: boolean,
  isThumbnail = false,
): EChartsOption => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
  const { axisLabelColor, axisLineColor, baseColors } = useChartTheme()

  // 数据过滤，确保数据有效
  const validData = statisticCkbHodlWaves.filter(data => 
    data.ckbHodlWave && 
    data.createdAtUnixtimestamp &&
    typeof data.holderCount !== 'undefined'
  )

  const gridThumbnail = {
    left: '4%',
    right: '10%',
    top: '8%',
    bottom: '6%',
    containLabel: true,
  }
  const grid = {
    left: '3%',
    right: '3%',
    top: '10%',
    bottom: '5%',
    containLabel: true,
  }
  const parseTooltip = useTooltip()
  const legends = [
    {
      name: t('statistic.24h'),
    },
    {
      name: t('statistic.day_to_one_week'),
    },
    {
      name: t('statistic.one_week_to_one_month'),
    },
    {
      name: t('statistic.one_month_to_three_months'),
    },
    {
      name: t('statistic.three_months_to_six_months'),
    },
    {
      name: t('statistic.six_months_to_one_year'),
    },
    {
      name: t('statistic.one_year_to_three_years'),
    },
    {
      name: t('statistic.over_three_years'),
    },
    {
      name: t('statistic.holder_count'),
    },
  ]
  const colors = variantColors(legends.length, baseColors)
  return {
    color: colors,
    tooltip: !isThumbnail
      ? {
        confine: true,
        trigger: 'axis',
        formatter: dataList => {
          if (!Array.isArray(dataList) || dataList.length === 0) {
            return ''
          }
          
          const firstData = dataList[0].data as string[]
          if (!firstData || !firstData[0]) {
            return ''
          }
          
          let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.date'), currentLanguage)}
          ${firstData[0]}</div>`
          
          dataList.forEach(data => {
            if (!data || !data.seriesName) {
              return
            }
            const seriesData = data.data as string[]
            if (!Array.isArray(seriesData) || seriesData.length < 10) {
              return
            }
            
            result += parseTooltip(data as any)
          })
          return result
        },
      }
      : undefined,
    legend: {
      data: isThumbnail ? [] : legends,
      textStyle: {
        color: axisLabelColor
      },
      width: isMobile ? 'auto' : '80%',
      show: !isMobile
    },
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
        type: 'value',
        max: 100,
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
      {
        position: 'right',
        type: 'value',
        name: 'Holder count',
        axisLine: {
          lineStyle: {
            color: colors[1],
          },
          onZero: false,
        },
      },
    ],
    series: [
      {
        name: t('statistic.24h'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        stack: 'sum',
        areaStyle: {
          color: colors[0],
        },
        lineStyle: { width: 0 },
      },
      {
        name: t('statistic.day_to_one_week'),
        type: 'line',
        stack: 'sum',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        areaStyle: {
          color: colors[1],
        },
        lineStyle: { width: 0 },
      },
      {
        name: t('statistic.one_week_to_one_month'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        stack: 'sum',
        symbolSize: 3,
        areaStyle: {
          color: colors[2],
        },
        lineStyle: { width: 0 },
      },
      {
        name: t('statistic.one_month_to_three_months'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        stack: 'sum',
        symbolSize: 3,
        areaStyle: {
          color: colors[3],
        },
        lineStyle: { width: 0 },
      },
      {
        name: t('statistic.three_months_to_six_months'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        stack: 'sum',
        symbolSize: 3,
        areaStyle: {
          color: colors[4],
        },
        lineStyle: { width: 0 },
      },
      {
        name: t('statistic.six_months_to_one_year'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        stack: 'sum',
        symbolSize: 3,
        areaStyle: {
          color: colors[5],
        },
        lineStyle: { width: 0 },
      },
      {
        name: t('statistic.one_year_to_three_years'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        stack: 'sum',
        symbolSize: 3,
        areaStyle: {
          color: colors[6],
        },
        lineStyle: { width: 0 },
      },
      {
        name: t('statistic.over_three_years'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        stack: 'sum',
        symbolSize: 3,
        areaStyle: {
          color: colors[7],
        },
        lineStyle: { width: 0 },
      },
      {
        name: t('statistic.holder_count'),
        type: 'line',
        yAxisIndex: 1,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        lineStyle: {
          color: colors[8],
        },
      },
    ],
    dataset: {
      source: validData.map(data => [
        dayjs(Number(data.createdAtUnixtimestamp) * 1000).format('MM/DD/YYYY'),
        ((data.ckbHodlWave.latestDay / data.ckbHodlWave.totalSupply) * 100).toFixed(2),
        ((data.ckbHodlWave.dayToOneWeek / data.ckbHodlWave.totalSupply) * 100).toFixed(2),
        ((data.ckbHodlWave.oneWeekToOneMonth / data.ckbHodlWave.totalSupply) * 100).toFixed(2),
        ((data.ckbHodlWave.oneMonthToThreeMonths / data.ckbHodlWave.totalSupply) * 100).toFixed(2),
        ((data.ckbHodlWave.threeMonthsToSixMonths / data.ckbHodlWave.totalSupply) * 100).toFixed(2),
        ((data.ckbHodlWave.sixMonthsToOneYear / data.ckbHodlWave.totalSupply) * 100).toFixed(2),
        ((data.ckbHodlWave.oneYearToThreeYears / data.ckbHodlWave.totalSupply) * 100).toFixed(2),
        ((data.ckbHodlWave.overThreeYears / data.ckbHodlWave.totalSupply) * 100).toFixed(2),
        data.holderCount,
      ]),
      dimensions: ['timestamp', '24h', '1d-1w', '1w-3m', '1m-3m', '3m-6m', '6m-1y', '1y-3y', '> 3y', 'holder_count'],
    },
  }
}

const toCSV = (statisticCkbHodlWaves: ChartItem.CkbHodlWaveHolderCount[]) =>
  statisticCkbHodlWaves
    ? statisticCkbHodlWaves.map(data => [
      data.createdAtUnixtimestamp,
      data.ckbHodlWave.latestDay,
      data.ckbHodlWave.dayToOneWeek,
      data.ckbHodlWave.oneWeekToOneMonth,
      data.ckbHodlWave.threeMonthsToSixMonths,
      data.ckbHodlWave.sixMonthsToOneYear,
      data.ckbHodlWave.oneYearToThreeYears,
      data.ckbHodlWave.overThreeYears,
      data.holderCount,
    ])
    : []

export const CkbHodlWaveChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={t('statistic.ckb_hodl_wave')}
      isThumbnail={isThumbnail}
      // fetchData={explorerService.api.fetchStatisticCkbHodlWave}
      fetchData={() => server.explorer("GET /daily_statistics/{indicator}", { indicator: "ckb_hodl_wave-holder_count" })}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchStatisticCkbHodlWave"
    />
  )
}

export default CkbHodlWaveChart

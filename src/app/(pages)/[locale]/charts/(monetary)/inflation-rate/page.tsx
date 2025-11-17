"use client"
import { useTranslation } from 'react-i18next'
import type { EChartsOption } from 'echarts'
import { useCurrentLanguage } from '@/utils/i18n'
import { tooltipColor, tooltipWidth, type SeriesItem, SmartChartPage } from '../../components/common'
import { DATA_ZOOM_CONFIG, assertSerialsDataIsString, assertIsArray, assertSerialsItem } from '@/utils/chart'
import { type ChartItem } from '@/server/dataTypes'
import { type ChartColorConfig } from '@/constants/common'
import server from "@/server";
import { useChartTheme } from "@/hooks/useChartTheme";

const toChangeData = (data: any[]): { nominalApc: string[]; nominalInflationRate: string[]; realInflationRate: string[] }[] => {
  const { nominalApc, nominalInflationRate, realInflationRate } = data.length > 0 ? data[0] : { nominalApc: [], nominalInflationRate: [], realInflationRate: [] };  
  const statisticInflationRates = [];
      for (let i = 0; i < nominalApc.length; i++) {
        if (i % 6 === 0 || i === nominalApc.length - 1) {
          statisticInflationRates.push({
            year: i % 6 === 0 ? Math.floor(i / 6) * 0.5 : 50,
            nominalApc: nominalApc[i],
            nominalInflationRate: nominalInflationRate[i],
            realInflationRate: realInflationRate[i],
          });
        }
      }
      return statisticInflationRates;
}
const useOption = (
  statisticInflationRates: ChartItem.InflationRate[],
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
    left: '4%',
    right: '3%',
    top: '8%',
    bottom: '5%',
    containLabel: true,
  }

  const widthSpan = (value: string) => tooltipWidth(value, currentLanguage === 'en' ? 220 : 80)

  const useTooltip = () => {
    return ({ seriesName, data, color }: SeriesItem & { data: string }): string => {
      if (seriesName === t('statistic.nominal_inflation_rate')) {
        return `<div>${tooltipColor(color)}${widthSpan(t('statistic.nominal_inflation_rate'))} ${data}%</div>`
      }
      if (seriesName === t('statistic.nominal_apc')) {
        return `<div>${tooltipColor(color)}${widthSpan(t('statistic.nominal_apc'))} ${data}%</div>`
      }
      if (seriesName === t('statistic.real_inflation_rate')) {
        return `<div>${tooltipColor(color)}${widthSpan(t('statistic.real_inflation_rate'))} ${data}%</div>`
      }
      return ''
    }
  }
  const parseTooltip = useTooltip()
  return {
    color: chartThemeColor.moreColors,
    tooltip: !isThumbnail
      ? {
        confine: true,
        trigger: 'axis',
        formatter: dataList => {
          assertIsArray(dataList)
          let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.year'))} ${dataList[0].name}</div>`
          dataList.forEach(data => {
            assertSerialsItem(data)
            assertSerialsDataIsString(data)
            result += parseTooltip(data)
          })
          return result
        },
      }
      : undefined,
    legend: {
      show: !isMobile,
      icon: 'roundRect',
      data: isThumbnail
        ? []
        : [
          {
            name: t('statistic.real_inflation_rate'),
            textStyle: {
              color: axisLabelColor
            }
          },
          {
            name: t('statistic.nominal_apc'),
            textStyle: {
              color: axisLabelColor
            }
          },
          {
            name: t('statistic.nominal_inflation_rate'),
            textStyle: {
              color: axisLabelColor
            }
          },
        ],
    },
    grid: isThumbnail ? gridThumbnail : grid,
    dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
    xAxis: [
      {
        name: isMobile || isThumbnail ? '' : t('statistic.year'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: false,
        data: toChangeData(statisticInflationRates).map(data => data.year),
        axisLabel: {
          interval: isMobile || isThumbnail ? 11 : 3,
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
        type: 'value',
        axisLine: {
          lineStyle: {
            color: chartThemeColor.moreColors[0],
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
        name: t('statistic.nominal_inflation_rate'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        lineStyle: {
          type: 'dashed',
        },
        data: toChangeData(statisticInflationRates).map(data => Number(data.nominalInflationRate).toFixed(4)),
      },
      {
        name: t('statistic.nominal_apc'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        lineStyle: {
          type: 'dashed',
        },
        data: toChangeData(statisticInflationRates).map(data => Number(data.nominalApc).toFixed(4)),
      },
      {
        name: t('statistic.real_inflation_rate'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        lineStyle: {
          type: 'solid',
          width: 3,
        },
        data: toChangeData(statisticInflationRates).map(data => Number(data.realInflationRate).toFixed(4)),
      },
    ],
  }
}

const toCSV = (statisticInflationRates: ChartItem.InflationRate[]) =>
  statisticInflationRates
    ? toChangeData(statisticInflationRates).map(data => [
      data.year,
      Number(data.nominalApc).toFixed(4),
      Number(data.nominalInflationRate).toFixed(4),
      Number(data.realInflationRate).toFixed(4),
    ])
    : []

export const InflationRateChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={t('statistic.inflation_rate')}
      description={t('statistic.inflation_rate_description')}
      isThumbnail={isThumbnail}
      fetchData={() => server.explorer("GET /monetary_data/{indicator}", { indicator: "nominal_apc50-nominal_inflation_rate-real_inflation_rate" })}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchStatisticInflationRate"
    />
  )
}

export default InflationRateChart

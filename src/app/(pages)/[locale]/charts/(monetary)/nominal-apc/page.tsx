"use client"
import { useTranslation } from 'react-i18next'
import type { EChartsOption } from 'echarts'
import { useCurrentLanguage } from '@/utils/i18n'
import { tooltipColor, tooltipWidth, SmartChartPage } from '../../components/common'
import { getCustomDataZoomConfig, assertIsArray } from '@/utils/chart'
import { type ChartItem } from '@/server/dataTypes'
import { type ChartColorConfig } from '@/constants/common'
import server from "@/server";
import { useChartTheme } from "@/hooks/useChartTheme";

const processNominalApc = (data: any): { year: number; apc: string }[] => {
  const { nominalApc } = data.length > 0 ? data[0] : {};
  if (!Array.isArray(nominalApc) || nominalApc.length === 0) {
    return [];
  }

  return nominalApc
    .filter((_apc, index) => index % 3 === 0 || index === nominalApc.length - 1)
    .map((apc, filteredIndex) => ({
      year: 0.25 * filteredIndex,
      apc,
    }));
}

const useOption = (
  statisticAnnualPercentageCompensations: ChartItem.AnnualPercentageCompensation[],
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
    left: '2%',
    right:  isMobile ? '8%' : '3%',
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
          const widthSpan = (value: string) => tooltipWidth(value, currentLanguage === 'en' ? 220 : 80)
          let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.year'))} ${(dataList[0].data as string[])[0]
            }</div>`
          result += `<div>${tooltipColor(chartThemeColor.colors[0])}${widthSpan(t('statistic.nominal_apc'))} ${(dataList[0].data as string[])[1]
            }%</div>`
          return result
        },
      }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    dataZoom: getCustomDataZoomConfig({isMobile, isThumbnail}),
    xAxis: [
      {
        // name: isMobile || isThumbnail ? '' : t('statistic.year'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          interval: isMobile || isThumbnail ? 7 : 3,
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
        name: t('statistic.nominal_apc'),
        type: 'value',
        nameTextStyle: {
          align: 'left',
        },
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
        name: t('statistic.nominal_apc'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        stack: 'sum',
      },
    ],
    dataset: {
      source: processNominalApc(statisticAnnualPercentageCompensations).map(data => [data.year, (+data.apc).toFixed(2)]),
    },
  }
}

const toCSV = (statisticAnnualPercentageCompensations: ChartItem.AnnualPercentageCompensation[]) =>
  statisticAnnualPercentageCompensations
    ? processNominalApc(statisticAnnualPercentageCompensations).map(data => [data.year, (Number(data.apc) / 100).toFixed(4)])
    : []

export const AnnualPercentageCompensationChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={t('statistic.nominal_apc')}
      description={t('statistic.nominal_rpc_description')}
      isThumbnail={isThumbnail}
      fetchData={() => server.explorer("GET /monetary_data/{indicator}", { indicator: "nominal_apc" })}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchStatisticAnnualPercentageCompensation"
    />
  )
}

export default AnnualPercentageCompensationChart

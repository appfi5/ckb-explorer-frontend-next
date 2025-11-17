"use client"
import { useTranslation } from 'react-i18next'
import type { EChartsOption } from 'echarts'
import { DATA_ZOOM_CONFIG, assertIsArray } from '@/utils/chart'
import { tooltipColor, tooltipWidth, SmartChartPage } from '../../components/common'
import { type ChartItem } from '@/server/dataTypes'
import { useCurrentLanguage } from '@/utils/i18n'
import { type ChartColorConfig } from '@/constants/common'
import server from "@/server";
import { useChartTheme } from "@/hooks/useChartTheme";


const toChangeData = (dataDistributions: ChartItem.BlockTimeDistribution[]) => {
  return dataDistributions.map((distribution: any) => {
    const [time, ratio] = distribution;
    return {
      time,
      ratio: (ratio / 50000) * 100,
    };
  })
}

const useOption = (
  statisticBlockTimeDistributions: ChartItem.BlockTimeDistribution[],
  chartColor: ChartColorConfig,
  isMobile: boolean,
  isThumbnail = false,
): EChartsOption => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
  const { axisLabelColor, axisLineColor,chartThemeColor } = useChartTheme()
  const statisticData = toChangeData(statisticBlockTimeDistributions);

  const gridThumbnail = {
    left: '4%',
    right: '10%',
    top: '8%',
    bottom: '6%',
    containLabel: true,
  }
  const grid = {
    left: '5%',
    right: isMobile ? '5%' : '3%',
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
          const widthSpan = (value: string) => tooltipWidth(value, currentLanguage === 'en' ? 80 : 80)
          let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.time'))} ${dataList[0].name}</div>`
          result += `<div>${tooltipColor(chartThemeColor.colors[0])}${widthSpan(t('statistic.block_count'))} ${dataList[0].data
            }%</div>`
          return result
        },
      }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
    xAxis: [
      {
        name: isMobile || isThumbnail ? '' : t('statistic.time'),
        nameLocation: 'middle',
        nameGap: 30,
        data: statisticData.map(data => data.time),
        axisLabel: {
          interval: 49,
          formatter: (value: string) => Number(value).toFixed(0),
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
        name: isMobile || isThumbnail ? '' : t('statistic.block_count'),
        nameTextStyle: {
          color: axisLabelColor
        },
        type: 'value',
        scale: true,
        axisLabel: {
          formatter: (value: number) => `${value}%`,
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
        name: t('statistic.block_count'),
        type: 'line',
        yAxisIndex: 0,
        areaStyle: {
          color: chartThemeColor.areaColor,
        },
        data: statisticData.map(data => (Number(data.ratio)).toFixed(3)),
      },
    ],
  }
}

const toCSV = (statisticBlockTimeDistributions: ChartItem.BlockTimeDistribution[]) =>
  statisticBlockTimeDistributions
    ? toChangeData(statisticBlockTimeDistributions).map(data => [data.time, Number(data.ratio).toFixed(4)])
    : []

export const BlockTimeDistributionChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={t('statistic.block_time_distribution_more')}
      description={t('statistic.block_time_distribution_description')}
      isThumbnail={isThumbnail}
      // fetchData={explorerService.api.fetchStatisticBlockTimeDistribution}
      fetchData={() => server.explorer("GET /distribution_data/{indicator}", { indicator: "block_time_distribution" })}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchStatisticBlockTimeDistribution"
      typeKey="blockTimeDistribution"
    />
  )
}

export default BlockTimeDistributionChart

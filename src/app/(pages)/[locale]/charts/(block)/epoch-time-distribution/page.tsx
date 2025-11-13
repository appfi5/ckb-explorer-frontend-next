"use client"
import { useTranslation } from 'react-i18next'
import type { EChartsOption } from 'echarts'
import { tooltipColor, tooltipWidth, SmartChartPage } from '../../components/common'
import { localeNumberString } from '@/utils/number'
import { parseHourFromMinute } from '@/utils/date'
import { DATA_ZOOM_CONFIG, assertIsArray } from '@/utils/chart'
import { type ChartItem } from '@/server/dataTypes'
import { useCurrentLanguage } from '@/utils/i18n'
import { type ChartColorConfig } from '@/constants/common'
import server from "@/server";
import { useChartTheme } from "@/hooks/useChartTheme";

const toChangeData = (dataDistributions: ChartItem.EpochTimeDistribution[]) => {
  return dataDistributions.map((distribution: any) => {
    const [time, epoch] = distribution;
    return {
      time,
      epoch,
    };
  })
}

const useOption = (
  statisticEpochTimeDistributions: ChartItem.EpochTimeDistribution[],
  chartColor: ChartColorConfig,
  isMobile: boolean,

  isThumbnail = false,
): EChartsOption => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
  const { axisLabelColor, axisLineColor, chartThemeColor } = useChartTheme()
  const statisticEpochTimeData = toChangeData(statisticEpochTimeDistributions);

  const gridThumbnail = {
    left: '4%',
    right: '10%',
    top: '8%',
    bottom: '6%',
    containLabel: true,
  }
  const grid = {
    left: '5%',
    right: '3%',
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
          let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.time_hour'))} ${parseHourFromMinute(
            dataList[0].name ?? '0',
          )}</div>`
          result += `\
            <div>${tooltipColor(chartThemeColor.colors[0])}\
            ${widthSpan(t('statistic.epochs'))} \
            ${localeNumberString((dataList[0].data as string[])[0])}</div>`
          return result
        },
      }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
    xAxis: [
      {
        name: isMobile || isThumbnail ? '' : t('statistic.time_hour'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: true,
        data: statisticEpochTimeData.map(data => data.time),
        axisLabel: {
          formatter: (value: string) => parseHourFromMinute(value).toString(),
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
        name: isMobile || isThumbnail ? '' : t('statistic.epochs'),
        nameTextStyle: {
          color: axisLabelColor
        },
        type: 'value',
        scale: true,
        axisLabel: {
          formatter: (value: number) => localeNumberString(value),
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
        name: t('statistic.epochs'),
        type: 'bar',
        yAxisIndex: 0,
        barWidth: isMobile || isThumbnail ? 2 : 5,
        data: statisticEpochTimeData.map(data => data.epoch),
      },
    ],
  }
}

const toCSV = (statisticEpochTimeDistributions: ChartItem.EpochTimeDistribution[]) =>
  statisticEpochTimeDistributions
    ? toChangeData(statisticEpochTimeDistributions).map(data => [parseHourFromMinute(data.time), data.epoch])
    : []

export const EpochTimeDistributionChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={t('statistic.epoch_time_distribution_more')}
      description={t('statistic.epoch_time_distribution_description')}
      isThumbnail={isThumbnail}
      // fetchData={explorerService.api.fetchStatisticEpochTimeDistribution}
      fetchData={() => server.explorer("GET /distribution_data/{indicator}", { indicator: "epoch_time_distribution" })}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchStatisticEpochTimeDistribution"
      typeKey="epochTimeDistribution"
    />
  )
}

export default EpochTimeDistributionChart

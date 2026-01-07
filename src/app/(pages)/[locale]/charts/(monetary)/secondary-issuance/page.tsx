"use client"
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import type { EChartsOption } from 'echarts'
import { useCurrentLanguage } from '@/utils/i18n'
import { tooltipColor, tooltipWidth, type SeriesItem, SmartChartPage } from '../../components/common'
import {
  DATA_ZOOM_CONFIG,
  assertIsArray,
  assertSerialsDataIsStringArrayOf4,
  assertSerialsItem,
} from '@/utils/chart'
import { type ChartItem } from '@/server/dataTypes'
import { type ChartColorConfig, MAX_CHART_COUNT } from '@/constants/common'
import server from "@/server";
import { useChartTheme } from "@/hooks/useChartTheme";

const widthSpan = (value: string, currentLanguage: App.Language) =>
  tooltipWidth(value, currentLanguage === 'en' ? 155 : 70)

const useTooltip = () => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()

  return ({ seriesName, data, color }: SeriesItem & { data: [string, string, string, string] }): string => {
    if (seriesName === t('nervos_dao.deposit_compensation')) {
      return `<div>${tooltipColor(color)}${widthSpan(t('nervos_dao.deposit_compensation'), currentLanguage)} ${data[3]
        }%</div>`
    }
    if (seriesName === t('nervos_dao.mining_reward')) {
      return `<div>${tooltipColor(color)}${widthSpan(t('nervos_dao.mining_reward'), currentLanguage)} ${data[2]}%</div>`
    }
    if (seriesName === t('nervos_dao.burnt')) {
      return `<div>${tooltipColor(color)}${widthSpan(t('nervos_dao.burnt'), currentLanguage)} ${data[1]}%</div>`
    }
    return ''
  }
}

const toChangeData = (
  statisticSecondaryIssuance: ChartItem.SecondaryIssuance[],
): ChartItem.SecondaryIssuance[] =>
  statisticSecondaryIssuance.map((item: any) => {
    const { depositCompensation, miningReward, treasuryAmount } = item;
    const sum =
      Number(treasuryAmount) +
      Number(miningReward) +
      Number(depositCompensation);
    const treasuryAmountPercent = Number(
      ((Number(treasuryAmount) / sum) * 100).toFixed(2),
    );
    const miningRewardPercent = Number(
      ((Number(miningReward) / sum) * 100).toFixed(2),
    );
    const depositCompensationPercent = (
      100 -
      treasuryAmountPercent -
      miningRewardPercent
    ).toFixed(2);
    return {
      ...item,
      treasuryAmount: treasuryAmountPercent.toString(),
      miningReward: miningRewardPercent.toString(),
      depositCompensation: depositCompensationPercent,
    };
  })

const useOption = (
  statisticSecondaryIssuance: ChartItem.SecondaryIssuance[],
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
    left: '4%',
    right: isMobile ? '8%' : '3%',
    top: '8%',
    bottom: '10%',
    containLabel: true,
  }
  const parseTooltip = useTooltip()
  return {
    color: chartThemeColor.secondaryIssuanceColors,
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
      show: !isMobile,
      icon: 'roundRect',
      data: isThumbnail
        ? []
        : [
          {
            name: t('nervos_dao.burnt'),
            textStyle: {
              color: axisLabelColor
            }
          },
          {
            name: t('nervos_dao.mining_reward'),
            textStyle: {
              color: axisLabelColor
            }
          },
          {
            name: t('nervos_dao.deposit_compensation'),
            textStyle: {
              color: axisLabelColor
            }
          },
        ],
    },
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
        name: t('nervos_dao.burnt'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        stack: 'sum',
        areaStyle: {},
        encode: {
          x: 'timestamp',
          y: 'treasury',
        },
      },
      {
        name: t('nervos_dao.mining_reward'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        stack: 'sum',
        areaStyle: {},
        encode: {
          x: 'timestamp',
          y: 'reward',
        },
      },
      {
        name: t('nervos_dao.deposit_compensation'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        stack: 'sum',
        areaStyle: {},
        encode: {
          x: 'timestamp',
          y: 'compensation',
        },
      },
    ],
    dataset: {
      source: toChangeData(statisticSecondaryIssuance).map(data => [
        dayjs(+data.createdAtUnixtimestamp * 1000).format('YYYY/MM/DD'),
        data.treasuryAmount,
        data.miningReward,
        data.depositCompensation,
      ]),
      dimensions: ['timestamp', 'treasury', 'reward', 'compensation'],
    },
  }
}

const toCSV = (statisticSecondaryIssuance: ChartItem.SecondaryIssuance[]) =>
  statisticSecondaryIssuance
    ? toChangeData(statisticSecondaryIssuance).map(data => [
      data.createdAtUnixtimestamp,
      data.treasuryAmount,
      data.miningReward,
      data.depositCompensation,
    ])
    : []

export const SecondaryIssuanceChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  const [selectedRange, setSelectedRange] = useState<number>(MAX_CHART_COUNT)
  return (
    <SmartChartPage
      title={t('nervos_dao.secondary_issuance')}
      description={t('statistic.secondary_issuance_description')}
      isThumbnail={isThumbnail}
      // fetchData={explorerService.api.fetchStatisticSecondaryIssuance}
      fetchData={() => server.explorer("GET /daily_statistics/{indicator}", { indicator: "treasury_amount-mining_reward-deposit_compensation", limit: selectedRange })}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchStatisticSecondaryIssuance"
      showTimeRange={true}
      onSelectedRangeChange={setSelectedRange}
      selectedRange={selectedRange}
    />
  )
}

export default SecondaryIssuanceChart

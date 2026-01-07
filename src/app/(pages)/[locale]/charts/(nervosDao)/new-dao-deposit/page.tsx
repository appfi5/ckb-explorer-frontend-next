"use client"
import { useState } from 'react'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import type { EChartsOption } from 'echarts'
import { useCurrentLanguage } from '@/utils/i18n'
import {
  DATA_ZOOM_CONFIG,
  assertIsArray,
  assertSerialsDataIsStringArrayOf3,
  assertSerialsItem,
  parseNumericAbbr,
} from '@/utils/chart'
import { shannonToCkb, shannonToCkbDecimal } from '@/utils/util'
import { isMainnet } from '@/utils/chain'
import { tooltipWidth, tooltipColor, type SeriesItem, SmartChartPage } from '../../components/common'
import { type ChartItem } from '@/server/dataTypes'
import { type ChartColorConfig, MAX_CHART_COUNT } from '@/constants/common'
import server from "@/server";
import { useChartTheme } from "@/hooks/useChartTheme";

const widthSpan = (value: string, language: App.Language) => tooltipWidth(value, language === 'en' ? 140 : 120)

const useTooltip = () => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()

  return ({ seriesName, data, color }: SeriesItem & { data: [string, string, string] }): string => {
    if (seriesName === t('statistic.new_dao_deposit')) {
      return `<div>${tooltipColor(color)}${widthSpan(
        t('statistic.new_dao_deposit'),
        currentLanguage,
      )} ${parseNumericAbbr(data[1], 2)}</div>`
    }
    if (seriesName === t('statistic.new_dao_depositor')) {
      return `<div>${tooltipColor(color)}${widthSpan(
        t('statistic.new_dao_depositor'),
        currentLanguage,
      )} ${parseNumericAbbr(data[2], 2, true)}</div>`
    }
    return ''
  }
}

const useOption = (
  statisticNewDaoDeposits: ChartItem.NewDaoDeposit[],
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
    right: '3%',
    top: isMobile ? '15%' : '10%',
    bottom: '10%',
    containLabel: true,
  }
  const parseTooltip = useTooltip()
  return {
    color: chartThemeColor.colors,
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
            assertSerialsDataIsStringArrayOf3(data)
            result += parseTooltip(data)
          })
          return result
        },
      }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    legend: {
      icon: 'roundRect',
      data: isThumbnail
        ? []
        : [
          {
            name: t('statistic.new_dao_deposit'),
            textStyle: {
              color: axisLabelColor
            }
          },
          {
            name: t('statistic.new_dao_depositor'),
            textStyle: {
              color: axisLabelColor
            }
          },
        ],
    },
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
        name: isMobile || isThumbnail ? '' : t('statistic.new_dao_deposit'),
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
          formatter: (value: number) => `${parseNumericAbbr(value)}`,
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
        name: isMobile || isThumbnail ? '' : t('statistic.new_dao_depositor'),
        nameTextStyle: {
          align: 'right',
        },
        type: 'value',
        scale: true,
        splitLine: { show: false },
        axisLine: {
          lineStyle: {
            color: chartThemeColor.colors[1],
          },
        },
        axisLabel: {
          formatter: (value: number) => `${parseNumericAbbr(new BigNumber(value))}`,
        },
      },
    ],
    series: [
      {
        name: t('statistic.new_dao_deposit'),
        type: 'line',
        yAxisIndex: 0,
        areaStyle: {
          color: chartThemeColor.areaColor,
        },
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        encode: {
          x: 'timestamp',
          y: 'deposit',
        },
      },
      {
        name: t('statistic.new_dao_depositor'),
        type: 'line',
        yAxisIndex: 1,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        encode: {
          x: 'timestamp',
          y: 'depositor',
        },
      },
    ],
    dataset: {
      source: statisticNewDaoDeposits.map(data => [
        dayjs(+data.createdAtUnixtimestamp * 1000).format('YYYY/MM/DD'),
        new BigNumber(shannonToCkb(data.dailyDaoDeposit)).toFixed(0),
        new BigNumber(data.dailyDaoDepositorsCount).toNumber().toString(),
      ]),
      dimensions: ['timestamp', 'deposit', 'depositor'],
    },
  }
}

const toCSV = (statisticNewDaoDeposits: ChartItem.NewDaoDeposit[]) =>
  statisticNewDaoDeposits
    ? statisticNewDaoDeposits.map(data => [
      data.createdAtUnixtimestamp,
      shannonToCkbDecimal(data.dailyDaoDeposit, 8),
      data.dailyDaoDepositorsCount,
    ])
    : []

export const NewDaoDepositChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  const [selectedRange, setSelectedRange] = useState<number>(MAX_CHART_COUNT)
  return (
    <SmartChartPage
      title={t('statistic.new_dao_deposit_depositor')}
      note={isMainnet() ? `${t('common.note')}1MB = 1,000,000 CKBytes` : undefined}
      isThumbnail={isThumbnail}
      fetchData={() => server.explorer("GET /daily_statistics/{indicator}", { indicator: "daily_dao_deposit-daily_dao_depositors_count", limit: selectedRange })}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchStatisticNewDaoDeposit"
      showTimeRange={true}
      onSelectedRangeChange={setSelectedRange}
      selectedRange={selectedRange}
    />
  )
}

export default NewDaoDepositChart

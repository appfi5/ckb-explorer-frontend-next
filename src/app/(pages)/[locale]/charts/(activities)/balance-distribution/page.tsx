"use client"
import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import type { EChartsOption } from 'echarts'
import { useCurrentLanguage } from '@/utils/i18n'
import {
  DATA_ZOOM_CONFIG,
  assertIsArray,
  assertSerialsDataIsString,
  assertSerialsItem,
  handleAxis,
  handleLogGroupAxis,
} from '@/utils/chart'
import { tooltipColor, tooltipWidth, type SeriesItem, SmartChartPage } from '../../components/common'
import { localeNumberString } from '@/utils/number'
import { type ChartItem } from '@/server/dataTypes'
import { type ChartColorConfig } from '@/constants/common'
import server from "@/server";
import { useChartTheme } from "@/hooks/useChartTheme";

const widthSpan = (value: string, currentLanguage: string) => tooltipWidth(value, currentLanguage === 'en' ? 300 : 110)

const parseTooltip = ({
  seriesName,
  data,
  color,
  currentLanguage,
}: SeriesItem & { data: string; currentLanguage: App.Language }): string => {
  if (!seriesName) {
    throw new Error('seriesName is required')
  }
  return `<div>${tooltipColor(color)}${widthSpan(seriesName, currentLanguage)} ${localeNumberString(data)}</div>`
}

const toChangeData = (balanceDistributions: ChartItem.BalanceDistribution[]) => {
  return balanceDistributions.map((distribution: any) => {
    const [balance, addresses, sumAddresses] = distribution;
    return {
      balance,
      addresses,
      sumAddresses,
    };
  })
}

const useOption = (
  statisticBalanceDistributions: ChartItem.BalanceDistribution[],
  chartColor: ChartColorConfig,
  isMobile: boolean,
  isThumbnail = false,
): EChartsOption => {
  const balanceDistributions = toChangeData(statisticBalanceDistributions)
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
  const { axisLabelColor, axisLineColor, chartThemeColor } = useChartTheme();

  const gridThumbnail = {
    left: '4%',
    right: '4%',
    top: '8%',
    bottom: '6%',
    containLabel: true,
  }
  const grid = {
    left: '2%',
    right: '3%',
    top: '15%',
    bottom: '6%',
    containLabel: true,
  }

  return {
    color: chartThemeColor.colors,
    tooltip: !isThumbnail
      ? {
        trigger: 'axis',
        formatter: dataList => {
          assertIsArray(dataList)
          const firstData = dataList[0]
          assertSerialsItem(firstData)
          let result = `<div>${tooltipColor('#333333')}${widthSpan(
            t('statistic.addresses_balance'),
            currentLanguage,
          )} ${handleLogGroupAxis(
            new BigNumber(firstData.name),
            firstData.dataIndex === balanceDistributions.length - 1 ? '+' : '',
          )} ${t('common.ckb_unit')}</div>`
          dataList.forEach(data => {
            assertSerialsItem(data)
            assertSerialsDataIsString(data)
            result += parseTooltip({ ...data, currentLanguage })
          })
          return result
        },
      }
      : undefined,
    legend: !isThumbnail
      ? {
        data: [
          {
            name: t('statistic.addresses_balance_group'),
          },
          {
            name: t('statistic.addresses_below_specific_balance'),
          },
        ],
        textStyle: {
          color: axisLabelColor,
          width: isMobile ? 200 : 300,  
          overflow: 'truncate',  
        },
        // orient: isMobile ? 'vertical' : 'horizontal',
        left: isMobile ? '10px' : 'center', 
        width: isMobile ? 'auto' : '80%',
      }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
    xAxis: [
      {
        name: isMobile || isThumbnail ? '' : `${t('statistic.addresses_balance')} (CKB)`,
        nameTextStyle: {
          color: axisLabelColor
        },
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: true,
        data: balanceDistributions.map(data => data.balance),
        axisLabel: {
          formatter: (value: string, index: number) =>
            `${handleLogGroupAxis(
              new BigNumber(value),
              index === balanceDistributions.length - 1 ? '+' : '',
            )}`,
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
        name: isMobile || isThumbnail ? '' : t('statistic.addresses_balance_group'),
        nameTextStyle: {
          align: 'left',
          color: axisLabelColor
        },
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
      {
        position: 'right',
        name: isMobile || isThumbnail ? '' : t('statistic.addresses_below_specific_balance'),
        type: 'value',
        splitLine: {
          show: false,
        },
        scale: true,
        nameTextStyle: {
          align: 'right',
        },
        axisLine: {
          lineStyle: {
            color: chartThemeColor.colors[1],
          },
        },
        axisLabel: {
          formatter: (value: number) => handleAxis(new BigNumber(value)),
        },
      },
    ],
    series: [
      {
        name: t('statistic.addresses_balance_group'),
        type: 'bar',
        yAxisIndex: 0,
        barWidth: isMobile || isThumbnail ? 20 : 50,
        data: balanceDistributions.map(data => new BigNumber(data.addresses).toString()),
      },
      {
        name: t('statistic.addresses_below_specific_balance'),
        type: 'line',
        yAxisIndex: 1,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: balanceDistributions.map(data => new BigNumber(data.sumAddresses).toString()),
      },
    ],
  }
}

const toCSV = (statisticBalanceDistributions?: ChartItem.BalanceDistribution[]) =>
  statisticBalanceDistributions
    ?
    toChangeData(statisticBalanceDistributions).map((data, index) => [
      `"${handleLogGroupAxis(
        new BigNumber(data.balance),
        index === statisticBalanceDistributions.length - 1 ? '+' : '',
      )}"`,
      data.addresses,
      data.sumAddresses,
    ])
    : []

export const BalanceDistributionChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  return (
    <SmartChartPage
      title={t('statistic.balance_distribution')}
      description={t('statistic.balance_distribution_description')}
      isThumbnail={isThumbnail}
      // fetchData={explorerService.api.fetchStatisticBalanceDistribution}
      fetchData={() => server.explorer("GET /distribution_data/{indicator}", { indicator: "address_balance_distribution" })}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchStatisticBalanceDistribution"
      typeKey="addressBalanceDistribution"
    />
  )
}

export default BalanceDistributionChart

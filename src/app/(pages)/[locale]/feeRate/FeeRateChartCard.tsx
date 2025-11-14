'use client';
import BigNumber from 'bignumber.js'
import { useMemo, useState } from 'react'
import type { EChartsOption } from 'echarts'
import type { TopLevelFormatterParams, YAXisOption } from 'echarts/types/dist/shared'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { ReactChartCore } from '../charts/components/common'
import { useCurrentLanguage } from '@/utils/i18n'
import type { FeeRateTracker } from '@/server/dataTypes'
import { handleAxis } from '@/utils/chart'
import styles from './styles.module.scss'
import { useChartTheme } from "@/hooks/useChartTheme";

const textStyleInChart: EChartsOption['textStyle'] = {
  color: '#999999',
  fontWeight: 400,
  fontSize: 14,
}

const textStyleOfTooltip: EChartsOption['textStyle'] = {
  color: '#ffffff',
  fontWeight: 400,
  fontSize: 16,
}

export const ConfirmationTimeFeeRateChart = ({
  transactionFeeRates,
}: {
  transactionFeeRates: FeeRateTracker.TransactionFeeRate[]
}) => {
  const { t } = useTranslation()
  const { chartThemeColor, axisLineColor } = useChartTheme()

  const data = transactionFeeRates.reduce<number[][]>((acc, cur) => {
    if (!cur.confirmationTime) {
      return acc
    }
    const range = Math.floor((cur.confirmationTime - 1) / 10)
    if (!Array.isArray(acc[range])) {
      acc[range] = []
    }
    acc[range].push(cur.feeRate * 1000)
    return acc
  }, [])

  return (
    <ReactChartCore
      option={{
        color: chartThemeColor.moreColors.slice(0, 2).reverse(),
        tooltip: {
          trigger: 'axis',
          position: 'top',
          confine: true,
          textStyle: textStyleOfTooltip,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          formatter(params: TopLevelFormatterParams) {
            const feeRate = Array.isArray(params) ? params[0] : params
            const count = Array.isArray(params) ? params[1] : params
            if (!feeRate.value) return ''
            return `${t('fee_rate_tracker.fee_rate')}: ${feeRate.value?.toLocaleString('en')} shannons/kB<br />${t(
              'fee_rate_tracker.confirmation_time',
            )}: ${feeRate.name}<br />${t('fee_rate_tracker.count')}: ${count.value}`
          },
        },
        xAxis: {
          type: 'category',
          name: `${t('fee_rate_tracker.confirmation_time')} (${t('fee_rate_tracker.seconds')})`,
          nameGap: 32,
          nameLocation: 'middle',
          nameTextStyle: textStyleInChart,
          axisLabel: textStyleInChart,
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: axisLineColor
            }
          },
          data: Array.from({ length: data.length }, (_, idx) => `${idx * 10} ~ ${idx * 10 + 10}s`),
        },
        yAxis: [
          {
            position: 'left',
            type: 'value',
            nameLocation: 'end',
            nameTextStyle: { align: "left", ...textStyleInChart, color: chartThemeColor.moreColors[1] },
            axisLabel: {
              ...textStyleInChart,
              color: chartThemeColor.moreColors[1],
              formatter: (v: number) => `${(v / 1000).toLocaleString('en')}k`,
            },
            axisLine: {
              lineStyle: {
                color: chartThemeColor.moreColors[1],
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: axisLineColor,
                type: 'dashed',
              },
            },
            name: `${t('fee_rate_tracker.fee_rate')}(shannons/kB)`,
          },
          {
            position: 'right',
            type: 'value',
            nameLocation: 'end',
            nameTextStyle: { align: "right", ...textStyleInChart, color: chartThemeColor.moreColors[0] },
            axisLabel: {
              ...textStyleInChart,
              color: chartThemeColor.moreColors[0],
              formatter: (v: number) => v.toLocaleString('en'),
            },
            axisLine: {
              lineStyle: {
                color: chartThemeColor.moreColors[0],
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            name: `${t('fee_rate_tracker.count')}`,
          },
        ],
        series: [
          {
            yAxisIndex: 0,
            data: data.map(feeList =>
              feeList.length ? Math.round(feeList.reduce((acc, cur) => acc + cur) / feeList.length) : 0,
            ),
            type: 'bar',
            barMaxWidth: 12,
            itemStyle: {
              borderRadius: [4, 4, 0, 0],
            },
          },
          {
            yAxisIndex: 1,
            data: data.map(feeList => feeList.length),
            type: 'bar',
            barMaxWidth: 12,
            itemStyle: {
              borderRadius: [4, 4, 0, 0],
            },
          },
        ],
        grid: {
          left: 0,
          bottom: 30,
          right: 0,
          containLabel: true,
        },
      }}
      notMerge
      lazyUpdate
      style={{
        height: '300px',
        width: '100%',
      }}
    />
  )
}

export const FeeRateTransactionCountChartCore = ({
  pendingTransactionFeeRates,
}: {
  pendingTransactionFeeRates: FeeRateTracker.PendingTransactionFeeRate[]
}) => {
  const { t } = useTranslation()
  const { chartThemeColor } = useChartTheme()
  const feeRateCount = pendingTransactionFeeRates.reduce((acc, cur) => {
    const count = acc.get(cur.feeRate) ?? 0
    acc.set(cur.feeRate, count + 1)
    return acc
  }, new Map())

  const feeRateCountList = [...feeRateCount.entries()].sort((a, b) => a[0] - b[0])

  return (
    <ReactChartCore
      option={{
        color: chartThemeColor.moreColors,
        tooltip: {
          trigger: 'item',
          position: 'top',
          textStyle: textStyleOfTooltip,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          formatter(params: TopLevelFormatterParams) {
            const param = Array.isArray(params) ? params[0] : params
            return `${param.name} shannons/kB<br />${t('fee_rate_tracker.transaction_count')}: ${param.value}`
          },
        },
        xAxis: {
          type: 'category',
          name: `${t('fee_rate_tracker.fee_rate')} (shannons/kB)`,
          nameGap: 32,
          nameLocation: 'middle',
          nameTextStyle: textStyleInChart,
          axisLabel: textStyleInChart,
          axisLine: {
            show: false,
          },
          data: feeRateCountList.map(([feeRate]) => new BigNumber(+feeRate * 1000).toFormat(0)),
        },
        yAxis: {
          position: 'left',
          type: 'value',
          nameLocation: 'end',
          nameTextStyle: textStyleInChart,
          axisLabel: textStyleInChart,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: '#e5e5e5',
            },
          },
          name: t('fee_rate_tracker.transaction_count'),
        },
        series: [
          {
            data: feeRateCountList.map(([, count]) => count),
            type: 'bar',
            barMaxWidth: 6,
          },
        ],
        grid: {
          containLabel: true,
        },
      }}
      notMerge
      lazyUpdate
      style={{
        height: '100%',
        width: '100%',
      }}
    />
  )
}

export const FeeRateTransactionCountChart = ({
  pendingTransactionFeeRates,
}: {
  pendingTransactionFeeRates: FeeRateTracker.PendingTransactionFeeRate[]
}) => {
  const currentLanguage = useCurrentLanguage()
  return useMemo(() => {
    return <FeeRateTransactionCountChartCore pendingTransactionFeeRates={pendingTransactionFeeRates} />
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingTransactionFeeRates, currentLanguage])
}

export const LastNDaysTransactionFeeRateChart = ({
  lastNDaysTransactionFeeRates,
}: {
  lastNDaysTransactionFeeRates: FeeRateTracker.LastNDaysTransactionFeeRate[]
}) => {
  const [scaleType, setScaleType] = useState<'linear' | 'log'>('log')
  const { t } = useTranslation()
  const { chartThemeColor, axisLineColor,AreaStyleColors } = useChartTheme()
  const sortedLastNDaysTransactionFeeRates = lastNDaysTransactionFeeRates
    .filter(r => dayjs(r.date).isValid())
    .sort((a, b) => (dayjs(a.date).isBefore(dayjs(b.date)) ? -1 : 1))

  const onScaleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScaleType(e.target.value as 'linear' | 'log')
  }

  return (
    <>
      <div className={styles.scaleSelector}>
        <input
          type="radio"
          id="linear"
          name="scaleType"
          value="linear"
          checked={scaleType === 'linear'}
          onChange={onScaleTypeChange}
        />
        <label htmlFor="linear" className={styles.radioLabel}>
          <span className={styles.radioItem}></span>
          <span>Linear Scale</span>
        </label>
        <input
          type="radio"
          id="log"
          name="scaleType"
          value="log"
          checked={scaleType === 'log'}
          onChange={onScaleTypeChange}
        />
        <label htmlFor="log" className={styles.radioLabel}>
          <span className={styles.radioItem}></span>
          <span>Log Scale</span>
        </label>
      </div>
      <ReactChartCore
        option={{
          color: chartThemeColor.moreColors,
          tooltip: {
            trigger: 'axis',
            position: 'top',
            confine: true,
            textStyle: textStyleOfTooltip,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            formatter(params: TopLevelFormatterParams) {
              const param = Array.isArray(params) ? params[0] : params
              const feeRate = sortedLastNDaysTransactionFeeRates.find(r => dayjs(r.date).format('MM/DD') === param.name)
              return `${t('fee_rate_tracker.date')}: ${feeRate ? dayjs(feeRate.date).format('YYYY/MM/DD') : ''
                }<br />${t('fee_rate_tracker.average_fee_rate')}: ${param.value?.toLocaleString('en')} shannons/kB`
            },
            axisPointer: {
              type: 'line',
              lineStyle: {
                color: '#484D4E',
                width: 1,
                type: 'solid'
              }
            }
          },
          xAxis: {
            type: 'category',
            name: `${t('fee_rate_tracker.date')}`,
            nameGap: 32,
            nameLocation: 'middle',
            nameTextStyle: textStyleInChart,
            axisLabel: textStyleInChart,
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: axisLineColor
              }
            },
            data: sortedLastNDaysTransactionFeeRates.map(r => dayjs(r.date).format('MM/DD')),
          },
          yAxis: {
            type: scaleType === 'log' ? 'log' : 'value',
            nameLocation: 'end',
            nameTextStyle: {...textStyleInChart, align: "left"},
            axisLabel: {
              ...textStyleInChart,
              margin: 2,
              formatter: (value: string) => handleAxis(new BigNumber(value)),
            } as YAXisOption['axisLabel'],
            axisLine: {
              lineStyle: {
                color: chartThemeColor.moreColors[0],
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: axisLineColor,
                type: 'dashed',
              },
            },
            name: `${t('fee_rate_tracker.fee_rate')}(shannons/kB) ${scaleType === 'log' ? t('statistic.log') : ''}`,
          },
          series: [
            {
              data: sortedLastNDaysTransactionFeeRates.map(r => Math.round(Number(r.feeRate) * 1000)),
              type: 'line',
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: AreaStyleColors[0]
                    },
                    {
                      offset: 1,
                      color: AreaStyleColors[1]
                    }
                  ]
                }
              },
              lineStyle: {
                width: 2,
                color: AreaStyleColors[2],
              },
              showSymbol: true,
              itemStyle: {
                color: AreaStyleColors[2]
              },
              symbolSize: 4,
            },
          ],
          grid: {
            bottom: '10%',
            left: 0,
            right: '4%',
            containLabel: true,
          },
        }}
        notMerge
        lazyUpdate
        style={{
          height: '300px',
          width: '100%',
        }}
      />
    </>
  )
}

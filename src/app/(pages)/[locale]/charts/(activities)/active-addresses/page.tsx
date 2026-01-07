"use client"
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { EChartsOption } from 'echarts'
import { type ChartColorConfig, MAX_CHART_COUNT } from '@/constants/common'
import { SmartChartPage } from '../../components/common'
import { DATA_ZOOM_CONFIG, handleAxis, variantColors } from '@/utils/chart'
import server from "@/server";
import { useChartTheme } from "@/hooks/useChartTheme";

const useOption = (
  activeAddresses: Array<APIExplorer.DailyStatisticResponse>,
  _: ChartColorConfig,
  isMobile: boolean,
  isThumbnail = false,
): EChartsOption => {
  const { t } = useTranslation()
  const { axisLabelColor, axisLineColor, baseColors, dataZoomColor } = useChartTheme()
  const processedData = activeAddresses.map((item) => ({
    createdAtUnixtimestamp: item.createdAtUnixtimestamp,
    distribution: item.activityAddressContractDistribution || {},
  }))

  const gridThumbnail = {
    left: '4%',
    right: '10%',
    top: '8%',
    bottom: '6%',
    containLabel: true,
  }
  const grid = {
    left: '4%',
    right: '8%',
    top: isMobile ? '8%' : '20%',
    bottom: '10%',
    containLabel: true,
  }

  const dataset = processedData.slice(0, processedData.length)

  const formatDate = (timestamp: string | number) => {
    const date = new Date(+timestamp * 1000)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const xAxisData = dataset.map(item => formatDate(item.createdAtUnixtimestamp))
  const allKeys = Array.from(new Set(dataset.flatMap(item => Object.keys(item.distribution)))).sort((a, b) => {
    if (a === 'others') return 1
    if (b === 'others') return -1
    return a.localeCompare(b)
  })
  const series: EChartsOption['series'] = allKeys.map(key => ({
    name: key, // t(`statistic.address_label.${key}`),
    type: 'line',
    stack: 'total',
    areaStyle: {},
    lineStyle: {
      width: 0,
    },
    symbol: 'none',
    emphasis: {
      focus: 'series',
    },
    data: dataset.map(item => item.distribution[key] || 0),
  }))
  const colors = variantColors(allKeys.length, baseColors)

  return {
    color: colors,
    tooltip: !isThumbnail
      ? {
        confine: true,
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        formatter: params => {
          // Filter out fields with value 0
          if (!Array.isArray(params)) return ''
          const filteredParams = params.filter(item => item.value !== 0)

          // Construct the tooltip content
          if (filteredParams.length === 0) return '' // No fields to display

          const header = `${(filteredParams[0] as any).axisValue}<br/>` // 现在显示的是日期

          const sum = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:white;"></span>
${t('statistic.active_address_count')}: ${filteredParams.reduce(
            (acc, item) => Number(acc) + Number(item.value),
            0,
          )}<br/><hr style="margin: 4px 0" />`

          const body = filteredParams
            .map(
              item =>
                `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${item.color};"></span>
             ${item.seriesName}: ${item.value}`,
            )
            .join('<br/>')

          return header + sum + body
        },
      }
      : undefined,
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
    legend: {
      show: isMobile || isThumbnail ? false : true,
      data: isThumbnail ? [] : allKeys,
      textStyle: {
        color: axisLabelColor
      },
      width: isMobile ? 'auto' : '80%',
      left: isMobile ? '0px' : 'center',
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
      axisLabel: {
        color: axisLabelColor,
        formatter: (value: string) => value,
      },
      // name: isMobile || isThumbnail ? '' : t('statistic.date'), 
      nameTextStyle: {
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
    yAxis: {
      type: 'value',
      name: isMobile || isThumbnail ? '' : `${t('statistic.active_address_count')}`,
      nameTextStyle: {
        color: axisLabelColor
      },
      axisLabel: {
        color: axisLabelColor,
        formatter: (value: number) => handleAxis(value),
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
    series,
  }
}

const toCSV = (data: Array<APIExplorer.DailyStatisticResponse>) => {
  if (!Array.isArray(data)) {
    return []
  }
  return data.flatMap(item => {
    return Object.entries(item.distribution ?? {}).map(([key, value]) => [item.createdAtUnixtimestamp, key, value.toString()])
  })
}

export const ActiveAddressesChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  const [selectedRange, setSelectedRange] = useState<number>(MAX_CHART_COUNT)
  return (
    <SmartChartPage
      title={t('statistic.active_addresses')}
      description={t('statistic.active_addresses_description')}
      isThumbnail={isThumbnail}
      // fetchData={explorerService.api.fetchStatisticActiveAddresses}
      fetchData={() => server.explorer("GET /daily_statistics/{indicator}", { indicator: "activity_address_contract_distribution", limit: selectedRange })}
      getEChartOption={useOption}
      toCSV={toCSV}
      queryKey="fetchStatisticActiveAddresses"
      showTimeRange={true}
      onSelectedRangeChange={setSelectedRange}
      selectedRange={selectedRange}
    />
  )
}

export default ActiveAddressesChart

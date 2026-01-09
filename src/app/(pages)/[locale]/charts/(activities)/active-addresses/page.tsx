"use client"
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { EChartsOption } from 'echarts'
import { type ChartColorConfig, MAX_CHART_COUNT } from '@/constants/common'
import { SmartChartPage } from '../../components/common'
import { handleAxis, getCustomDataZoomConfig } from '@/utils/chart'
import server from "@/server";
import { useChartTheme } from "@/hooks/useChartTheme";

const allPossibleTypes = [
  "SECP256K1/blake160",
  "SECP256k1/Multisig(@5c5069eb)",
  "SECP256k1/Multisig(@36c971b8)",
  "iCKB Logic",
  "AnyoneCanPay",
  "CHEQUE",
  "JoyId",
  "OMNI Lock V2",
  "OMNI Lock V1",
  "PW Lock",
  "Nostr",
  "RgbppLock",
  "BtcTimeLock",
  "AlwaysSuccess",
  "InputTypeProxyLock",
  "OutputTypeProxyLock",
  "LockProxyLock",
  "Single Use Lock",
  "TypeBurnLock",
  "TimeLock"
];

const fixedColorMap: Record<string, string> = {
  "SECP256K1/blake160": "#5700FF",
  "SECP256k1/Multisig(@5c5069eb)": "#00CC9B",
  "SECP256k1/Multisig(@36c971b8)": "#484E4E",
  "iCKB Logic": "#FF5656",
  "AnyoneCanPay": "#24C0F0",
  "CHEQUE": "#BCCC00",
  "JoyId": "#4661A6",
  "OMNI Lock V2": "#EDAF36",
  "OMNI Lock V1": "#E63ECB",
  "PW Lock": "#69E63E",
  "Nostr": "#FF5733",
  "RgbppLock": "#FFC300",
  "BtcTimeLock": "#DAF7A6",
  "AlwaysSuccess": "#33FF57",
  "InputTypeProxyLock": "#33C1FF",
  "OutputTypeProxyLock": "#8A33FF",
  "LockProxyLock": "#FF33A8",
  "Single Use Lock": "#FF33F6",
  "TypeBurnLock": "#FF8C33",
  "TimeLock": "#FFE733",
  "others": "#9672FA"
};

const fixedTypeOrder = [...allPossibleTypes, "others"];

const useOption = (
  activeAddresses: Array<APIExplorer.DailyStatisticResponse>,
  _: ChartColorConfig,
  isMobile: boolean,
  isThumbnail = false,
): EChartsOption => {
  const { t } = useTranslation()
  const { axisLabelColor, axisLineColor, baseColors, systemColor } = useChartTheme()
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
    bottom: isMobile ? '20%' : '12%',
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

  const processedDistribution = dataset.map(item => {
    const distribution: any = { ...item.distribution };
    const otherValue = Object.entries(distribution)
      .filter(([key]) => !allPossibleTypes.includes(key))
      .reduce((sum, [_, value]) => sum + Number(value), 0);

    Object.keys(distribution).forEach(key => {
      if (!allPossibleTypes.includes(key)) {
        delete distribution[key];
      }
    });

    if (otherValue > 0) {
      distribution.others = otherValue;
    }

    return { ...item, distribution };
  });

  const allKeys = fixedTypeOrder;

  const colors = allKeys.map((key, index) => {
    const color = fixedColorMap[key];
    return color || baseColors?.[index % baseColors.length] || fixedColorMap.others || systemColor;
  });

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
    data: processedDistribution.map(item => item.distribution[key] || 0),
  }))

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
    dataZoom: getCustomDataZoomConfig({isMobile, isThumbnail}),
    legend: {
      show: isMobile || isThumbnail ? false : true,
      data: isThumbnail ? [] : allKeys.filter(key =>
        processedDistribution.some(item => item.distribution[key] || 0 > 0)
      ),
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
    return Object.entries(item.activityAddressContractDistribution ?? {}).map(([key, value]) => [item.createdAtUnixtimestamp, key, value.toString()])
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
"use client"
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { EChartsOption } from 'echarts'
import { type ChartColorConfig, MAX_CHART_COUNT } from '@/constants/common'
import { SmartChartPage } from '../../components/common'
import { DATA_ZOOM_CONFIG, handleAxis } from '@/utils/chart'
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

// 固定类型顺序（确保无论数据如何变化，类型顺序始终一致）
const fixedTypeOrder = [...allPossibleTypes, "others"];

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
  
  // 处理数据，将不在配置中的类型合并为'others'
  const processedDistribution = dataset.map(item => {
    const distribution = { ...item.distribution };
    const otherValue = Object.entries(distribution)
      .filter(([key]) => !allPossibleTypes.includes(key))
      .reduce((sum, [_, value]) => sum + Number(value), 0);
    
    // 移除不在配置中的类型
    Object.keys(distribution).forEach(key => {
      if (!allPossibleTypes.includes(key)) {
        delete distribution[key];
      }
    });
    
    // 添加'others'类型（如果有值）
    if (otherValue > 0) {
      distribution['others'] = otherValue;
    }
    
    return { ...item, distribution };
  });
  
  // 始终使用固定的类型顺序，不根据动态数据筛选
  const allKeys = fixedTypeOrder;
  
  // 根据固定颜色映射表生成颜色数组（与固定类型顺序完全对应）
  const colors = allKeys.map(key => fixedColorMap[key] || fixedColorMap['others']);

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
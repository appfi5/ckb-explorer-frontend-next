"use client"
import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import 'echarts-gl'
import * as echarts from 'echarts/core'
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent,
  GeoComponent,
} from 'echarts/components'
import { EffectScatterChart, MapChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import Loading from '@/components/Loading'
import { getPeers, type RawPeer } from '@/services/NodeProbService'
import { getPrimaryColor, IS_MAINNET, type ChartColorConfig } from '@/constants/common'
import styles from './nodeGeoDistribution.module.scss'
import classNames from 'classnames'
import geoJSON from "./world.geo.json";
import mapCountryShortNameToCountryName from './tool'
import { SmartChartPage } from '../../components/common'
import { useTranslation } from 'react-i18next'
import type { EChartsOption } from 'echarts'

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent,
  GeoComponent,
  MapChart,
  CanvasRenderer,
  // ScatterChart,
  EffectScatterChart,
])

echarts.registerMap("world", { geoJSON })

// const LAUNCH_TIME_OF_MAINNET = 0x16e70e6985c

const useOption = (
  list: DataItem[],
  chartColor: ChartColorConfig,
  isMobile: boolean,
  isThumbnail = false,
): EChartsOption => {
  const { t } = useTranslation()
  // const currentLanguage = useCurrentLanguage()
  // const { axisLabelColor, axisLineColor, chartThemeColor, pieColor } = useChartTheme()
  const maxCount = list.reduce((acc, item) => Math.max(acc, item.count), 0)
  return {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const { name, value } = params.data
        return `${name}: ${value || '-'}`
      },
    },
    // 热力图
    visualMap: {
      min: 1,
      max: maxCount,
      text: ['High', 'Low'],
      realtime: false,
      calculable: true,
      inRange: {
        color: ["#016937", "#FDFEBC", "#A50026"]
      },
      show: !isThumbnail && !isMobile,
      padding: [0, 0, 0, 40]
    },
    series: [
      {
        name: "",
        type: "map",
        map: 'world',
        roam: !isThumbnail,
        aspectScale: 1,
        geoIndex: 0,
        data: list.map(item => ({
          name: item.country,
          value: item.count
        })),
      }
    ]
  }
}

type DataItem = { city?: string, country: string, latitude: number; longitude: number, count: number }
const fetchData = async (): Promise<DataItem[]> => {
  const list: RawPeer[] = await getPeers()
  const countryMap: Record<string, DataItem> = {};
  list.forEach(peer => {
    if (!peer.latitude || !peer.longitude) return;
    
    const fullNameCountry = mapCountryShortNameToCountryName(peer.country);
    if (!fullNameCountry) {
      console.log("unmatch location", peer.country, peer.city);
      return;
    }
    if(!countryMap[fullNameCountry]) {
      countryMap[fullNameCountry] = {
        country: fullNameCountry,
        latitude: peer.latitude,
        longitude: peer.longitude,
        count: 0
      };
    }
    countryMap[fullNameCountry].count += 1;
  })
  return Object.values(countryMap)
}


export const NodeGeoDistribution = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const { t } = useTranslation();

  return (
    <SmartChartPage
      title={t('statistic.node_geo_distribution')}
      isThumbnail={isThumbnail}
      fetchData={fetchData}
      getEChartOption={useOption}
      // toCSV={toCSV}
      queryKey="fetchStatisticNodeGeoDistribution"
    />
  )
}

export default NodeGeoDistribution

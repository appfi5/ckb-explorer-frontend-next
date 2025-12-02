"use client"
import { useTranslation } from 'react-i18next'
import type { EChartsOption } from 'echarts'
import { tooltipColor, tooltipWidth, SmartChartPage } from '../../components/common'
import { parseHourFromMinute } from '@/utils/date'
import { DATA_ZOOM_CONFIG, assertIsArray, handleAxis } from '@/utils/chart'
import { type ChartItem } from '@/server/dataTypes'
import { useCurrentLanguage } from '@/utils/i18n'
import { type ChartColorConfig } from '@/constants/common'
import server from "@/server";
import { useChartTheme } from "@/hooks/useChartTheme";
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import { useEffect, useState, useMemo } from 'react';
import "react-day-picker/style.css";
import { useQuery } from '@tanstack/react-query';
import StaticOverview from './staticOverview';
import styles from './minerDailyStatistics.module.scss';
import Link from 'next/link';
import TextEllipsis from '@/components/TextEllipsis'
import { type CardCellFactory, CardListWithCellsList } from '@/components/CardList'
import { useMediaQuery } from '@/hooks'
import DatePickerDateComponent from './datePickerDateComponent'

const useOption = (
  minerDailyStatistics: ChartItem.DailyStatistics[],
  chartColor: ChartColorConfig,
  isMobile: boolean,
  isThumbnail = false,
): EChartsOption => {
  const { t } = useTranslation()
  const currentLanguage = useCurrentLanguage()
  const { axisLabelColor, axisLineColor, chartThemeColor } = useChartTheme()

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
          let result = `<div>${tooltipColor('#333333')}${widthSpan(t('statistic.date'))} ${dayjs(+dataList[0].name * 1000).format('YYYY/MM/DD')}</div>`
          result += `\
            <div>${tooltipColor(chartThemeColor.colors[0])}\
            ${widthSpan(t('statistic.miner_daily_avgRor'))} \
            ${dataList[0].data} CKB</div>`
          return result
        },
      }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    dataZoom: isThumbnail ? [] : DATA_ZOOM_CONFIG,
    xAxis: [
      {
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: true,
        data: minerDailyStatistics.map(data => data.createdAtUnixtimestamp),
        axisLabel: {
          formatter: (value: string) => dayjs(+value * 1000).format('YYYY/MM/DD'),
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
        nameTextStyle: {
          color: axisLabelColor
        },
        type: 'value',
        scale: true,
        axisLabel: {
          formatter: (value: number) => handleAxis(new BigNumber(value)),
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
        name: t('statistic.miner_daily_avgRor'),
        type: 'bar',
        yAxisIndex: 0,
        barWidth: isMobile || isThumbnail ? 2 : 5,
        data: minerDailyStatistics.map(data => data.avgRor),
      },
    ],
  }
}

const toCSV = (minerDailyStatistics: ChartItem.DailyStatistics[]) =>
  minerDailyStatistics
    ? minerDailyStatistics.map(data => [parseHourFromMinute(data.createdAtUnixtimestamp), data.avgRor])
    : [];

const MinerCardGroup = ({ miners }: { miners: ChartItem.MinerRewardInfo[] }) => {
  const { t } = useTranslation()
  const items: CardCellFactory<ChartItem.MinerRewardInfo>[] = [
    {
      title: t('statistic.miner'),
      content: (miners: ChartItem.MinerRewardInfo) => (
        <Link href={`/address/${miners.miner}`}>
          <TextEllipsis ellipsis="address"
            text={miners.miner}
          />
        </Link>
      ),
    },
    {
      title: t('statistic.count'),
      content: (miners: ChartItem.MinerRewardInfo) => miners.count,
    },
    {
      title: `${t('statistic.user_reward', { defaultValue: '' })} (CKB)`,
      content: (miners: ChartItem.MinerRewardInfo) => miners.userReward,
    },
    {
      title: `${t('statistic.miner_percent', { defaultValue: '' })} (%)`,
      content: (miners: ChartItem.MinerRewardInfo) => miners.percent,
    },
    {
      title: t('statistic.user_hash_rate'),
      content: (miners: ChartItem.MinerRewardInfo) => miners.userHashRate,
    }
  ]

  return (
    miners && miners.length > 0 && <CardListWithCellsList
      className={styles.minerCardGroupSty}
      dataSource={miners}
      getDataKey={(miners: ChartItem.MinerRewardInfo) => miners.id}
      cells={items}
    />
  )
}

export const MinerDailyStatisticsChart = ({ isThumbnail = false }: { isThumbnail?: boolean }) => {
  const [t] = useTranslation()
  const isMaxW = useMediaQuery(`(max-width: 1100px)`)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const timeRangeQuery = useQuery({
    queryKey: ['time_range'],
    queryFn: async () => {
      const res = await server.explorer("GET /miner_daily_statistics/start_end_time")
      if (!res) throw new Error("time_range not found")
      return res;
    },
  })

  const timeRange = useMemo(() => {
    if (!timeRangeQuery.data) return { startTime: new Date(), endTime: new Date() }
    return {
      startTime: new Date(timeRangeQuery.data.startTime),
      endTime: new Date(timeRangeQuery.data.endTime),
    }
  }, [timeRangeQuery.data])

  const minerDailyStatisticsQuery = useQuery({
    queryKey: ['miner_daily_statistics', selectedDate],
    queryFn: async () => {
      const res = await server.explorer("GET /miner_daily_statistics/{date}", { date: dayjs(selectedDate).format("YYYY-MM-DD") })
      if (!res) throw new Error("miner_daily_statistics not found")
      return res;
    },
    enabled: !!selectedDate,
  })

  const overviewData = useMemo<ChartItem.DailyStatistics>(() => {
    if (!minerDailyStatisticsQuery.data) {
      return {
        id: '',
        type: '',
        createdAtUnixtimestamp: '',
        maxBlockNumber: 0,
        minBlockNumber: 0,
        totalReward: 0,
        totalHashRate: 0,
        avgRor: 0,
        miners: [],
      };
    }
    return minerDailyStatisticsQuery.data;
  }, [minerDailyStatisticsQuery.data]);

  if (isThumbnail) {
    return (
      <SmartChartPage
        title={t('statistic.miner_daily_statistics')}
        isThumbnail={isThumbnail}
        fetchData={() => server.explorer("GET /miner_daily_statistics/avg_ror")}
        getEChartOption={useOption}
        toCSV={toCSV}
        queryKey="fetchMinerDailyStatistics"
      />
    )
  }

  return (
    <div className='container bg-[white] dark:bg-[#232323E5] dark:border-2 dark:border-[#282B2C] md:shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] rounded-lg p-3 sm:p-5 my-5!'>
      <div className="flex justify-between items-center">
        <span className='text-[18px] text-[#232323] dark:text-white font-medium'>{t('statistic.miner_daily_statistics')}</span>
        <DatePickerDateComponent timeRange={timeRange} setSelectedDate={setSelectedDate} selectedDate={selectedDate} />
      </div>
      <div className='bg-[#F5F9FB] dark:bg-[#303030] rounded-[16px] p-3 sm:p-5 my-4'>
        <div className='rounded-sm bg-white dark:bg-[#363839]'>
          <StaticOverview overviewData={overviewData} />
        </div>
      </div>
      {
        isMaxW ? <MinerCardGroup miners={overviewData?.miners} /> :
          <div className={styles.list}>
            <table>
              <thead className='bg-[#F5F9FB] dark:bg-[#303030] h-[46px]'>
                <tr>
                  <th className='h-[46px] text-sm! '>{t('statistic.miner')} (CKB)</th>
                  <th className='h-[46px] text-sm! '>{t('statistic.count')}</th>
                  <th className='h-[46px] text-sm! '>{t('statistic.user_reward')}</th>
                  <th className='h-[46px] text-sm! '>{t('statistic.miner_percent')} (%)</th>
                  <th className='h-[46px] text-sm! '>{t('statistic.user_hash_rate')}</th>
                </tr>
              </thead>
              <tbody>
                {overviewData?.miners?.map((data, index) => {
                  return (
                    <tr key={index} className='h-[63px] border-b border-[#EEEEEE] dark:border-[#4C4C4C] text-[16px]'>
                      <td className={styles.address}>
                        <Link className='inline-flex max-w-full' href={`/address/${data.miner}`}>
                          <TextEllipsis className='min-w-0 max-w-300' text={data.miner} ellipsis={{ tail: -8 }} />
                        </Link>
                      </td>
                      <td className='font-hash'>{data.count}</td>
                      <td className='font-hash'>{data.userReward}</td>
                      <td className='font-hash'>{data.percent}</td>
                      <td className='font-hash'>{data.userHashRate}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
      }
    </div>
  )
}

export default MinerDailyStatisticsChart

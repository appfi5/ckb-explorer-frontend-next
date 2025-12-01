import type { EChartsOption } from 'echarts'
import { useTranslation } from 'react-i18next'
import { localeNumberString } from '@/utils/number'
import { useIsMobile } from '@/hooks'
import { ReactChartCore } from '../../../charts/components/common'
import { assertNotArray } from '@/utils/chart'
import styles from './minerDailyStatistics.module.scss'
import { useChartTheme } from "@/hooks/useChartTheme";
import { useTheme } from "@/components/Theme";
import { type ChartItem } from '@/server/dataTypes'

const useOption = (overviewData: ChartItem.DailyStatistics, colors: string[], isMobile: boolean): EChartsOption => {
    const { t } = useTranslation();
    const [theme] = useTheme();
    const isDarkTheme = theme === "dark";

    const countData = Number(overviewData.maxBlockNumber) - Number(overviewData.minBlockNumber);

    const rawMetrics = [
        {
            name: t('statistic.block_total'),
            value: countData == 0 ? 0 : countData + 1 || 0,
            title: t('statistic.block_total'),
        },
        {
            name: t('statistic.total_reward'),
            value: Number(overviewData.totalReward) || 0,
            unit: "CKB",
            title: t('statistic.total_reward'),
        },
        {
            name: t('statistic.total_hashrate'),
            value: Number(overviewData.totalHashRate) || 0,
            unit: "%",
            title: t('statistic.total_hashrate'),
        },
        {
            name: t('statistic.miner_daily_avgRor'),
            value: Number(overviewData.avgRor) || 0,
            unit: "CKB/T",
            title: t('statistic.miner_daily_avgRor'),
        },
    ];

    return {
        color: colors,
        tooltip: {
            trigger: 'item',
            formatter: (value: any) => {
                assertNotArray(value);
                const { name, value: dataValue, unit } = value.data;
                return `${name}: ${localeNumberString(dataValue)} ${unit ? unit : ''}`;
            },
            backgroundColor: 'rgba(50, 50, 50, 0.7)',
            borderWidth: 0,
            textStyle: { color: '#fff' },
            position: ['10%', '50%'],
        },
        series: [
            {
                name: "overall_metrics",
                type: 'pie',
                radius: ['40%', '75%'],
                center: ['50%', '50%'],
                data: rawMetrics,
                label: {
                    position: 'outside',
                    align: 'center',
                    color: isDarkTheme ? '#fff' : '#232323',
                    formatter: '{b}',
                },
                labelLine: {
                    length: 4,
                    length2: isMobile ? 4 : 12,
                },
                itemStyle: {
                    borderRadius: 4,
                    borderColor: isDarkTheme ? "#363839" : '#fff',
                    borderWidth: 2,
                },
                // 悬停放大小占比指标，增强交互
                emphasis: {
                    itemStyle: {
                        scale: 1.1,
                    },
                },
            },
        ],
    };
};

const StaticOverview = ({ overviewData }: { overviewData: ChartItem.DailyStatistics }) => {
    const isMobile = useIsMobile()
    const { chartThemeColor } = useChartTheme()

    return (
        <div className={styles.daoOverviewPanel}>
            <div>
                <ReactChartCore
                    option={useOption(overviewData, chartThemeColor.moreColors, isMobile)}
                    notMerge
                    lazyUpdate
                    style={{
                        height: '300px',
                        width: '100%',
                    }}
                    className="flex justify-center items-center"
                />
            </div>
        </div>
    )
}

export default StaticOverview;
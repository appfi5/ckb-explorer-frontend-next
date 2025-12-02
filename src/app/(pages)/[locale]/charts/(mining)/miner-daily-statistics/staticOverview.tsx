import type { EChartsOption } from 'echarts'
import { useTranslation } from 'react-i18next'
import { useIsMobile } from '@/hooks'
import { ReactChartCore } from '../../../charts/components/common'
import { assertNotArray } from '@/utils/chart'
import styles from './minerDailyStatistics.module.scss'
import { useChartTheme } from "@/hooks/useChartTheme";
import { useTheme } from "@/components/Theme";
import { type ChartItem } from '@/server/dataTypes'
import { logNormalize, getNormalizedRatio, localeNumberString } from "./methods"

const useOption = (overviewData: ChartItem.DailyStatistics, colors: string[], isMobile: boolean): EChartsOption => {
    const { t } = useTranslation();
    const [theme] = useTheme();
    const isDarkTheme = theme === "dark";

    // 1. 计算原始数据（保留完整精度）
    const countData = Number(overviewData.maxBlockNumber) - Number(overviewData.minBlockNumber);
    const blockTotal = countData === 0 ? 0 : countData + 1 || 0;
    const totalReward = Number(overviewData.totalReward) || 0;
    const totalHashRate = Number(overviewData.totalHashRate) || 0;
    const avgRor = Number(overviewData.avgRor) || 0;

    // 2. 标准化处理（仅用于环形图占比）
    const rawValues = [blockTotal, totalReward, totalHashRate, avgRor];
    const logValues = rawValues.map(val => logNormalize(val));
    const normalizedRatios = getNormalizedRatio(logValues);

    // 3. 构造图表数据（含原始值+标准化占比）
    const chartData = [
        {
            name: t('statistic.block_total'),
            rawValue: blockTotal,
            value: (normalizedRatios[0] ?? 0).toFixed(1),
            unit: '',
        },
        {
            name: t('statistic.total_reward'),
            rawValue: totalReward,
            value: (normalizedRatios[1] ?? 0).toFixed(1),
            unit: 'CKB',
        },
        {
            name: t('statistic.total_hashrate'),
            rawValue: totalHashRate,
            value: (normalizedRatios[2] ?? 0).toFixed(1),
            unit: '',
        },
        {
            name: t('statistic.miner_daily_avgRor'),
            rawValue: avgRor,
            value: (normalizedRatios[3] ?? 0).toFixed(1),
            unit: 'CKB/T',
        },
    ];
    return {
        color: colors,
        tooltip: {
            confine: true,
            trigger: 'item',
            formatter: (value: any) => {
                assertNotArray(value);
                const { name, rawValue, unit, value: ratio } = value.data;
                return `
                ${name}<br/>
                ${t('statistic.original_value')}：${localeNumberString(rawValue)} ${unit || ''}<br/>
                ${t('statistic.relative_proportion')}：${ratio}%
                `;
            },
            backgroundColor: 'rgba(50, 50, 50, 0.7)',
            borderWidth: 0,
            textStyle: { color: '#fff', fontSize: 12, whiteSpace: 'nowrap' }, // 禁止换行避免截断
            // position: ['10%', '50%'],
        },
        series: [
            {
                name: t('statistic.miner_daily_statistics'),
                type: 'pie',
                radius: ['40%', '75%'],
                center: ['50%', '50%'],
                data: chartData,
                label: {
                    position: 'outside',
                    align: 'center',
                    color: isDarkTheme ? '#fff' : '#232323',
                    formatter: '{b}: {c}%',
                    fontSize: isMobile ? 10 : 12,
                },
                labelLine: {
                    length: 4,
                    length2: isMobile ? 4 : 12,
                },
                itemStyle: {
                    borderRadius: 4,
                    borderColor: isDarkTheme ? '#363839' : '#fff',
                    borderWidth: 2,
                },
                emphasis: {
                    itemStyle: {
                        scale: 1.1,
                    },
                },
            },
        ]
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
import type { EChartsOption } from 'echarts';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks';
import { ReactChartCore } from '../../../charts/components/common';
import { assertNotArray } from '@/utils/chart';
import styles from './minerDailyStatistics.module.scss';
import { useChartTheme } from '@/hooks/useChartTheme';
import { useTheme } from '@/components/Theme';
import { type ChartItem } from '@/server/dataTypes';
import { localeNumberString } from "@/utils/number";

const formatMinerAddress = (address: string): string => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 10)}...${address.slice(-6)}`;
};

const useOption = (overviewData: ChartItem.DailyStatistics, colors: string[], isMobile: boolean): EChartsOption => {
    const { t } = useTranslation();
    const [theme] = useTheme();
    const isDarkTheme = theme === 'dark';

    const miners = overviewData.miners || [];
    const chartData = miners.map((miner, index) => ({
        name: formatMinerAddress(miner.miner),
        rawData: miner,
        value: (miner.percent * 100).toFixed(1),
    }));

    return {
        color: colors,
        legend: {
            show: isMobile ? false : true,
            type: 'scroll',
            orient: 'horizontal',
            top: '26px',
            bottom: '40px',
            left: 'center',
            textStyle: {
                color: isDarkTheme ? '#fff' : '#232323', 
                fontSize: isMobile ? 10 : 12, 
            },
            itemWidth: 12, 
            itemHeight: 12, 
            itemGap: 12, 
            formatter: (name) => {
                if (name.length > 15) return `${name.slice(0, 8)}...${name.slice(-4)}`;
                return name;
            },
        },
        tooltip: {
            confine: true,
            trigger: 'item',
            formatter: (value: any) => {
                assertNotArray(value);
                const { name, rawData } = value.data;
                return `
                ${t('statistic.miner')}：${name}<br/>
                ${t('statistic.block_total')}：${localeNumberString(rawData.count)}<br/>
                ${t('statistic.total_reward')}：${localeNumberString(rawData.userReward)} CKB<br/>
                ${t('statistic.total_hashrate')}：${localeNumberString(rawData.userHashRate)}<br/>
                `;
            },
            backgroundColor: 'rgba(50, 50, 50, 0.7)',
            borderWidth: 0,
            textStyle: { color: '#fff', fontSize: 12 },
        },
        series: [
            {
                name: t('statistic.miner_daily_statistics'),
                type: 'pie',
                radius: ['40%', '75%'],
                center: ['50%', '60%'],
                data: chartData,
                label: {
                    position: 'outside',
                    align: 'center',
                    color: isDarkTheme ? '#fff' : '#232323',
                    formatter: '{b}: {c}%', 
                    fontSize: isMobile ? 9 : 12,
                    overflow: 'truncate',
                    // width: isMobile ? 80 : 120,
                },
                labelLine: {
                    length: 4,
                    length2: isMobile ? 4 : 12,
                },
                itemStyle: {
                    borderRadius: 4,
                    borderColor: isDarkTheme ? '#232323E5' : '#fff',
                    borderWidth: 2,
                },
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
    const isMobile = useIsMobile();
    const { chartPieColors } = useChartTheme();

    return (
        <div className={styles.daoOverviewPanel}>
            <div>
                <ReactChartCore
                    option={useOption(overviewData, chartPieColors, isMobile)}
                    notMerge
                    lazyUpdate
                    style={{
                        height: '540px',
                        width: '100%',
                    }}
                    className="flex justify-center items-center"
                />
            </div>
        </div>
    );
};

export default StaticOverview;
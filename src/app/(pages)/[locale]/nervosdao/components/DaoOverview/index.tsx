import { type ReactNode, useCallback, type FC } from 'react'
import classNames from 'classnames'
import type { EChartsOption } from 'echarts'
import * as echarts from 'echarts/core'
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  LegendScrollComponent,
} from 'echarts/components'
import { PieChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { useTranslation } from 'react-i18next'
import { handleBigNumber, handleBigNumberFloor } from '@/utils/string'
import { localeNumberString } from '@/utils/number'
import { shannonToCkbDecimal, shannonToCkb } from '@/utils/util'
import { useIsExtraLarge, useIsMobile } from '@/hooks'
import { ReactChartCore } from '../../../charts/components/common'
import { HelpTip } from '@/components/HelpTip'
import { assertNotArray } from '@/utils/chart'
import { type NervosDaoInfo } from '@/server/dataTypes'
import styles from './DaoOverview.module.scss'
import Tooltip from '@/components/Tooltip'
import Capacity from '@/components/Capacity'
import ArrowIcon from './arrow.svg?component'
import { useChartTheme } from "@/hooks/useChartTheme";
import { useTheme } from "@/components/Theme";
import { DaoOverviewIconOne, DaoOverviewIconTwo, DaoOverviewIconThree, DaoOverviewIconFour, DaoOverviewIconFive, DaoOverviewIconSix } from "@/components/icons/daoOverviewIcon"

echarts.use([
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  LegendScrollComponent,
  PieChart,
  CanvasRenderer,
  UniversalTransition,
])

interface NervosDaoItemContent {
  title: string
  titleTooltip?: string
  change?: string
  changeSymbol?: 'positive' | 'negative' | 'zero'
  content: string
  tooltip?: string
  icon?: ReactNode
}

interface NervosDaoPieItemContent {
  title: string
  content: ReactNode
  color: string
}

const numberSymbol = (num: number, isCapacity = true) => {
  const value = isCapacity ? shannonToCkbDecimal(num, 2) : num

  if (value >= 0.01) {
    return 'positive'
  }
  if (value < -0.01) {
    return 'negative'
  }
  return 'zero'
}

const daoIcon = (symbol: 'positive' | 'negative' | 'zero' | undefined) => {
  switch (symbol) {
    case 'negative':
      return <ArrowIcon className={styles.daoDownIcon} />
    case 'zero':
      return <ArrowIcon className={styles.daoBalanceIcon} />
    default:
      return <ArrowIcon className={styles.daoUpIcon} />
  }
}

const useNervosDaoItemContents = (nervosDao: NervosDaoInfo): NervosDaoItemContent[] => {
  const { t } = useTranslation()
  return [
    {
      title: t('nervos_dao.deposit'),
      change: handleBigNumberFloor(shannonToCkbDecimal(nervosDao.depositChanges, 2), 2),
      changeSymbol: numberSymbol(Number(nervosDao.depositChanges)),
      content: localeNumberString(shannonToCkbDecimal(nervosDao.totalDeposit, 2)),
      tooltip: t('nervos_dao.today_update'),
      icon: <DaoOverviewIconOne />
    },
    {
      title: t('nervos_dao.claimed_compensation'),
      change: handleBigNumberFloor(shannonToCkbDecimal(nervosDao.claimedCompensationChanges, 2), 2),
      changeSymbol: numberSymbol(Number(nervosDao.claimedCompensationChanges)),
      content: localeNumberString(shannonToCkbDecimal(nervosDao.claimedCompensation, 2)),
      tooltip: t('nervos_dao.today_update'),
      icon: <DaoOverviewIconTwo />
    },
    {
      title: t('nervos_dao.estimated_apc'),
      titleTooltip: t('glossary.estimated_apc'),
      content: `${Number(nervosDao.estimatedApc).toFixed(2)}%`,
      icon: <DaoOverviewIconThree />,
    },
    {
      title: t('nervos_dao.addresses'),
      titleTooltip: t('nervos_dao.deposit_address_tooltip'),
      change: localeNumberString(nervosDao.depositorChanges),
      changeSymbol: numberSymbol(Number(nervosDao.depositorChanges), false),
      content: localeNumberString(nervosDao.depositorsCount),
      tooltip: t('nervos_dao.today_update'),
      icon: <DaoOverviewIconFour />,
    },
    {
      title: t('nervos_dao.average_deposit_time'),
      content: `${handleBigNumber(nervosDao.averageDepositTime, 1)} ${t('nervos_dao.days')}`,
      icon: <DaoOverviewIconFive />,
    },
    {
      title: t('nervos_dao.unclaimed_compensation'),
      change: handleBigNumberFloor(shannonToCkbDecimal(nervosDao.unclaimedCompensationChanges, 2), 2),
      changeSymbol: numberSymbol(Number(nervosDao.unclaimedCompensationChanges)),
      content: localeNumberString(shannonToCkbDecimal(nervosDao.unclaimedCompensation, 2)),
      tooltip: t('nervos_dao.today_update'),
      icon: <DaoOverviewIconSix />,
    },
  ]
}

// 判断带单位的change是否非零
const isNonZeroChange = (change: any) => {
  if (!change) return false;
  const numberMatch = change.match(/^[-+]?\d+(\.\d+)?/);

  if (!numberMatch) return false;

  const numericValue = parseFloat(numberMatch[0]);
  return numericValue !== 0;
};

const NervosDaoLeftItem = ({ item }: { item: NervosDaoItemContent }) => (
  <div className={styles.daoOverviewLeftItemPanel}>
    <div className="daoOverviewItemContainer">
      <div className={styles.daoOverviewItemIcon}>{item.icon}</div>
      <div className="daoOverviewItemTop">
        <span
          className={classNames('daoOverviewItemTitle', {
            hasChange: !!item.change,
          })}
        >
          {item.title}
        </span>
        {item.titleTooltip && <HelpTip>{item.titleTooltip}</HelpTip>}
      </div>
      <div className="daoOverviewItemContent flex flex-col items-start! sm:items-center! sm:flex-row ">
        <span className={styles.title}>{item.content}</span>
        {
          isNonZeroChange(item.change) && <Tooltip
            trigger={
              <div className={styles.subTitle}>
                {daoIcon(item.changeSymbol)}
                <span style={{
                  color: item.changeSymbol === 'negative' ? '#FF4545' : '#00CC9B'
                }}>{item.change}</span>
              </div>
            }
            placement="top"
          >
            {item.tooltip}
          </Tooltip>
        }
      </div>
    </div>
  </div>
)

const NervosDaoOverviewLeftComp: FC<{ nervosDao: NervosDaoInfo }> = ({ nervosDao }) => {
  const isMobile = useIsMobile()
  const leftItems = useNervosDaoItemContents(nervosDao)

  // if (isMobile) {
  //   return (
  //     <div className={`${styles.daoOverviewLeftPanel} grid grid-cols-2 gap-[20px]`}>
  //       {leftItems.map((item) => (
  //         <NervosDaoLeftItem item={item} key={item.title} />
  //       ))}
  //     </div>
  //   )
  // }
  return (
    <>
      <div className={`${styles.daoOverviewLeftPanel}`}>
        {leftItems.map((item) => (
          <NervosDaoLeftItem item={item} key={item.title} />
        ))}
      </div>
    </>
  )
}

const useOption = (nervosDao: NervosDaoInfo, colors: string[], isMobile: boolean): EChartsOption => {
  const { t } = useTranslation()
  const [theme] = useTheme();
  const isDarkTheme = theme === "dark";
  const { miningReward, depositCompensation, treasuryAmount } = nervosDao
  const sum =
    shannonToCkbDecimal(miningReward) + shannonToCkbDecimal(depositCompensation) + shannonToCkbDecimal(treasuryAmount)
  const names = [
    `${((shannonToCkbDecimal(miningReward) / sum) * 100).toFixed(1)}%`,
    `${((shannonToCkbDecimal(depositCompensation) / sum) * 100).toFixed(1)}%`,
    `${((shannonToCkbDecimal(treasuryAmount) / sum) * 100).toFixed(1)}%`,
  ]

  const { DaoChartPieColor } = useChartTheme()

  const seriesData = [
    {
      name: names[0],
      value: shannonToCkbDecimal(miningReward),
      title: t('nervos_dao.mining_reward'),
    },
    {
      name: names[1],
      value: shannonToCkbDecimal(depositCompensation),
      title: t('nervos_dao.deposit_compensation'),
    },
    {
      name: names[2],
      value: shannonToCkbDecimal(treasuryAmount),
      title: t('nervos_dao.burnt'),
    },
  ]

  return {
    color: DaoChartPieColor,
    tooltip: {
      trigger: 'item',
      formatter: (value: any) => {
        assertNotArray(value)
        return `${value.data?.title}: ${localeNumberString(value.data.value)} ${t('common.ckb_unit')} (${value.data.name
          })`
      },
      backgroundColor: 'rgba(50, 50, 50, 0.7)',
      borderWidth: 0,
      textStyle: {
        color: '#fff',
      },
      position: ['10%', '50%'],
    },
    series: [
      {
        name: t('nervos_dao.secondary_issuance'),
        type: 'pie',
        radius: ['40%', '75%'],
        center: ['50%', '50%'],
        data: seriesData.sort((a, b) => a.value - b.value),
        label: {
          position: 'outside',
          align: 'center',
          color: isDarkTheme ? '#fff' : '#232323',
        },
        labelLine: {
          length: 4,
          length2: isMobile ? 4 : 12,
        },
        itemStyle: {
          borderRadius: 4,
          borderColor: 'transparent',
          borderWidth: 2
        },
      },
    ],
  }
}

const NervosDaoRightCapacity = ({ reward }: { reward: string }) => {
  return (
    <div className={styles.nervosDaoPieCapacityPanel}>
      <Capacity capacity={shannonToCkb(Number(reward).toFixed())} unit={null} textDirection="left" integerClassName="font-bold" />
    </div>
  )
}

const NervosDaoPieItem = ({ item }: { item: NervosDaoPieItemContent }) => (
  <>
    <div className="flex flex-col">
      <div className="flex flex-row items-center gap-2">
        <div
          className="size-[8px]"
          style={{
            backgroundColor: item.color,
          }}
        />
        <div>{item.title}</div>
      </div>
      <div className="w-[40px] break-all pl-4">{item.content}</div>
    </div>
    {/* <div className={styles.nervosDaoPieItemPanel}>
      <div
        className={styles.nervosDaoOverviewPieIcon}
        style={{
          backgroundColor: item.color,
        }}
      />
      <div className='flex flex-col'>
        <span>{item.title}</span>
        <div className="w-[40px] break-all">{item.content}</div>
      </div>
    </div> */}
  </>
)

const NervosDaoOverviewPanel = ({ nervosDao }: { nervosDao: NervosDaoInfo }) => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const { DaoChartPieColor, chartThemeColor } = useChartTheme()

  const nervosDaoPieItemContents = useCallback(
    (nervosDao: NervosDaoInfo): NervosDaoPieItemContent[] => {
      const itemsWithValue = [
        {
          title: t('nervos_dao.mining_reward'),
          reward: nervosDao.miningReward,
          content: <NervosDaoRightCapacity reward={nervosDao.miningReward} />,
        },
        {
          title: t('nervos_dao.deposit_compensation'),
          reward: nervosDao.depositCompensation,
          content: <NervosDaoRightCapacity reward={nervosDao.depositCompensation} />,
        },
        {
          title: t('nervos_dao.burnt'),
          reward: nervosDao.treasuryAmount,
          content: <NervosDaoRightCapacity reward={nervosDao.treasuryAmount} />,
        },
      ];

      const sortedItems = itemsWithValue.sort((a, b) => Number(a.reward) - Number(b.reward));

      return sortedItems.map((item, index) => ({
        ...item,
        color: DaoChartPieColor[index] ?? 'var(--color-primary)',
      }));
    },
    [t, DaoChartPieColor],
  );

  return (
    <div className={styles.daoOverviewPanel}>
      <NervosDaoOverviewLeftComp nervosDao={nervosDao} />
      <div className={styles.daoOverviewRightPanel}>
        <div className={styles.daoOverviewPieChartPanel}>
          <div className={styles.nervosDaoOverviewPieTitle}>
            <span className="text-[16px] font-medium text-[#232323] dark:text-[#fff]">{t('nervos_dao.secondary_issuance')}</span>
            <HelpTip>{t('glossary.secondary_issuance')}</HelpTip>
          </div>
          <div className={styles.daoOverviewPieChartSty}>
            <ReactChartCore
              option={useOption(nervosDao, chartThemeColor.daoColors, isMobile)}
              notMerge
              lazyUpdate
              style={{
                height: '100%',
                width: '100%',
              }}
            />
          </div>
        </div>
        <div className={styles.daoOverviewPieItemsPanel}>
          <div className='flex flex-col gap-2'>
            {nervosDaoPieItemContents(nervosDao).map(item => (
              <NervosDaoPieItem item={item} key={item.title} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NervosDaoOverviewPanel;
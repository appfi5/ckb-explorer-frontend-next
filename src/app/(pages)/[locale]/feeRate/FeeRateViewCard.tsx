'use client';
import { useTranslation } from 'react-i18next'
import type { FeeRateTracker } from '@/server/dataTypes'
import styles from './styles.module.scss'
import { useChartTheme } from "@/hooks/useChartTheme";
import { FeeRateIconOne, FeeRateIconTwo, FeeRateIconThree } from '@/components/icons/feeRateIcon'
import classNames from 'classnames';
import { useMemo } from 'react';
const getWeightedMedian = (tfrs: APIExplorer.TransactionFeeRates[]): number => {
  if (tfrs?.length === 0) {
    return 0
  }
  const arrLen = tfrs.length;
  return tfrs.length % 2 === 0
    ? (+tfrs[arrLen / 2 - 1]!.confirmationTime + +tfrs[arrLen / 2]!.confirmationTime) / 2
    : +tfrs[(arrLen - 1) / 2]!.confirmationTime
}

const calcFeeRate = (tfrs: APIExplorer.TransactionFeeRates[]): string =>
  tfrs.length === 0
    ? '0'
    : Math.round(tfrs.reduce((acc, cur) => acc + +cur.feeRate * 1000, 0) / tfrs.length).toLocaleString('en')

function parseFeeRates(feeRates: APIExplorer.TransactionFeeRates[]) {
  let sortedFeeRates = feeRates.sort((a, b) => +a.confirmationTime - +b.confirmationTime)
  const minFeeRate = sortedFeeRates.reduce((min, current) => Math.min(min, +current.feeRate), Infinity)
  const SCALING_FACTOR = 5
  const sampleWithinScale = sortedFeeRates.filter(r => +r.feeRate <= minFeeRate * SCALING_FACTOR)
  if (sampleWithinScale.length * 3 > sortedFeeRates.length) {
    // When more than 1/3 of transactions have fee rates within 5x of the minimum,
    // we consider the network to have sufficient bandwidth. In this case,
    // we filter out transactions with unusually high fee rates to provide
    // more accurate fee rate recommendations.
    sortedFeeRates = sampleWithinScale
  }

  const avgConfirmationTime = getWeightedMedian(sortedFeeRates)

  const lowFrs = sortedFeeRates.filter(r => +r.confirmationTime >= avgConfirmationTime)
  const lowConfirmationTime = getWeightedMedian(lowFrs)

  const highFrs = sortedFeeRates.filter(r => +r.confirmationTime < avgConfirmationTime)
  const highConfirmationTime = getWeightedMedian(highFrs)
  const list = [lowFrs, sortedFeeRates, highFrs].map(calcFeeRate)
  let low = list[0]!
  let medium = list[1]!
  const high = list[2]!

  if (+medium.replace(/,/g, '') > +high.replace(/,/g, '')) {
    medium = high
  }
  if (+low.replace(/,/g, '') > +medium.replace(/,/g, '')) {
    low = medium
  }

  return {
    low: { feeRate: low, confirmationTime: lowConfirmationTime },
    medium: { feeRate: medium, confirmationTime: avgConfirmationTime },
    high: { feeRate: high, confirmationTime: highConfirmationTime },
  }
}

const FeeRateViewCard = ({ transactionFeeRates }: { transactionFeeRates: APIExplorer.TransactionFeeRates[] }) => {
  const { feeColors } = useChartTheme()
  const { t } = useTranslation()
  const { low, medium, high } = useMemo(() => parseFeeRates(transactionFeeRates), [transactionFeeRates]);

  const feeRateCards: any[] = [
    {
      priority: t('fee_rate_tracker.low'),
      icon: <FeeRateIconOne />,
      feeRate: low.feeRate,
      confirmationTime: low.confirmationTime,
    },
    {
      priority: t('fee_rate_tracker.average'),
      icon: <FeeRateIconTwo />,
      feeRate: medium.feeRate,
      confirmationTime: medium.confirmationTime,
    },
    {
      priority: t('fee_rate_tracker.high'),
      icon: <FeeRateIconThree />,
      feeRate: high.feeRate,
      confirmationTime: high.confirmationTime,
    },
  ]

  return (
    <>
      {feeRateCards.map(({ priority, icon, feeRate, confirmationTime, color }, index) => (
        <div className={classNames(styles.feeRateItem, "basis-[160px]! md:basis-[200px]! items-center p-3 md:px-5 2xl:p-8 gap-2")} key={priority}>

          <div className={styles.feeRateContent}>
            <div className="relative pl-6 md:pl-10">
              <div className="absolute size-[8px] my-auto left-2 md:left-4 top-0 bottom-0" style={{ background: feeColors[index] }}></div>
              <div>{priority}</div>
            </div>
            <div className={classNames(styles.feeRateCountText, "pl-6 md:pl-10")}>
              <span className={classNames(styles.feeRateCountTextVal, "text-xl md:text-[28px] md:leading-[36px]")}>{feeRate}</span>
              <span className={classNames(styles.feeRateCountTextUnit, "mb-0 md:mb-1")}>shannons/kB</span>
            </div>
            <div className={classNames(styles.feeRateTime, "pl-6 md:pl-10")}>
              {
                confirmationTime >= 60
                  ? `${Math.floor(confirmationTime / 60)} ${t('fee_rate_tracker.mins')}${confirmationTime % 60 === 0 ? '' : ` ${confirmationTime % 60} ${t('fee_rate_tracker.secs')}`
                  }`
                  : `${confirmationTime} ${t('fee_rate_tracker.secs')}`}
            </div>
          </div>
          <div className={classNames(styles.chartIcon, "scale-70 sm:scale-100")}>{icon}</div>
        </div>
      ))}
    </>
  )
}

export default FeeRateViewCard

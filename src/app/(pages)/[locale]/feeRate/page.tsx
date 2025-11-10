'use client';
import { useRef, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import styles from './styles.module.scss'
import Content from '@/components/Content'
import { useIsMobile } from '@/hooks'
import { ConfirmationTimeFeeRateChart, LastNDaysTransactionFeeRateChart } from './FeeRateChartCard'
import FeeRateViewCard from './FeeRateViewCard'
import Loading from '@/components/Loading'
import { localeNumberString } from '@/utils/number'
import { getFeeRateSamples } from '@/utils/chart'
import { type FeeRateTracker } from '@/server/dataTypes'
import TimeIcon from '@/assets/icons/time.svg?component'
import server from "@/server";
import { useBlockChainInfo } from '@/store/useBlockChainInfo'
import classNames from 'classnames';

const LoadingComponent = () => (
  <div className='w-full min-h-[200px] flex items-center justify-center bg-white rounded-[8px] dark:bg-[#232323E5]'><Loading show /></div>
)

const FeeRateTrackerPage = () => {
  const { t } = useTranslation()
  const lastFetchedTime = useRef(0)
  const deltaSecond = useRef(0)
  const [secondAfterUpdate, setSecondAfterUpdate] = useState<number>(0)
  const isMobile = useIsMobile()
  const { statistics } = useBlockChainInfo()

  const { data: transactionFeesStatistic } = useQuery<FeeRateTracker.TransactionFeesStatistic>({
    queryKey: ['statistics-transaction_fees'],
    queryFn: async () => {
      const res = await server.explorer("GET /statistics/{fieldName}", { fieldName: "transaction_fees" });
      lastFetchedTime.current = Date.now();
      deltaSecond.current = 0;
      setSecondAfterUpdate(0);
      return res?.transactionFeeRates;
    },
    refetchInterval: 1000 * 60,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const deltaTime = Date.now() - lastFetchedTime.current;
      setSecondAfterUpdate(Math.floor(deltaTime / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Content>
      <div className={`${styles.feeRateTrackerPanel} container`}>
        <div className={classNames(styles.title, !lastFetchedTime.current ? "opacity-0" : "")}>
          <span className={styles.titleText}>{t('fee_rate_tracker.title')}</span>
          <span className={styles.updatedTime}><TimeIcon />{t('fee_rate_tracker.updated_time', {
            second: secondAfterUpdate,
          })}</span>
        </div>
        <div className={styles.feeRateItems}>
          {
            transactionFeesStatistic && transactionFeesStatistic?.transactionFeeRates ? <div className={styles.feeRateItemContainer}>
              <FeeRateViewCard
                transactionFeeRates={getFeeRateSamples(
                  transactionFeesStatistic?.transactionFeeRates,
                  Number(statistics.transactionsCountPerMinute),
                  Number(statistics.averageBlockTime) / 1000,
                )}
              />
            </div> : <LoadingComponent />
          }
        </div>
        <div className={styles.charts}>
          <div className={styles.feeRateChart}>
            <div className={styles.chartTitle}>
              {`${t('fee_rate_tracker.confirmation_time_x_avg_fee_rate')}${isMobile ? '\n' : ' '}(${t(
                'fee_rate_tracker.last_n_transactions',
                {
                  c: localeNumberString(10000),
                },
              )})`}
            </div>
            <div className={styles.chart}>
              {transactionFeesStatistic && transactionFeesStatistic?.transactionFeeRates ? (
                <ConfirmationTimeFeeRateChart transactionFeeRates={transactionFeesStatistic.transactionFeeRates} />
              ) : (
                <LoadingComponent />
              )}
            </div>
          </div>

          <div className={styles.feeRateChart}>
            <div className={styles.chartTitle}>{t('fee_rate_tracker.n_days_historical_fee_rate', { n: 7 })}</div>
            <div className={styles.chart}>
              {transactionFeesStatistic && transactionFeesStatistic?.lastNDaysTransactionFeeRates ? (
                <LastNDaysTransactionFeeRateChart
                  lastNDaysTransactionFeeRates={transactionFeesStatistic.lastNDaysTransactionFeeRates}
                />
              ) : (
                <LoadingComponent />
              )}
            </div>
          </div>
        </div>
      </div>
    </Content>
  )
}

export default FeeRateTrackerPage

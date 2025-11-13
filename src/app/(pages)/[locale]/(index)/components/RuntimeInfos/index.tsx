import { Fragment, type ReactNode } from "react";
import IconEpoc from "../../assets/info.epoc.svg?component";
import IconEpocTime from "../../assets/info.epoc-time.svg?component";
import IconTransactions from "../../assets/info.transactions.svg?component";
import IconOneDay from "../../assets/info.1day.svg?component";
import { useTranslation } from "react-i18next";
import { parseTimeNoSecond } from "@/utils/date";
import { handleBigNumber } from "@/utils/string";
import Card from "@/components/Card";
import { handleDifficulty, handleHashRate, localeNumberString } from "@/utils/number";
import AverageBlockTimeChart from "../charts/AverageBlockTimeChart";
import HashRateChart from "../charts/HashRateChart";
import { useBlockChainInfo } from "@/store/useBlockChainInfo";
import styles from "./index.module.scss";
import classNames from "classnames";
import { cn } from "@/lib/utils";

const parseTime: (millisecond: number, showSecond?: boolean) => Array<[number | string, string]> = (
  millisecond: number,
  showSecond = true,
) => {
  const second = millisecond / 1000;
  const minute = second / 60;
  const hour = second / 3600;
  const output: Array<[number | string, string]> = [];
  if (hour >= 1) {
    output.push([Math.floor(hour), 'h']);
    // `${Math.floor(hour)} h ${Math.floor(minute)} m ${second.toFixed(0)} s`;
    // return [[Math.floor(hour), 'h'], [Math.floor(minute), 'm'], [second.toFixed(0), 's']] 
  }

  if (minute >= 1) {
    // second %= 60;
    output.push([Math.floor(minute % 60), 'm']);
    // return `${Math.floor(minute)} m ${second.toFixed(0)} s`;
    // return [[Math.floor(minute), 'm'], [second.toFixed(0), 's']]
  }
  if (showSecond) {
    output.push([(second % 60).toFixed(2), 's']);
  }
  // return `${second.toFixed(2)} s`;
  return output;
};
const parseHashRate = (hashRate: string | undefined) => (hashRate ? handleHashRate(Number(hashRate) * 1000) : '- -')
export default function RuntimeInfos() {
  const { t } = useTranslation();
  const { statistics } = useBlockChainInfo();
  // const statistics = useStatistics();
  const config = [
    {
      key: 'epoch',
      icon: <IconEpoc width="100%" height="100%" />,
      label: t("blockchain.epoch"),
      content:
        !!statistics.epochInfo.index ? (
          <>
            {statistics.epochInfo.index}
            <span className="font-hash font-normal ml-[6px] text-[14px]">/ {statistics.epochInfo.epochLength}</span>
          </>
        )
          : "-"
    },
    {
      key: 'epoch_time',
      icon: <IconEpocTime width="100%" height="100%" />,
      label: t("blockchain.estimated_epoch_time"),
      // content: parseTimeNoSecond(Number(statistics.estimatedEpochTime)),
      content: (() => {
        const dateList = parseTime(Number(statistics.estimatedEpochTime), false)
        if (dateList.length === 0) {
          return '-'
        }
        return dateList.map(([val, unit]) => {
          return (
            <Fragment key={unit}>
              {val}
              <span className="font-hash font-normal mx-[8px] text-[14px]">{unit}</span>
            </Fragment>
          )
        })
      })()
    },
    {
      key: 'transactions_per_minute',
      icon: <IconTransactions width="100%" height="100%" />,
      label: t("blockchain.transactions_per_minute"),
      // content: handleBigNumber(statistics.transactionsCountPerMinute, 2),
      content: (() => {
        if (!statistics.transactionsCountPerMinute) return "-"
        const [val, unit] = handleBigNumber(statistics.transactionsCountPerMinute, 2).split(" ")
        return (
          <>
            {val}
            <span className="font-hash font-normal mx-[4px] text-[14px]">{unit}</span>
          </>
        )
      })(),
    },
    {
      key: 'transactions_24h',
      icon: <IconOneDay width="100%" height="100%" />,
      label: t("blockchain.transactions_last_24hrs"),
      content: (() => {
        if (!statistics.transactionsLast24hrs) return "-"
        const [val, unit] = handleBigNumber(statistics.transactionsLast24hrs, 2).split(" ")
        return (
          <>
            {val}
            <span className="font-hash font-normal mx-[4px] text-[14px]">{unit}</span>
          </>
        )
      })(),
    },
  ]

  return (
    <>
      <Card className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-[16px] px-[16px] py-[16px] lg:py-[70px] md:py-[40px]", styles.card)}>
        {
          config.map((item, index) => (
            <>
              {index !== 0 && (<div className=" sm:hidden h-[1px] w-full bg-[#eee]" />)}
              <Info
                key={item.key}
                icon={item.icon}
                label={item.label}
                content={item.content}
              />
            </>
          ))
        }
      </Card>
      <div className="flex flex-col md:flex-row items-stretch gap-[20px]">
        <ChartCardLayout
          first={{
            label: t("blockchain.latest_block"),
            content: localeNumberString(statistics.tipBlockNumber),
          }}
          second={{
            label: t("blockchain.average_block_time"),
            content: statistics.averageBlockTime
              ? parseTime(Number(statistics.averageBlockTime))
                .map(([val, unit]) => (
                  <Fragment key={unit}>
                    {val}
                    <span className="font-hash mx-[4px] text-[14px] font-bold leading-[22px]">{unit}</span>
                  </Fragment>
                ))
              : "-"
          }}
        >
          <AverageBlockTimeChart />
        </ChartCardLayout>
        <ChartCardLayout
          first={{
            label: t("blockchain.hash_rate"),
            // content: parseHashRate(statistics.hashRate),
            content: (() => {
              if (!statistics.hashRate) return "-"
              const [val, unit] = handleHashRate(statistics.hashRate).split(" ");
              // const str = handleHashRate(Number(statistics.hashRate) * 1000);
              // const val = str.slice(0, -2);
              // const unit = str.slice(-2);
              return (
                <>
                  {val}
                  <span className="font-hash mx-[4px] text-[14px] font-bold leading-[22px]">{unit}</span>
                </>
              )
            })(),
          }}
          second={{
            label: t("blockchain.difficulty"),
            content: (() => {
              const [val, unit] = handleDifficulty(statistics.currentEpochDifficulty).split(" ");
              return (
                <>
                  {val}
                  <span className="font-hash mx-[4px] text-[14px] font-bold leading-[22px]">{unit}</span>
                </>
              )
            })()

          }}
        >
          <HashRateChart />
        </ChartCardLayout>
      </div>
    </>
  )
}

type ChartCardLayoutProps = {
  first: { label: ReactNode; content: ReactNode }
  second: { label: ReactNode; content: ReactNode }
  children: ReactNode
}
function ChartCardLayout({ first, second, children }: ChartCardLayoutProps) {

  return (
    <Card className="flex-1 p-[16px] lg:p-[32px] flex flex-col lg:flex-row items-center gap-[16px] lg:gap-[32px]">
      <div className="flex flex-none flex-row w-full lg:w-auto lg:flex-col leading-[22px] justify-between lg:gap-[48px]">
        <div>
          <div className="font-medium mb-[8px]">{first.label}</div>
          <div className="font-hash font-bold text-[18px]">{first.content}</div>
        </div>
        <div className="text-right lg:text-left">
          <div className="font-medium mb-[8px]">{second.label}</div>
          <div className="font-hash font-bold text-[18px]">{second.content}</div>
        </div>
      </div>
      <div className="hidden lg:block h-[160px] bg-[#EDF2F2] dark:bg-[#5B5B5B] w-[1px]" />
      <div className="flex-1 basis-[190px] h-[190px] w-full">{children}</div>
    </Card>
  )
}


function Info({ icon, label, content }: { icon: ReactNode; label: ReactNode; content: ReactNode }) {
  return (
    <div className="flex flex-row justify-start  sm:justify-center items-start gap-[8px] md:gap-[16px] px-[8px]">
      <div className="flex-none block size-[20px] md:size-[24px]">{icon}</div>
      <div>
        <div className="md:text-[16px] text-[14px] leading-[20px] md:leading-[24px] min-w-[180px] md:min-w-[204px] font-medium">{label}</div>
        <div className="mt-[10px] font-hash font-bold text-[20px] lg:text-[24px] leading-[26px]">{content}</div>
      </div>
    </div>
  )
}
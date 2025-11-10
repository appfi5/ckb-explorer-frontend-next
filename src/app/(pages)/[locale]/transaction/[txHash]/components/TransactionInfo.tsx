import Card from "@/components/Card";
import LayoutSwitch from "./LayoutSwitch";
import CardPanel from "@/components/Card/CardPanel";
import { Trans, useTranslation } from "react-i18next";
import { localeNumberString } from "@/utils/number";
import Link from "next/link";
import { shannonToCkb, useFormatConfirmation } from "@/utils/util";
import BigNumber from "bignumber.js";
import TwoSizeAmount from "@/components/TwoSizeAmount";
import ComparedToMaxTooltip from "@/components/Tooltip/ComparedToMaxTooltip";
import { useTxLaytout } from "../tool";
import { LayoutLiteProfessional } from "@/constants/common";
import { dayjs, parseSimpleDate } from "@/utils/date";
import PixelArrowUpSvg from '@/assets/icons/pixel-arrow-up.svg?component';
import { useState, type ReactNode } from "react";
import RawTransactionView from "./RawTransactionView";
import { useBlockChainInfo } from "@/store/useBlockChainInfo";
import type { Field } from "@/components/Card/DescPanel";
import DescPanel from "@/components/Card/DescPanel";
import { HelpTip } from "@/components/HelpTip";
import OutLink from "@/components/OutLink";
import ScriptTag from "@/components/ScriptTag";

export default function TransactionInfo({ transaction: tx }: { transaction: APIExplorer.TransactionResponse }) {
  const { t } = useTranslation();
  const layout = useTxLaytout();
  const formatConfirmation = useFormatConfirmation()
  const isLite = layout === LayoutLiteProfessional.Lite;
  const topBlockNumber = useBlockChainInfo(s => s.blockNumber);

  const {
    blockNumber,
    blockTimestamp,
    transactionFee,
    txStatus,
    bytes,
    largestTxInEpoch,
    largestTx,
    cycles,
    maxCyclesInEpoch,
    maxCycles,
  } = tx;
  const confirmation = topBlockNumber && blockNumber ? Number(topBlockNumber) - Number(blockNumber) : 0;
  const items: Field[] = [
    {
      key: 'block height',
      label: t('block.block_height'),
      // showContent: txLoaded,
      content: (
        <OutLink
          className="font-menlo underline"
          href={`/block/${blockNumber}`}
        >
          {localeNumberString(blockNumber)}
        </OutLink>
      )
    }, {
      key: "tx-free|fee-rate",
      // showContent: txLoaded,
      show: !isLite,
      label: `${t('transaction.transaction_fee')} | ${t('transaction.fee_rate')}`,
      content: (
        <>
          <TwoSizeAmount
            className="inline-flex items-baseline"
            amount={shannonToCkb(transactionFee)}
            integerClassName="text-[14px]"
            decimalClassName="text-[12px]"
            unit={<span className="ml-[4px]">CKB</span>}
          />
          <span className="mx-[0.5em]">|</span>
          <span className="font-menlo whitespace-pre">{new BigNumber(transactionFee).multipliedBy(1000).dividedToIntegerBy(bytes).toFormat({
            groupSeparator: ',',
            groupSize: 3,
          })} shannons/kB</span>
        </>
      )
    }, {
      key: "status",
      // showContent: txLoaded,
      label: t('transaction.status'),
      content: formatConfirmation(confirmation),
    }, {
      key: "block.timestamp",
      // showContent: txLoaded,
      label: t('block.timestamp'),
      content: blockTimestamp ? <span className="font-menlo">{dayjs(+blockTimestamp).format("YYYY/MM/DD HH:mm:ssZZ")}</span> : "-"
    }, {
      key: "size",
      // showContent: txLoaded,
      show: !isLite,
      label: t('transaction.size'),
      content: !!bytes && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span className="font-menlo">{`${(bytes - 4).toLocaleString('en')} Bytes`}</span>
          <ComparedToMaxTooltip
            numerator={bytes}
            maxInEpoch={largestTxInEpoch}
            maxInChain={largestTx}
            titleInEpoch={t('transaction.compared_to_the_max_size_in_epoch')}
            titleInChain={t('transaction.compared_to_the_max_size_in_chain')}
            unit="Bytes"
          >
            <span className="text-[#999]">
              {t('transaction.size_in_block', {
                bytes: bytes.toLocaleString('en'),
              })}
            </span>
          </ComparedToMaxTooltip>
        </div>
      )
    }, {
      key: "cycles",
      // showContent: txLoaded,
      show: !isLite,
      label: t('transaction.cycles'),
      content: !!cycles && (
        <div className="flex items-center font-menlo">
          {`${cycles.toLocaleString('en')}`}
          <ComparedToMaxTooltip
            numerator={cycles}
            maxInEpoch={maxCyclesInEpoch}
            maxInChain={maxCycles}
            titleInEpoch={t('transaction.compared_to_the_max_cycles_in_epoch')}
            titleInChain={t('transaction.compared_to_the_max_cycles_in_chain')}
          />
        </div>
      ),
    }
  ]

  return (
    <Card className="mt-[20px] p-[24px] pt-[13px]">
      <LayoutSwitch className="mb-[17px]" />
      <DescPanel
        fields={items}
      />
      {
        !isLite && (
          <CardPanel className="mt-[20px] p-[20px]">
            <TxDetails transaction={tx} />
          </CardPanel>
        )
      }
    </Card>
  )
}


function TxDetails({ transaction }: { transaction: APIExplorer.TransactionResponse }) {
  const { t } = useTranslation();
  const [tabKey, setTabKey] = useState<'params' | 'raw' | undefined>()
  return (
    <>
      <div className="flex gap-[35px]">
        <div className="flex items-center gap-[8px] cursor-pointer" onClick={() => setTabKey(prev => prev === 'params' ? undefined : 'params')} >
          <span className="text-primary">{t('transaction.transaction_parameters')}</span>
          <div className="flex items-center justify-center size-[20px] rounded-[4px] border-[1px] border-[#ddd] dark:border-[transparent] bg-white dark:bg-[#ffffff1a] ">
            <PixelArrowUpSvg className={tabKey === 'params' ? "" : "rotate-[180deg]"} />
          </div>
        </div>
        <div className="flex items-center gap-[8px] cursor-pointer" onClick={() => setTabKey(prev => prev === 'raw' ? undefined : 'raw')}>
          <span className="text-primary">{t('transaction.raw_transaction')}</span>
          <div className="flex items-center justify-center size-[20px] rounded-[4px] border-[1px] border-[#ddd] dark:border-[transparent] bg-white dark:bg-[#ffffff1a] ">
            <PixelArrowUpSvg className={tabKey === 'raw' ? "" : "rotate-[180deg]"} />
          </div>
        </div>
      </div>
      {tabKey === 'params' ? (
        <>
          <Parameters transaction={transaction} />
        </>
      ) : null}
      {tabKey === 'raw' ? <RawTransactionView hash={transaction.transactionHash} /> : null}
    </>
  )
}



function Field({ title, tooltip, value, valueTooltip, href, tag }: {
  title?: ReactNode,
  tooltip?: ReactNode,
  value?: ReactNode
  valueTooltip?: ReactNode,
  href?: string,
  tag?: ReactNode,
}) {

  return (<div className="flex flex-col gap-1 sm:flex-row sm:gap-0 break-all">
    <div className="sm:basis-[140px] shrink-0">
      {title ? (
        <>
          <span>{title}</span>
          {tooltip && <HelpTip>{tooltip}</HelpTip>}
          <span>:</span>
        </>
      ) : (
        ""
      )}
    </div>
    <div>
      <div className="flex items-center">
        {href ? (
          <Link href={href} className="font-menlo underline hover:text-primary">
            {value}
          </Link>
        ) : (
          value
        )}
        {valueTooltip && <HelpTip>{valueTooltip}</HelpTip>}
      </div>
      {tag && <div>{tag}</div>}
    </div>
  </div>
  )
}

function Parameters({ transaction }: { transaction: APIExplorer.TransactionResponse }) {
  const { headerDeps, cellDeps, witnesses } = transaction;
  const { t } = useTranslation();
  const parameters = [
    {
      title: t("transaction.cell_deps"),
      // tooltip: (
      //   <Trans
      //     i18nKey="glossary.cell_deps"
      //     components={{
      //       link1: (
      //         <a
      //           href="https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md#code-locating"
      //           target="_blank"
      //           rel="noreferrer"
      //         />
      //       ),
      //     }}
      //   />
      // ),
      content: (
        <div className="flex flex-col gap-y-4">
          {
            cellDeps.length ? (
              cellDeps.map((cellDep) => {
                const {
                  outPoint: { txHash, index },
                  depType,
                  // script: { codeHash, hashType, name, isLockScript },
                  script
                } = cellDep;
                return (
                  <div className="flex flex-col gap-2" key={`${txHash}-${index}`}>
                    <Field
                      title={t("transaction.out_point_tx_hash")}
                      // tooltip={t("glossary.out_point_tx_hash")}
                      value={txHash}
                      href={`/transaction/${txHash}`}
                      tag={
                        script && (
                          <ScriptTag
                            category={script.isLockScript ? "lock" : "type"}
                            script={{
                              codeHash: script.codeHash,
                              hashType: script.hashType,
                              args: "",
                            }}
                          />
                        )
                      }
                    />
                    <Field
                      title={t("transaction.out_point_index")}
                      // tooltip={t("glossary.out_point_index")}
                      value={Number(index)}
                    />
                    <Field
                      title={t("transaction.dep_type")}
                      // tooltip={t("glossary.dep_type")}
                      value={depType}
                    // valueTooltip={
                    //   depType === "dep_group" ? t("glossary.dep_group") : undefined
                    // }
                    />
                  </div>
                );
              })
            ) : (
              <Field title="CellDep" value="[ ]" />
            )
          }
        </div>
      ),
    },
    {
      title: t("transaction.header_deps"),
      tooltip: t("glossary.header_deps"),
      content: (
        <div className="flex flex-col gap-y-4">
          {headerDeps.length ? (
            headerDeps.map((headerDep) => (
              <Field
                key={headerDep}
                title={t("transaction.header_dep")}
                value={headerDep}
                href={`/block/${headerDep}`}
              />
            ))
          ) : (
            <Field title={t("transaction.header_dep")} value="[ ]" />
          )}
        </div>
      )
    },
    {
      title: t("transaction.witnesses"),
      tooltip: t("glossary.witnesses"),
      content: (
        <div className="flex flex-col gap-y-4">
          {witnesses.length ? (
            witnesses.map((witness, index) => {
              const key = `${witness}-${index}`;
              return (
                <Field
                  key={key}
                  title="Witness"
                  // tooltip={t("glossary.witness")}
                  value={
                    <div className="font-menlo">
                      {witness}
                    </div>
                  }
                />
              );
            })
          ) : (
            <Field
              title="Witness"
              // tooltip={t("glossary.witness")}
              value="[ ]"
            />
          )}
        </div>
      ),
    },
  ];
  return (
    <div className="bg-white dark:bg-[#111] mt-4 rounded-sm p-3 flex flex-col gap-4">
      {parameters.map((item) => (
        <div key={item.title}>
          <div className="font-medium mb-2">
            <span>{item.title}</span>
            {/* {item.tooltip && <HelpTip>{item.tooltip}</HelpTip>} */}
          </div>
          <div className="bg-[#FBFBFB] dark:bg-[#303030] p-3 max-h-[250px] overflow-y-auto rounded-sm text-xs sm:text-sm">{item.content}</div>
        </div>
      ))}
    </div>
  )
}

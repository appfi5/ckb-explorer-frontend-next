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
import PixelArrowUpSvg from "@/assets/icons/pixel-arrow-up.svg?component";
import { useState, type ReactNode } from "react";
import RawTransactionView from "./RawTransactionView";
import { useBlockChainInfo } from "@/store/useBlockChainInfo";
import type { Field } from "@/components/Card/DescPanel";
import DescPanel from "@/components/Card/DescPanel";
import { HelpTip } from "@/components/HelpTip";
import OutLink from "@/components/OutLink";
import ScriptTag from "@/components/ScriptTag";
import DateTime from "@/components/DateTime";

export default function TransactionInfo({
  transaction: tx,
}: {
  transaction: APIExplorer.TransactionResponse;
}) {
  const { t } = useTranslation();
  const formatConfirmation = useFormatConfirmation();
  // const isLite = layout === LayoutLiteProfessional.Lite;
  const topBlockNumber = useBlockChainInfo((s) => s.blockNumber);

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
  const confirmation =
    topBlockNumber && blockNumber
      ? Number(topBlockNumber) - Number(blockNumber)
      : 0;
  const items: Field[] = [
    {
      key: "block height",
      label: t("block.block_height"),
      tooltip: t("glossary.block_height"),
      textDirection: "right",
      contentClassName: "flex sm:text-left sm:justify-start",
      // showContent: txLoaded,
      content: (
        <OutLink className="font-hash underline" href={`/block/${blockNumber}`}>
          {localeNumberString(blockNumber)}
        </OutLink>
      ),
    },
    {
      key: "tx-free",
      label: (
        <span className="whitespace-nowrap">
          {t("transaction.transaction_fee")}
        </span>
      ),
      textDirection: "right",
      contentClassName: "flex sm:text-left sm:justify-start",
      content: (
        <>
          <TwoSizeAmount
            className="inline-flex items-baseline"
            amount={shannonToCkb(transactionFee)}
            integerClassName="text-[14px]"
            decimalClassName="text-[12px]"
            unit={<span className="ml-[4px]">CKB</span>}
          />
        </>
      ),
    },
    {
      key: "fee-rate",
      label: t("transaction.fee_rate"),
      textDirection: "right",
      contentClassName: "flex sm:text-left sm:justify-start",
      content:
        transactionFee && bytes ? (
          <span className="font-hash whitespace-pre">
            {new BigNumber(transactionFee)
              .multipliedBy(1000)
              .dividedToIntegerBy(bytes)
              .toFormat({
                groupSeparator: ",",
                groupSize: 3,
              })}{" "}
            shannons/kB
          </span>
        ) : (
          "-"
        ),
    },
    {
      key: "status",
      label: t("transaction.status"),
      textDirection: "right",
      contentClassName: "flex sm:text-left sm:justify-start",
      content: formatConfirmation(confirmation),
    },
    {
      key: "block.timestamp",
      label: t("block.timestamp"),
      textDirection: "right",
      contentClassName: "flex sm:text-left sm:justify-start",
      content: blockTimestamp ? <DateTime date={blockTimestamp} /> : "-",
    },
    {
      key: "size",
      label: t("transaction.size"),
      textDirection: "right",
      contentClassName: "flex sm:text-left sm:justify-start",
      content: !!bytes && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <span className="font-hash">{`${(bytes - 4).toLocaleString("en")} Bytes`}</span>
          <ComparedToMaxTooltip
            numerator={bytes}
            maxInEpoch={largestTxInEpoch}
            maxInChain={largestTx}
            titleInEpoch={t("transaction.compared_to_the_max_size_in_epoch")}
            titleInChain={t("transaction.compared_to_the_max_size_in_chain")}
            unit="Bytes"
          >
            <span className="text-[#999]">
              {t("transaction.size_in_block", {
                bytes: bytes.toLocaleString("en"),
              })}
            </span>
          </ComparedToMaxTooltip>
        </div>
      ),
    },
    {
      key: "cycles",
      label: t("transaction.cycles"),
      textDirection: "right",
      contentClassName: "flex sm:text-left sm:justify-start",
      content: !!cycles ? (
        <div className="font-hash flex items-center">
          {`${cycles.toLocaleString("en")}`}
          <ComparedToMaxTooltip
            numerator={cycles}
            maxInEpoch={maxCyclesInEpoch}
            maxInChain={maxCycles}
            titleInEpoch={t("transaction.compared_to_the_max_cycles_in_epoch")}
            titleInChain={t("transaction.compared_to_the_max_cycles_in_chain")}
          />
        </div>
      ) : (
        "-"
      ),
    },
  ];

  return (
    <Card className="mt-[20px] p-[12px] md:p-[24px]">
      {/* <LayoutSwitch className="mb-[17px]" /> */}
      <DescPanel fields={items} />
      <CardPanel className="mt-[12px] p-[12px] md:mt-[20px] md:p-[20px]">
        <TxDetails transaction={tx} />
      </CardPanel>
    </Card>
  );
}

function TxDetails({
  transaction,
}: {
  transaction: APIExplorer.TransactionResponse;
}) {
  const { t } = useTranslation();
  const [tabKey, setTabKey] = useState<"params" | "raw" | undefined>();
  return (
    <>
      <div className="flex gap-[35px]">
        <div
          className="flex cursor-pointer items-center gap-[8px]"
          onClick={() =>
            setTabKey((prev) => (prev === "params" ? undefined : "params"))
          }
        >
          <span className="text-primary">
            {t("transaction.transaction_parameters")}
          </span>
          <div className="flex size-[20px] items-center justify-center rounded-[4px] border-[1px] border-[#ddd] bg-white dark:border-[transparent] dark:bg-[#ffffff1a]">
            <PixelArrowUpSvg
              className={tabKey === "params" ? "" : "rotate-[180deg]"}
            />
          </div>
        </div>
        <div
          className="flex cursor-pointer items-center gap-[8px]"
          onClick={() =>
            setTabKey((prev) => (prev === "raw" ? undefined : "raw"))
          }
        >
          <span className="text-primary">
            {t("transaction.raw_transaction")}
          </span>
          <div className="flex size-[20px] items-center justify-center rounded-[4px] border-[1px] border-[#ddd] bg-white dark:border-[transparent] dark:bg-[#ffffff1a]">
            <PixelArrowUpSvg
              className={tabKey === "raw" ? "" : "rotate-[180deg]"}
            />
          </div>
        </div>
      </div>
      {tabKey === "params" ? (
        <>
          <Parameters transaction={transaction} />
        </>
      ) : null}
      {tabKey === "raw" ? (
        <RawTransactionView hash={transaction.transactionHash} />
      ) : null}
    </>
  );
}

function Field({
  title,
  tooltip,
  value,
  valueTooltip,
  href,
  tag,
}: {
  title?: ReactNode;
  tooltip?: ReactNode;
  value?: ReactNode;
  valueTooltip?: ReactNode;
  href?: string;
  tag?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 break-all sm:flex-row sm:gap-0">
      <div className="shrink-0 sm:basis-[140px]">
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
            <Link
              href={href}
              className="font-hash hover:text-primary underline"
            >
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
  );
}

function Parameters({
  transaction,
}: {
  transaction: APIExplorer.TransactionResponse;
}) {
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
          {cellDeps.length ? (
            cellDeps.map((cellDep) => {
              const {
                outPoint: { txHash, index },
                depType,
                // script: { codeHash, hashType, name, isLockScript },
                script,
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
          )}
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
      ),
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
                  value={<div className="font-hash">{witness}</div>}
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
    <div className="mt-4 flex flex-col gap-4 rounded-sm bg-white p-3 dark:bg-[#111]">
      {parameters.map((item) => (
        <div key={item.title}>
          <div className="mb-2 font-medium">
            <span>{item.title}</span>
            {/* {item.tooltip && <HelpTip>{item.tooltip}</HelpTip>} */}
          </div>
          <div className="max-h-[250px] overflow-y-auto rounded-sm bg-[#FBFBFB] p-3 text-xs sm:text-sm dark:bg-[#303030]">
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
}

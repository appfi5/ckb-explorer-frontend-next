"use client"
import Card from "@/components/Card"
import CopyButton from "@/components/CopyButton"
import { useState, type ReactNode } from "react"
import { useTranslation } from "react-i18next";
import type { Field } from "@/components/Card/DescPanel";
import { useQuery } from "@tanstack/react-query";
import { QueryResult } from "@/components/QueryResult";
import DescPanel from "@/components/Card/DescPanel";
import TextEllipsis from "@/components/TextEllipsis";
import OutLink from "@/components/OutLink";
import CardPanel from "@/components/Card/CardPanel";
import EyeCloseIcon from "@/assets/icons/eye.close.svg?component";
import EyeOpenIcon from "@/assets/icons/eye.open.svg?component";
import UDTHolders from "./components/UDTHolders";
import UDTTransactions from "./components/UDTTransactions";
import { FaucetMenu } from "@/components/FaucetMenu";
import server from "@/server";
import clientDB from "@/database";
import type { UDT } from "@/database/udts/tool";
import BigNumber from "bignumber.js";
import TokenTag from "@/components/TokenTag";
import ScriptTag from "@/components/ScriptTag";


export default function UDTDetail({ udtTypeHash }: { udtTypeHash: string }) {
  const { t } = useTranslation();
  const xudtQuery = useQuery({
    queryKey: ['udt', udtTypeHash],
    // queryFn: () => explorerService.api.fetchXudt(udtId)
    queryFn: async () => {
      const udtStatInfo = await server.explorer("GET /udts/{typeScriptHash}", { typeScriptHash: udtTypeHash });
      const udtRegisterInfo = await clientDB.udt.get(udtTypeHash);
      if (!udtStatInfo) throw new Error('UDT not found');

      const udtInfo = {
        ...udtStatInfo,
        typeScriptHash: udtTypeHash,
        info: udtRegisterInfo,
      }


      return udtInfo;
    }
  })

  return (
    <div className="container flex flex-col gap-4 sm:gap-5 py-[20px] min-h-page-height">
      <QueryResult query={xudtQuery} defaultLoadingClassName='min-h-[400px]'>
        {(udtInfo) => (
          <>
            <Head
              logo={udtInfo.info?.icon && <img src={udtInfo.info?.icon} alt={udtInfo.info?.name} />}
              name={udtInfo.info?.symbol || "Unknown UDT"}
              hash={udtTypeHash}
              tags={udtInfo.info?.tags ?? []}
            />
            <UDTOverview udtInfo={udtInfo} />
            <UDTTransactions udtInfo={udtInfo} />
          </>
        )}
      </QueryResult>

    </div>
  )
}


function Head({ logo, name, hash, tags }: {
  logo?: ReactNode
  name: ReactNode,
  hash: string
  tags?: string[]
}) {
  return (
    <Card className="flex flex-col p-3 sm:p-6 gap-4">
      <div className="flex flex-col items-start sm:flex-row sm:items-center gap-3">
        <div className="flex-none flex flex-row items-center gap-3">
          {logo && <div className="flex-none size-[32px] rounded-full">{logo}</div>}
          <span className="font-medium text-xl mr-1 sm:mr-3">{name}</span>
        </div>
        <div className="flex-1 min-w-0 max-w-full flex flex-row items-center gap-1">
          <div className="flex-1 font-hash text-base sm:text-lg leading-[1] min-w-0 overflow-hidden text-ellipsis">
            <TextEllipsis
              text={hash}
              showTooltip={false}
              ellipsis={{ tail: -8 }}
            />
          </div>
          <CopyButton text={hash} />
          <FaucetMenu tokenId={hash} />
        </div>

      </div>
      {!!tags?.length && (
        <div className="flex flex-row flex-wrap gap-1">
          {tags.map((tag) => (
            <TokenTag key={tag} tagName={tag} tooltip />
          ))}
        </div>
      )}
    </Card>
  )
}


function UDTOverview({ udtInfo }: { udtInfo: APIExplorer.UdtDetailResponse & { typeScriptHash: string, info?: UDT } }) {
  const { t } = useTranslation();
  const [showScript, setShowScript] = useState(false);

  const descItems: Field[] = [
    {
      key: "name",
      label: t('xudt.name'),
      textDirection: "right",
      contentClassName: "flex sm:text-left sm:justify-start",
      content: <span className="font-medium">{udtInfo.info?.name ?? '-'}</span>,
    },
    {
      key: "holders",
      label: t('xudt.holders'),
      textDirection: "right",
      contentClassName: "flex sm:text-left sm:justify-start",
      content: <UDTHolders udtInfo={udtInfo} />,
    },
    {
      key: "decimal",
      label: t('xudt.decimal'),
      textDirection: "right",
      contentClassName: "flex sm:text-left sm:justify-start",
      content: <span className="font-hash">{udtInfo.info?.decimalPlaces ?? '-'}</span>,
    },
    {
      key: "manager",
      label: t('xudt.owner'), // issuerOnBtc ? t('xudt.issuer') : t('xudt.owner'),
      textDirection: "right",
      contentClassName: "flex sm:text-left sm:justify-start",
      // content: issuer ? <IssuerContent address={issuerOnBtc ?? issuer} /> : '-',
      content: udtInfo.info?.manager ? (
        <OutLink className="font-hash underline" href={`/address/${udtInfo.info?.manager}`}>
          <TextEllipsis text={udtInfo.info?.manager} ellipsis="address" />
        </OutLink>
      ) : "-",
    },
    {
      key: "symbol",
      label: t('xudt.symbol'),
      textDirection: "right",
      contentClassName: "flex sm:text-left sm:justify-start",
      content: <span className="font-medium">{udtInfo.info?.symbol}</span>,
    },
    {
      key: "total_amount",
      label: t('xudt.total_amount'),
      textDirection: "right",
      contentClassName: "flex sm:text-left sm:justify-start",
      content: udtInfo?.totalAmount && udtInfo.info ? <span className="font-hash">{new BigNumber(udtInfo.totalAmount).dividedBy(10 ** (udtInfo.info.decimalPlaces ?? 0)).toString()}</span> : '-',
    },
  ]
  return (
    <Card className="p-3 sm:p-5">
      <DescPanel fields={descItems} fieldFlex={{ label: 220, content: 490 }} />
      <CardPanel className="p-3 sm:p-5 mt-3 sm:mt-5">
        <div className="flex flex-row gap-1 sm:gap-2 items-center">
          <span className="text-[#909399]">Type Script {showScript ? "" : "Hash"}</span>
          <span
            className="flex items-center justify-center size-[20px] rounded-[4px] bg-white dark:bg-[#ffffff1a] border-[#ddd] dark:border-[transparent] border-[1px] hover:text-primary hover:border-(--color-primary) cursor-pointer "
            onClick={() => setShowScript(v => !v)}
          >
            {
              showScript ? (
                <EyeOpenIcon width={14} height={14} />
              ) : (
                <EyeCloseIcon width={12} height={12} />
              )
            }
          </span>
        </div>
        {
          !!udtInfo.info && (
            <div className="mt-2 bg-white dark:bg-[#232323e6] flex flex-col gap-4 sm:gap-2 px-4 py-2.5">
              {
                !showScript ? (
                  <div className="font-hash break-all">{udtInfo.info.typeHash}</div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row">
                      <span className="flex-none sm:basis-[104px] font-medium">{t("address.code_hash")}:</span>
                      <div className="flex flex-col xl:flex-row gap-1.5 xl:gap-3 xl:items-center">
                        <span className="font-hash break-all">{udtInfo.info.type.codeHash}</span>
                        <ScriptTag category="type" script={udtInfo.info.type} />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                      <span className="flex-none sm:basis-[104px] font-medium">{t("address.hash_type")}:</span>
                      <span className="font-hash">{udtInfo.info.type.hashType}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                      <span className="flex-none sm:basis-[104px] font-medium">{t("address.args")}: </span>
                      <span className="font-hash break-all">{udtInfo.info.type.args}</span>
                    </div>
                  </>
                )
              }
            </div>
          )
        }
      </CardPanel>
    </Card>
  )
}
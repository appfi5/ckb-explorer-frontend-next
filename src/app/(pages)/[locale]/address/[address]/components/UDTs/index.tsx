import Empty from "@/components/Empty";
import styles from './index.module.scss';
import classNames from "classnames";
import type { ReactNode } from "react";
import Link from "next/link";
import type { UrlObject } from "url";
import { useQuery } from "@tanstack/react-query";
import server from "@/server";
import { QueryResult } from "@/components/QueryResult";
import OutLink from "@/components/OutLink";
import CellListModal from "../CellListModal";
import { UDTTypeText } from "@/components/Cell/utils";
import clientDB from "@/database";
import type { UDT } from "@/database/udts/tool";
import BigNumber from "bignumber.js";
import TwoSizeAmount from "@/components/TwoSizeAmount";
import { useTranslation } from "react-i18next";
import InteImage from "@/components/InteImage";


export default function UDTs({ addressInfo }: { addressInfo: APIExplorer.AddressResponse }) {
  const { t } = useTranslation();
  const udtQuery = useQuery({
    queryKey: ['udts', addressInfo.addressHash],
    queryFn: async () => {
      const udtStatList = await server.explorer("GET /addresses/{address}/udts", { address: addressInfo.addressHash });
      const udtRegistInfos = await clientDB.udt.get();
      const udtRegistInfoMap = udtRegistInfos.reduce((map, iUdtRegistInfo) => {
        map[iUdtRegistInfo.typeHash] = iUdtRegistInfo;
        return map;
      }, {} as Record<string, UDT>)
      const udtInfoList = udtStatList?.reduce((arr, iUdtStatInfo) => {
        if (iUdtStatInfo.typeScriptHash) {
          const udtRegistInfo = udtRegistInfoMap[iUdtStatInfo.typeScriptHash];
          const udtInfo = {
            ...iUdtStatInfo,
            ...udtRegistInfo
          }
          arr.push(udtInfo)
        }
        return arr;
      }, [] as Array<APIExplorer.AccountUdtBalanceResponse & Partial<UDT>>)
      return udtInfoList;
    },
  })
  return (
    <>
      <div className="flex flex-row justify-between">
        <span className="font-medium">{t("address.count")}: {!udtQuery.isLoading ? udtQuery.data?.length : ""}</span>
      </div>
      <div className="bg-white dark:bg-[#111] rounded-[4px] mt-3 sm:mt-5">
        <QueryResult query={udtQuery}>
          {(list) => {
            if (!list?.length) {
              return (
                <div>
                  <Empty className="min-h-[40px] gap-2 p-5" />
                </div>
              )
            }
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-5 max-h-[380px] p-3 sm:p-5 overflow-y-auto ">
                {
                  list?.filter(item => !!item.typeScriptHash).map((item) => (
                    <UDTCard key={item.symbol} udt={item} address={addressInfo.addressHash} />
                  ))
                }
              </div>
            )
          }}
        </QueryResult>
        {/* {
          list.map((item, idx) => (
            <UDTCard key={idx} token={item} />
          ))
        } */}
        {/* <UDTCardTemplate
          head="UDT"
        /> */}
        {/* {
          !list.length && (
            <div className="col-span-full">
              <Empty />
            </div>
          )
        } */}
      </div>
    </>
  )
}


function UDTCard({ udt, address }: { udt: APIExplorer.AccountUdtBalanceResponse & Partial<UDT>, address: string }) {


  return (
    <Link href={`/udts/${udt.typeScriptHash}`}>
      <div className={classNames(styles.card, "rounded-md cursor-pointer")}>
        <div className="flex items-center justify-between bg-[#232323] dark:bg-primary rounded-t-sm p-2">
          <div className="flex flex-row font-medium items-center gap-1 text-base text-[#fff]">
            {UDTTypeText[udt.udtType] || ""}
          </div>
          <div className={classNames(styles.cells, "bg-white text-[#232323] size-[20px] leading-0 rounded-[4px]")} onClick={(e) => e.preventDefault()}>
            <CellListModal
              cellRange={{ name: udt.symbol, typeHash: udt.typeScriptHash }}
              address={address}
            />
          </div>
        </div>
        <div className="flex flex-row gap-2 bg-[#fbfbfb] dark:bg-[#363839] border border-[#eee] dark:border-[#4C4C4C] rounded-b-sm px-2 pt-3 pb-4">
          <div className="size-[48px] rounded-full flex-shrink-0">
            <InteImage src={udt.icon || "/assets/udt/default.png"} className="w-full h-full" alt={udt.name} />
          </div>
          <div>
            <div className="text-lg font-medium flex flex-row items-center gap-1 leading-[26px]">
              {udt.symbol || `Unknown ${udt.typeScriptHash.slice(-4)}`}
            </div>
            <TwoSizeAmount
              integerClassName="block w-[160px] truncate"
              decimalClassName="text-[12px]"
              amount={new BigNumber(udt.amount).dividedBy(10 ** (udt.decimalPlaces ?? 0)).toString()}
            />
            {/* {content} */}
          </div>
        </div>
      </div>
    </Link>
  )
}
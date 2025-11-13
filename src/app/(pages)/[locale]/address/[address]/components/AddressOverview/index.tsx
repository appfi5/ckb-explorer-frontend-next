import LayoutSwitch from "@/app/(pages)/[locale]/transaction/[txHash]/components/LayoutSwitch";
import Card from "@/components/Card";
import CardPanel from "@/components/Card/CardPanel";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import CKBTokenIcon from "@/assets/icons/ckb-token-icon.png"
import Image from "next/image";
import TwoSizeAmount from "@/components/TwoSizeAmount";
import { shannonToCkb } from "@/utils/util";
import { useState, type ReactNode } from "react";
import { localeNumberString } from "@/utils/number";
import EyeCloseIcon from "@/assets/icons/eye.close.svg?component";
import EyeOpenIcon from "@/assets/icons/eye.open.svg?component";
import LiveCells from "../LiveCells";
import { Script as CCCScript } from '@ckb-ccc/core';
import UDTs from "../UDTs";
import CellListModal from "../CellListModal";
import BigNumber from "bignumber.js";
import NFTs from "../NFTs";
import ScriptTag from "@/components/ScriptTag";


const cardSubtitleClass = "text-[16px] sm:text-[18px] leading-[24px]"



export default function AddressOverview({ addressInfo }: { addressInfo: APIExplorer.AddressResponse }) {
  const { t } = useTranslation();
  const tabs = [
    { key: 'udt', label: t('address.udt') },
    // { key: 'udt', label: "UDT" },
    { key: 'nft', label: t('address.nft') },
    { key: 'others', label: t("address.other_cells") },
    // { key: 'liveCell', label: t('address.live_cell_tab') },
  ] as const;
  const [tabKey, setTabKey] = useState<(typeof tabs)[number]['key']>(tabs[0].key)
  const [showLockScript, setShowLockScript] = useState(false)

  return (
    <Card className="p-3 md:p-6 pt-[13px]">
      {/* <LayoutSwitch /> */}
      <div className={classNames(cardSubtitleClass, "font-medium mb-3")}>
        {t("address.overview")}
      </div>
      <CardPanel className="flex flex-col lg:flex-row p-3 sm:p-5 gap-4 lg:gap-2 items-stetch  lg:items-center">
        <div className="flex-[360] flex flex-row gap-4">
          <div className="size-14">
            <Image src={CKBTokenIcon} alt="ckb token icon" />
          </div>
          <div className="flex flex-col justify-between">
            <div className={classNames(cardSubtitleClass, "flex flex-row items-center gap-1")}>
              <span>CKB</span>
              <CellListModal
                cellRange="CKB"
                address={addressInfo.addressHash}
              />
            </div>
            <TwoSizeAmount
              integerClassName="font-hash"
              decimalClassName="font-hash text-[12px]"
              amount={shannonToCkb(addressInfo.balance)}
              unit={<span className="ml-1">CKB</span>}
            />
          </div>
        </div>

        <div className="hidden lg:block flex-none h-[40px] w-[1px] bg-[#d9d9d9]" />

        <div className="flex-[1140] flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 items-left sm:items-center p-0 lg:pl-6 lg:pr-20">
          <div className="flex flex-col justify-between gap-1 sm:gap-3">
            <div className="text-[#909399]">{t('address.occupied')}</div>
            <TwoSizeAmount
              integerClassName="font-hash"
              decimalClassName="font-hash text-[12px]"
              amount={shannonToCkb(addressInfo.balanceOccupied)}
              unit={<span className="ml-1">CKB</span>}
            />
          </div>
          <div className="flex flex-col justify-between gap-1 sm:gap-3">
            <div className="text-[#909399]">{t('address.dao_deposit')}</div>
            <TwoSizeAmount
              integerClassName="font-hash"
              decimalClassName="font-hash text-[12px]"
              amount={shannonToCkb(addressInfo.daoDeposit)}
              unit={<span className="ml-1">CKB</span>}
            />
          </div>
          <div className="flex flex-col justify-between gap-1 sm:gap-3">
            <div className="text-[#909399]">{t('address.compensation')}</div>
            <TwoSizeAmount
              integerClassName="font-hash"
              decimalClassName="font-hash text-[12px]"
              amount={shannonToCkb(new BigNumber(addressInfo.depositUnmadeCompensation).plus(addressInfo.phase1UnClaimedCompensation))}
              unit={<span className="ml-1">CKB</span>}
            />
          </div>
        </div>
      </CardPanel>

      <Tabs
        currentTab={tabKey}
        tabs={tabs}
        onTabChange={(nextTab) => setTabKey(nextTab)}
      />

      <CardPanel className="p-3 sm:p-5">
        {
          tabKey === "others" && (
            <LiveCells
              cellRange="Other"
              address={addressInfo.addressHash}
              listContainerClassName="mt-5 bg-white dark:bg-[#111] p-3 sm:p-5"
            />
          )
        }
        {
          tabKey === "udt" && <UDTs addressInfo={addressInfo} />
        }
        {
          tabKey === "nft" && <NFTs addressInfo={addressInfo} />
        }
        <div className="flex flex-col bg-white dark:bg-[#111] p-3 sm:p-5 rounded-[4px] mt-[20px]">
          <div className="flex flex-row ">
            <div className="flex flex-1 gap-2">
              <div className="flex-none basis-[114px] text-[#909399]">{t('address.live_cells')}</div>
              <div className="flex-1">{localeNumberString(addressInfo.liveCellsCount)}</div>
            </div>
            {/* <div className="flex flex-1 gap-2">
              <div className="flex-none basis-[114px] text-[#909399]">{t('address.block_mined')}</div>
              <div className="flex-1">{localeNumberString(addressInfo.minedBlocksCount)}</div>
            </div> */}
          </div>

          <div className="flex flex-row mt-5 gap-2 items-center">
            <span className="text-[#909399] basis-[114px]">Lock Script {showLockScript ? "" : "Hash"}</span>
            <span
              className="flex items-center justify-center size-[20px] rounded-[4px] bg-white dark:bg-[#ffffff1a] border-[#ddd] dark:border-[transparent] border-[1px] hover:text-primary hover:border-(--color-primary) cursor-pointer "
              onClick={() => setShowLockScript(v => !v)}
            >
              {
                showLockScript ? (
                  <EyeOpenIcon width={14} height={14} />
                ) : (
                  <EyeCloseIcon width={12} height={12} />
                )
              }
            </span>
          </div>

          <div className="mt-2 bg-[#fbfbfb] dark:bg-[#303030] flex flex-col gap-4 sm:gap-2 px-4 py-2.5">
            {
              !showLockScript ? (
                <div className="font-hash break-all">{addressInfo.lockScript ? CCCScript.from(addressInfo.lockScript).hash() : null}</div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row">
                    <span className="flex-none sm:basis-[104px] font-medium">{t("address.code_hash")}:</span>
                    <div className="flex flex-col xl:flex-row gap-1.5 xl:gap-3 xl:items-center">
                      <span className="font-hash break-all">{addressInfo.lockScript.codeHash}</span>
                      <ScriptTag category="lock" script={addressInfo.lockScript} />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <span className="flex-none sm:basis-[104px] font-medium">{t("address.hash_type")}:</span>
                    <span className="font-hash">{addressInfo.lockScript.hashType}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <span className="flex-none sm:basis-[104px] font-medium">{t("address.args")}: </span>
                    <span className="font-hash break-all">{addressInfo.lockScript.args}</span>
                  </div>
                </>
              )
            }
          </div>

        </div>
      </CardPanel>

    </Card>
  )
}



function Tabs<T extends string>({ currentTab, tabs, onTabChange }: { currentTab: T; tabs: readonly { key: T, label: ReactNode }[]; onTabChange: (tab: T) => void }) {
  return (
    <div className="mt-6 mb-3 pb-[8px] max-w-full h-[34px] overflow-hidden">
      <div className="pb-4 flex gap-8 w-full  overflow-x-auto overlfow-y-hidden">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className={classNames(cardSubtitleClass, "flex-none relative cursor-pointer", currentTab !== tab.key ? "text-[#999]" : "font-medium")}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
            <div className={classNames("absolute left-0 right-0 mx-auto bottom-[-8px] m-w-[64px] h-1 bg-primary", currentTab !== tab.key ? "hidden" : "")} />
          </div>
        ))}
      </div>
    </div>
  )
}
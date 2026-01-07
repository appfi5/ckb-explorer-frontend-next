"use client"

import AssetContainer from "@/components/AssetContainer"
import Card from "@/components/Card"
import DescPanel from "@/components/Card/DescPanel"
import OutLink from "@/components/OutLink"
import { QueryResult } from "@/components/QueryResult"
import TextEllipsis from "@/components/TextEllipsis"
import TokenTag from "@/components/TokenTag"
import server from "@/server"
import { useQuery } from "@tanstack/react-query"
import classNames from "classnames"
import { useTranslation } from "react-i18next"
import styles from './index.module.scss'
import { useState, type ReactNode } from "react"
import NFTCollectionActivtyList from "./components/ActivityList"
import NFTCollectionHolderList from "./components/HolderList"
import useSearchParamState from "@/hooks/useSearchParamState"
import NFTCollectionTokenList from "./components/TokenList"
import useTokenImage from "@/hooks/useTokenImage"
import CKBAddress from "@/components/CKBAddress"


export default function NFTCollectionDetail({ collectionId }: { collectionId: string }) {
  const { t } = useTranslation("tokens");
  const tabs = [
    { key: 'activity', label: t("title.activity") },
    { key: 'holders', label: t("title.holders") },
    { key: 'inventory', label: t("title.inventory") },
  ] as const;
  // const [tabKey, setTabKey] = useState<(typeof tabs)[number]['key']>(tabs[0].key)
  const [tabKey, setTabKey] = useSearchParamState<(typeof tabs)[number]['key']>('tab', tabs[0].key, { clearOthers: true })
  const query = useQuery({
    queryKey: ['nft-collection', collectionId],
    queryFn: async () => {
      const collectionDetail = await server.explorer("GET /nft/collections/{typeScriptHash}", { typeScriptHash: collectionId })
      // const nft = await server.explorer("GET /nfts/{tokenId}", { tokenId })
      if (!collectionDetail) {
        throw new Error('NFT Collection not found')
      }
      return collectionDetail
    },
  })


  return (
    <div className="container min-h-page-height py-5 flex flex-col gap-4 sm:gap-5">
      <QueryResult query={query} defaultLoadingClassName='min-h-page-height'>
        {collectionInfo => (
          <>
            <NFTCollectionOverview collectionInfo={collectionInfo} />

            <Card className="relative p-3 sm:p-6">
              <Tabs
                currentTab={tabKey}
                tabs={tabs}
                onTabChange={(nextTab) => setTabKey(nextTab)}
              />
              {
                tabKey === "activity" && (
                  <NFTCollectionActivtyList collectionInfo={collectionInfo} />
                )
              }
              {
                tabKey === "holders" && (
                  <NFTCollectionHolderList collectionId={collectionId} />
                )
              }
              {
                tabKey === "inventory" && (
                  <NFTCollectionTokenList collectionInfo={collectionInfo} />
                )
              }
            </Card>
          </>
        )}
      </QueryResult>
    </div>
  )
}


function NFTCollectionOverview({ collectionInfo }: { collectionInfo: APIExplorer.CollectionsResp }) {
  const { t } = useTranslation("tokens");
  const { isLoading, data: coverImg } = useTokenImage({
    type: collectionInfo.standard,
    data: collectionInfo.iconUrl,
    clusterId: collectionInfo.typeScriptHash
  })
  return (
    <>
      <Card className={classNames("p-3 sm:p-6 flex flex-row gap-5", styles.overview)}>
        <AssetContainer className="flex-none size-[120px] rounded-sm">
          {
            !isLoading && (
              <img
                className="w-full h-full object-scale-down"
                src={coverImg}
              />
            )
          }
        </AssetContainer>
        <div className="flex flex-col gap-3">
          <div className="font-medium text-black break-all dark:text-white text-xl">
            {collectionInfo.name}
          </div>
          {
            !!collectionInfo.tags?.length && (
              <div className="flex flex-row flex-wrap gap-1">
                {
                  collectionInfo.tags.map(tag => (
                    <TokenTag key={tag} tagName={tag} />
                  ))
                }
              </div>
            )
          }
          <div className="break-all">
            {collectionInfo.description}
          </div>
        </div>
      </Card>

      <Card className="p-3 sm:p-6">
        <DescPanel
          fields={[
            {
              key: 'type',
              label: t("field.type"),
              content: collectionInfo.standard,
              textDirection: "right",
              contentClassName: "flex sm:text-left sm:justify-start",
            },
            {
              key: 'holder|minted',
              label: `${t("field.holder")}/${t("field.minted")}`,
              content: <span className="font-hash">{collectionInfo.holdersCount}/{collectionInfo.itemsCount}</span>,
              textDirection: "right",
              contentClassName: "flex sm:text-left sm:justify-start",
            },
            {
              key: 'creator',
              label: t("field.minter_address"),
              content: collectionInfo.creator ? (
                <OutLink href={`/address/${collectionInfo.creator}`}>
                  <CKBAddress
                    className="underline"
                    address={collectionInfo.creator}
                    ellipsis="address"
                  />
                </OutLink>
              ) : "-",
              textDirection: "right",
              contentClassName: "flex sm:text-left sm:justify-start",
            },
            {
              key: 'clusterId',
              label: t("field.cluster_id"),
              layout: "flex-row items-start gap-2",
              content: collectionInfo.clusterId
                // ? (<span className="font-hash truncate">{collectionInfo.clusterId}</span>)
                ? (
                  <TextEllipsis text={collectionInfo.clusterId} ellipsis="transaction" />
                )
                : "-",
              textDirection: "right",
              contentClassName: "flex sm:text-left sm:justify-start",
            },
          ]}
        />
      </Card>
    </>
  )
}


function Tabs<T extends string>({ currentTab, tabs, onTabChange }: { currentTab: T; tabs: readonly { key: T, label: ReactNode }[]; onTabChange: (tab: T) => void }) {
  return (
    <div className="mb-5 max-w-full overflow-hidden">
      <div className="pb-2 flex gap-5 sm:gap-10 w-full  overflow-x-auto overlfow-y-hidden">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className={classNames("text-[16px] sm:text-[18px] leading-[24px]", "flex-none relative cursor-pointer", currentTab !== tab.key ? "text-[#999]" : "font-medium")}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
            <div className={classNames("absolute left-0 right-0 mx-auto bottom-[-8px] h-1 bg-primary", currentTab !== tab.key ? "hidden" : "")} />
          </div>
        ))}
      </div>
    </div>
  )
}
import Empty from "@/components/Empty";
import styles from './index.module.scss';
import classNames from "classnames";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import server from "@/server";
import { QueryResult } from "@/components/QueryResult";
import { useTranslation } from "react-i18next";
import CellModal from "@/components/Cell/CellModal";
import TooltipMoreIcon from "@/assets/icons/tooltip.more.svg?component";
import TextEllipsis from "@/components/TextEllipsis";
import useTokenImage from "@/hooks/useTokenImage";


export default function NFTs({ addressInfo }: { addressInfo: APIExplorer.AddressResponse }) {
  const { t } = useTranslation();
  const udtQuery = useQuery({
    queryKey: ['nfts', addressInfo.addressHash],
    queryFn: async () => {
      const nftList = await server.explorer("GET /addresses/{address}/nfts", { address: addressInfo.addressHash });
      return nftList;
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
                  list?.map((item) => (
                    <NFTCard key={item.tokenId} item={item} />
                  ))
                }
              </div>
            )
          }}
        </QueryResult>
      </div>
    </>
  )
}


function NFTCard({ item }: { item: APIExplorer.AccountNftResponse }) {
  const { isLoading, data: itemCover } = useTokenImage({
    type: item.standard,
    data: item.nftIconFile,
    clusterId: item.collectionTypeHash,
    tokenId: item.tokenId
  })
  return (
    <Link href={`/nft-collections/${item.collectionTypeHash}/${item.tokenId}`}>
      <div className={classNames(styles.card, "rounded-md cursor-pointer")}>
        <div className="flex items-center justify-between bg-[#232323] dark:bg-primary rounded-t-sm p-2">
          <div className="flex flex-row font-medium items-center gap-1 text-base text-[#fff]">
            {item.standard}
          </div>
          <div
            data-clickable
            className={classNames("bg-white text-[#232323] size-5 leading-0 rounded-sm")}
            onClick={(e) => e.preventDefault()}
          >
            <CellModal cell={{ id: item.cellId }}>
              <div className="flex items-center justify-center size-5 rounded-sm bg-white dark:bg-[#ffffff1a] border-[#ddd] dark:border-[transparent] border-[1px] hover:text-primary hover:border-(--color-primary) cursor-pointer ">
                <TooltipMoreIcon />
              </div>
            </CellModal>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2 bg-[#fbfbfb] dark:bg-[#363839] border border-[#eee] dark:border-[#4C4C4C] rounded-b-sm px-2 pt-3 pb-4">
          <div className="flex-none size-12 rounded-sm bg-[#eee] dark:bg-[#303030]">
            {!isLoading && <img src={itemCover || "/images/spore_placeholder.svg"} className="w-full h-full object-scale-down rounded-sm" alt={item.collectionName} />}
          </div>
          <div className="flex-1 min-w-0">
            {
              !!item.collectionName && (
                <Link
                  data-clickable
                  className="hover:underline"
                  href={`/nft-collections/${item.collectionTypeHash}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div  
                    title={item.collectionName}
                    className="text-lg font-medium items-center gap-1 leading-[26px] truncate"
                  >
                    {item.collectionName}
                  </div>
                </Link>
              )
            }

            <div className="flex felx-row">
              <span>ID: </span>
              <TextEllipsis text={item.tokenId} ellipsis={{ head: 8, tail: -8 }} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
"use client"
import Card from "@/components/Card"
import DescItem from "@/components/Card/DescItem"
import OutLink from "@/components/OutLink"
import { QueryResult } from "@/components/QueryResult"
import TextEllipsis from "@/components/TextEllipsis"
import server from "@/server"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import styles from "./index.module.scss"
import classNames from "classnames"
import NFTTransactionsHistory from "./TransactionsHistory"
import AssetContainer from "@/components/AssetContainer"
import { formatNftDisplayId } from "@/utils/util"
import useDOBRender from "@/hooks/useDOBRender"
import type { ParsedTrait } from "@nervape/dob-render"
import { getDob0Traits } from "@/utils/spore"
import parseData from "@/components/Cell/dataDecoder"
import { CellType } from "@/components/Cell/utils"
import Tooltip from "@/components/Tooltip"
import CellModal from "@/components/Cell/CellModal"
import InfoIcon from '@/assets/icons/info.svg?component';

type NFTDetail = APIExplorer.NftItemResponse & { traits?: ParsedTrait[] };
const UNIQUE_ITEM_LABEL = 'Unique Item';
export default function NFTDetail({ collectionId, tokenId }: { collectionId: string, tokenId: string }) {
  const query = useQuery({
    queryKey: ['nft', collectionId, tokenId],
    queryFn: async () => {
      const nft = await server.explorer("GET /nft/collections/{typeScriptHash}/items/{tokenId}", {
        typeScriptHash: collectionId,
        tokenId
      }) as (NFTDetail | null)

      if (!nft) {
        throw new Error('NFT not found')
      }

      const cellData = nft.data;
      try {
        const decodeData = parseData({ cellType: CellType.SPORE }, cellData);
        if (decodeData?.type === "spore" && decodeData.content.contentType === "dob/0") {
          nft.traits = await getDob0Traits(tokenId);
        }

      } catch (e) { }

      return nft;
    },
  })

  const { data: collectionInfo } = useQuery({
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
    <div className="container min-h-page-height pb-6 py-6">
      <QueryResult query={query} defaultLoadingClassName='min-h-page-height'>
        {nft => (
          <div className="flex flex-col gap-4 sm:gap-6">
            <NFTOverview detail={nft} collection={collectionInfo} />
            <NFTTransactionsHistory collectionId={collectionId} tokenId={tokenId} />
          </div>
        )}
      </QueryResult>
    </div>
  )
}


function NFTOverview({ detail, collection }: { detail: NFTDetail, collection: APIExplorer.CollectionsResp | undefined }) {
  const { t } = useTranslation("tokens");
  const { data: nftCoverImg, isLoading } = useDOBRender({ type: "dob", data: detail.data, id: detail.tokenId })
  return (
    <Card className={classNames("p-3 sm:p-6 flex flex-col md:flex-row flex-wrap gap-6", styles.overview)}>
      <AssetContainer className="flex-none flex justify-center items-center max-w-full md:size-[360px] xl:size-[480px] rounded-lg overflow-hidden">
        {
          !isLoading && (
            <img
              className="w-full md:h-full min-h-[200px] max-h-[480px] md:max-h-full object-scale-down"
              src={nftCoverImg}
              alt="cover"
              loading="lazy"
            />
          )
        }
      </AssetContainer>
      <div className="flex-1">
        <div className="font-medium text-black dark:text-white text-base md:text-2xl break-all">
          {detail
            ? `${collection?.name ?? UNIQUE_ITEM_LABEL} ${formatNftDisplayId(detail.tokenId, "spore")}`
            : '-'}
        </div>
        {/* <div className="block h-[1px] bg-[#ccc] md:hidden"></div> */}
        <div className="flex flex-col gap-5 mt-3">
          <DescItem layout="flex-col gap-1" label={t("field.owner")} >
            <OutLink className="underline" href={`/address/${detail.owner}`}>
              <TextEllipsis
                text={detail.owner}
                ellipsis={{ head: 18, tail: -18 }}
              />
            </OutLink>
          </DescItem>

          <DescItem layout="flex-col gap-1" label={t("field.minter_address")} >
            {
              !!collection?.creator ? (
                <OutLink className="underline" href={`/address/${collection.creator}`}>
                  <TextEllipsis
                    text={collection.creator}
                    ellipsis={{ head: 18, tail: -18 }}
                  />
                </OutLink>
              ) : "-"
            }
          </DescItem>
          <DescItem layout="flex-col gap-1" label={t("field.collection")} >

            {
              !!collection?.typeScriptHash ?
                (
                  <OutLink className="underline" href={`/nft-collections/${collection.typeScriptHash}`}>
                    {collection.name}
                  </OutLink>
                )
                : "-"
            }

          </DescItem>

          <DescItem layout="flex-col gap-1" label={t("field.token_id")} >
            <span className="font-hash break-all">{detail.tokenId}</span>
          </DescItem>

          <DescItem layout="flex-col gap-1" label={t("field.type")} >
            DOB
          </DescItem>

          <DOBTraits traits={detail.traits} tokenId={detail.tokenId} />
        </div>

      </div>
    </Card>
  )
}

const HIDDEN_KEY = [
  'prev.type',
  'prev.bg',
  'prev.bgcolor',
  'asset',
  'media_type',
  'dob_dna',
  'protocol', // nervape
  'dob_id', // nervape
  'cell_id', // unicorn
  'block_number', // unicorn
]

function DOBTraits({ traits, tokenId }: { traits?: ParsedTrait[], tokenId: string }) {
  const { t } = useTranslation("tokens")
  const filteredTraits = traits?.filter(trait => !HIDDEN_KEY.includes(trait.name)) ?? []
  if (!filteredTraits?.length) return null;

  return (
    <DescItem layout="flex flex-col gap-1" label={t("field.traits")} >
      <div className="flex flex-row flex-wrap gap-2">
        {filteredTraits
          .map(trait => (
            <TraitItem key={trait.name} trait={trait} tokenId={tokenId} />
          ))}
      </div>
    </DescItem>
  )
}


function TraitItem({ trait, tokenId }: { trait: ParsedTrait, tokenId: string }) {
  const { t } = useTranslation()

  // Bescard related CKB | UDT Cell
  const { data: cellId } = useQuery({
    queryKey: ["trait", trait.name, trait.value],
    queryFn: async () => {
      const traitValue = await server.explorer("GET /nft/storeCell/{tokenId}", { tokenId })
      return traitValue
    },
    enabled: trait.name === "StoredValue" && !!tokenId
  })
  return (
    <div
      key={trait.name}
      className="bg-[#F5F9FB] dark:bg-[#363839] flex-none p-3 rounded-lg max-w-[200px] flex flex-row items-center gap-2"
    >
      <div>
        <div className="text-xs text-[#909399] dark:text-[#999]">{trait.name}</div>
        <div className="text-xs truncate">{trait.value as string}</div>
      </div>
      {
        !!cellId && (
          <Tooltip
            asChild={false}
            trigger={
              <CellModal cell={{ id: cellId }}>
                <div className="flex size-5">
                  <InfoIcon width="100%" height="100%" className={styles.infoIcon} />
                </div>
              </CellModal>
            }
            placement="top"
          >
            {`${t("transaction.cell-info")} `}
          </Tooltip>
        )
      }
    </div>
  )
}
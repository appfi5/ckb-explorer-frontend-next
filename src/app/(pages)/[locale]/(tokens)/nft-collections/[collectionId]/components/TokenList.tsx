import CardPanel from "@/components/Card/CardPanel";
import Empty from "@/components/Empty";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import server from "@/server";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from './TokenList.module.scss';
import AssetContainer from "@/components/AssetContainer";
import DescItem from "@/components/Card/DescItem";
import TextEllipsis from "@/components/TextEllipsis";
import Link from "next/link";
import useDOBRender from "@/hooks/useDOBRender";


export default function NFTCollectionTokenList({ collectionId }: { collectionId: string }) {
  const { t } = useTranslation("tokens");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const query = useQuery({
    queryKey: ["nft-collection-tokens", page, pageSize, collectionId],
    queryFn: async () => {
      const pageRes = await server.explorer("GET /nft/collections/{typeScriptHash}/items", {
        typeScriptHash: collectionId,
        page,
        pageSize,
      })
      return {
        data: pageRes?.records ?? [],
        total: pageRes?.total ?? 0,
        current: pageRes?.current ?? page,
      }
    },
    placeholderData: keepPreviousData
  })
  const list = query.data?.data ?? [];
  const loading = query.isLoading || query.isPlaceholderData;
  const total = query.data?.total ?? 0;
  return (
    <CardPanel className="relative p-5">
      {
        loading && (
          <div className="absolute top-0 bottom-0 left-0 right-0 z-2 flex items-center justify-center bg-[#999]/10 dark:bg-[#111]/10">
            <Loading />
          </div>
        )
      }
      {!!list.length && <div className="text-sm mb-4 font-medium">{t("title.quantity")}: {total}</div>}
      <div className="grid grid-cols-[repeat(auto-fill,288px)] gap-y-4 gap-x-2 justify-between">
        {list.map((item) => (
          <Link href={`/nft-collections/${collectionId}/${item.tokenId}`}>
            <TokenCard
              key={item.tokenId}
              item={item}
            />
          </Link>

        ))}
      </div>
      {
        !loading && !list.length && (
          <div className="flex justify-center items-center h-60 text-center">
            {!loading && <Empty />}
          </div>
        )
      }
      <Pagination
        total={total}
        paginationType="page"
        currentPage={page}
        pageSize={pageSize}
        setPageSize={setPageSize}
        onChange={setPage}
      />
    </CardPanel>
  )
}



function TokenCard({ item }: { item: APIExplorer.NftItemDetailResponse }) {
  const { t } = useTranslation("tokens");
  const { data: imgSrc, isLoading } = useDOBRender({ type: "dob", id: item.tokenId, data: item.data })
  return (
    <div className={styles.tokenCard}>
      <AssetContainer className="flex-none size-[264px] rounded-lg overflow-hidden">
        {
          !isLoading && (
            <img
              className="w-full h-full object-scale-down"
              src={imgSrc}
            />
          )
        }
      </AssetContainer>
      <div className="mt-3 p-3 bg-[#fbfbfb] dark:bg-[#232323]/90 rounded-lg flex flex-col gap-2">
        <DescItem
          label={t("field.token_id")}
          textDirection="right"
        >
          <TextEllipsis
            className="inline underline hover:text-primary"
            text={item.tokenId}
            ellipsis={{ head: 8, tail: -8 }}
          />
        </DescItem>
        <DescItem
          label={t("field.owner")}
          textDirection="right"
        >
          <Link href={`/address/${item.owner}`}>
            <TextEllipsis
              className="inline underline hover:text-primary"
              text={item.owner}
              ellipsis={{ head: 8, tail: -8 }}
            />
          </Link>
        </DescItem>
      </div>
    </div>
  )
}
import Filter from "@/components/Filter";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import TanstackTable from "@/components/TanstackTable";
import SortButton, { type SortValue } from "@/components/TanstackTable/SortButton";
// import { useSearchParams } from "@/hooks";
import server from "@/server";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";



export default function NFTCollectionHolderList({ collectionId }: { collectionId: string }) {
  const { t } = useTranslation("tokens");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  // const params = useSearchParams('tab', 'filter');
  const params = useSearchParams();
  const router = useRouter();
  const filter = params.get("filter");
  const sort = params.get("sort");
  const query = useQuery({
    queryKey: ["nft-collections-holders", page, pageSize, collectionId, filter, sort],
    queryFn: async () => {
      const haveFilter = !!filter;
      const isSearchingAddress = haveFilter && filter?.startsWith("ck");
      if (haveFilter && !isSearchingAddress) {
        return {
          data: [],
          total: 0,
          current: 1,
        }
      }
      const pageRes = await server.explorer("GET /nft/collections/{typeScriptHash}/holders", {
        typeScriptHash: collectionId,
        page,
        pageSize,
        addressHash: isSearchingAddress ? filter : "",
        sort
      })
      return {
        data: pageRes?.records ?? [],
        total: pageRes?.total ?? 0,
        current: pageRes?.current ?? page,
      }
    },
    placeholderData: keepPreviousData
  })
  const columns: ColumnDef<APIExplorer.NftHolderResp>[] = [
    {
      header: t("field.holder"),
      accessorKey: 'addressHash',
      enablePinning: false,
      cell: ({ row }) => {
        const fromAddr = row.original.addressHash
        if (!fromAddr) return '-'
        return (
          <Link
            className="font-menlo underline hover:text-primary"
            href={`/address/${fromAddr}`}
          >
            {fromAddr}
          </Link>
        )
      }
    },
    {
      header: () => (
        <div className="flex flex-row items-center gap-1">
          <span>{t("field.quantity")}</span>
          <SortButton
            className="pr-4"
            fieldName="holdersCount"
            defaultValue={params.get("sort") as SortValue}
            onChange={(nextSort) => {
              const nextParams = new URLSearchParams(params);
              if(!nextSort) {
                nextParams.delete("sort");
              } else {
                nextParams.set("sort", nextSort);
              }
              router.push(`?${nextParams.toString()}`, { scroll: false });
            }}
          />
        </div>
      ),
      accessorKey: 'holdersCount',
      enablePinning: false,
    },
  ];

  const loading = query.isLoading || query.isPlaceholderData;
  const total = query.data?.total ?? 0;

  return (
    <>
      <Filter
        className="hidden sm:block absolute top-6 right-6"
        placeholder={t("search.address")}
        defaultValue={filter ?? ''}
        onFilter={filter => {
          const nextParams = new URLSearchParams(params);
          nextParams.set('filter', filter);
          router.push(`?${nextParams}`)
        }}
        onReset={() => {
          const nextParams = new URLSearchParams(params);
          nextParams.delete("filter")

          router.push(`?${nextParams}`)
        }}
      />
      <div className="relative">
        {
          loading && (
            <div className="absolute top-0 bottom-0 left-0 right-0 z-2 flex items-center justify-center bg-[#999]/10 dark:bg-[#111]/10">
              <Loading />
            </div>
          )
        }
        <TanstackTable
          columns={columns}
          dataSource={query.data?.data ?? []}
          loading={loading}
        />
        <Pagination
          total={total}
          currentPage={page}
          pageSize={pageSize}
          setPageSize={setPageSize}
          onChange={setPage}
        />
      </div>

    </>
  )
}
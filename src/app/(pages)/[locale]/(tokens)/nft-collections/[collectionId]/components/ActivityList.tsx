import DateTime from "@/components/DateTime";
import Filter from "@/components/Filter";
import Loading from "@/components/Loading";
import MultiFilterButton from "@/components/MultiFilterButton";
import Pagination from "@/components/Pagination";
import TanstackTable from "@/components/TanstackTable";
import TextEllipsis from "@/components/TextEllipsis";
import useDOBRender from "@/hooks/useDOBRender";
// import { useSearchParams } from "@/hooks";
import server from "@/server";
import { addPrefixForHash } from "@/utils/string";
import { isTxHash } from "@/utils/validator";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";


function DOBCover({ data, tokenId }: { tokenId: string, data: string }) {
  const { data: imgData, isLoading } = useDOBRender({ type: 'dob', data, id: tokenId })

  return (
    <div className="flex-none size-12 bg-[#eee] dark:bg-[#303030] rounded-sm overflow-hidden">
      {
        !isLoading && (
          <img
            className="size-12 rouned-sm object-scale-down"
            src={imgData}
          />
        )
      }
    </div>
  )
}

export default function NFTCollectionActivtyList({ collectionId }: { collectionId: string }) {
  const { t } = useTranslation("tokens");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  // const params = useSearchParams('tab', 'filter');
  const params = useSearchParams();
  const router = useRouter();
  const filter = params.get("filter");
  const actions = params.get("action");
  const query = useQuery({
    queryKey: ["nft-collections-transactions", page, pageSize, collectionId, filter, actions],
    queryFn: async () => {
      const haveFilter = !!filter;
      const isSearchingAddress = haveFilter && filter?.startsWith("ck");
      const isSearchingTxHash = haveFilter && isTxHash(filter);
      if (haveFilter && !isSearchingAddress && !isSearchingTxHash) {
        return {
          data: [],
          total: 0,
          current: 1,
        }
      }
      const pageRes = await server.explorer("GET /nft/collections/{typeScriptHash}/transfers", {
        typeScriptHash: collectionId,
        page,
        pageSize,
        addressHash: isSearchingAddress ? filter : "",
        txHash: isSearchingTxHash ? addPrefixForHash(filter) : "",
        action: actions,
      })
      return {
        data: pageRes?.records ?? [],
        total: pageRes?.total ?? 0,
        current: pageRes?.current ?? page,
      }
    },
    placeholderData: keepPreviousData
  })
  const columns: ColumnDef<APIExplorer.NftTransfersResp>[] = [
    {
      header: t("transaction.nft"),
      accessorKey: 'tokenId',
      cell: ({ row }) => {
        const { tokenId, data } = row.original;
        return (
          <Link className="flex flex-row items-center gap-2 w-50 group" href={`/nft-collections/${collectionId}/${tokenId}`}>
            <DOBCover tokenId={tokenId} data={data} />
            <span className="font-hash truncate underline group-hover:text-primary">{tokenId}</span>
          </Link>
        )
      },
      enablePinning: false,
    },
    {
      header: t("transaction.tx"),
      accessorKey: 'transactionHash',
      enablePinning: false,
      cell: ({ row }) => {
        const txHash = row.original.txHash;
        return (
          <Link
            href={`/transaction/${txHash}`}
          >
            <TextEllipsis
              text={txHash}
              className="inline underline hover:text-primary"
              ellipsis="transaction"
            />
          </Link>
        )
      },
    },
    {
      header: () => (
        <div className="flex flex-row items-center">
          {t('transaction.action')}
          <MultiFilterButton
            filterName="action"
            filterList={[
              {
                key: 'mint',
                value: 'mint?',
                title: t('transaction.action_mint'),
                to: `/nft-collections/${collectionId}`
              },
              {
                key: 'transfer',
                value: 'transfer?',
                title: t('transaction.action_transfer'),
                to: `/nft-collections/${collectionId}`
              },
              {
                key: 'burn',
                value: 'burn?',
                title: t('transaction.action_burn'),
                to: `/nft-collections/${collectionId}`
              }
            ]}
          />
        </div>
      ),
      accessorKey: 'action',
      enablePinning: false,
    },
    {
      header: t('transaction.age'),
      accessorKey: 'blockTimestamp',
      enablePinning: false,
      cell: ({ row }) => (
        <div className="font-hash">
          <DateTime date={row.original.blockTimestamp} showRelative />
        </div>
      ),
    },
    {
      header: t("transaction.from"),
      accessorKey: 'from',
      enablePinning: false,
      cell: ({ row }) => {
        const fromAddr = row.original.from
        if (!fromAddr) return '-'
        return (
          <Link
            href={`/address/${fromAddr}`}
          >
            <TextEllipsis
              text={fromAddr}
              className="inline underline hover:text-primary"
              ellipsis="address"
            />
          </Link>
        )
      }
    },
    {
      header: t("transaction.to"),
      accessorKey: 'to',
      enablePinning: false,
      cell: ({ row }) => {
        const toAddr = row.original.to
        if (!toAddr) return '-'
        return (
          <Link
            href={`/address/${toAddr}`}
          >
            <TextEllipsis
              text={toAddr}
              className="inline underline hover:text-primary"
              ellipsis="address"
            />
          </Link>
        )
      }
    },
  ];

  const loading = query.isLoading || query.isPlaceholderData;
  const total = query.data?.total ?? 0;

  return (
    <>
      <Filter
        className="hidden sm:block absolute top-6 right-6"
        placeholder={t("search.address_or_hash")}
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
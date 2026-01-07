"use client"

import { useTranslation } from "react-i18next"
import { useQuery } from "@tanstack/react-query"
import server from "@/server"
import Qrcode from "@/components/Qrcode"
import AddressOverview from "./components/AddressOverview"
import { QueryResult } from "@/components/QueryResult"
import AddressTransactions from "./components/AddressTransactions"
import HashCardHeader from "@/components/Card/HashCardHeader"
import useDASAccount from "@/hooks/useDASAccount"
import TextEllipsis from "@/components/TextEllipsis"

export default function AddressDetail({ address }: { address: string }) {
  const { t } = useTranslation();
  const dasAccount = useDASAccount(address)
  const addressQuery = useQuery({
    queryKey: ["address", address],
    queryFn: async () => {
      const res = await server.explorer("GET /addresses/{address}", { address });
      if (!res) throw new Error(t("toast.address_not_found"))
      return res
    }
  })
  return (
    <div className="container flex flex-col gap-5 pb-10 min-h-[730px]">
      <HashCardHeader
        hash={address}
        type="address"
        actions={[<Qrcode text={address} />]}
        extra={
          !!dasAccount && (
            <a className="flex-none flex flex-row items-center gap-1 py-2 px-2.5 border ml-1 border-[#999] bg-[#FBFBFB] dark:bg-[#303030] rounded-sm" href={`https://data.did.id/${dasAccount}`} target="_blank" rel="noreferrer">
              <img className="size-5" src={`https://display.did.id/identicon/${dasAccount}`} alt={dasAccount} />
              <TextEllipsis
                className="underline leading-[1em] hover:text-primary"
                text={dasAccount}
                ellipsis={{ head: 8, tail: -8 }}
              />
            </a>
          )
        }
      />
      <QueryResult query={addressQuery} defaultLoadingClassName='min-h-[400px]'>
        {(addressInfo) => (
          <>
            <AddressOverview addressInfo={addressInfo} />
            <AddressTransactions addressInfo={addressInfo} />
          </>
        )}
      </QueryResult>
    </div>
  )
}


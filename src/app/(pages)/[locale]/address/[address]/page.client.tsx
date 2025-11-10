"use client"

import { useTranslation } from "react-i18next"
import { useQuery } from "@tanstack/react-query"
import server from "@/server"
import Qrcode from "@/components/Qrcode"
import AddressOverview from "./components/AddressOverview"
import { QueryResult } from "@/components/QueryResult"
import AddressTransactions from "./components/AddressTransactions"
import HashCardHeader from "@/components/Card/HashCardHeader"

export default function AddressDetail({ address }: { address: string }) {
  const { t } = useTranslation();
  const addressQuery = useQuery({
    queryKey: ["address", address],
    queryFn: async () => {
      const res = await server.explorer("GET /addresses/{address}", { address });
      if (!res) throw new Error(t("toast.address_not_found"))
      return res
    }
  })
  return (
    <div className="container flex flex-col gap-[20px] pb-[40px] min-h-[730px]">
      <HashCardHeader
        hash={address}
        type="address"
        actions={[<Qrcode text={address} />]}
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


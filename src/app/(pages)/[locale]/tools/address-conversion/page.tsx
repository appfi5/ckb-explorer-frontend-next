"use client"

import Card from "@/components/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { AddressToScript } from "./AddressToScript"
import { ScriptToAddress } from "./ScriptToAddress"



export default function AddressConversion() {
  const { t } = useTranslation("tools")
  return (
    <Card className="py-5 px-10 h-full">
      <div className="text-lg mb-4.5 font-medium">{t("address_conversion.title")}</div>
      <div className="font-medium mb-5 dark:text-[#999]">
        {t("address_conversion.description")}
        <Link
          className="text-primary hover:underline"
          href="https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0021-ckb-address-format/0021-ckb-address-format.md"
          target="_blank"
          rel="noreferrer"
        >
          {t("address_conversion.rfc")}
        </Link>
      </div>
      <Tabs defaultValue="address2script">
        <TabsList style={{ width: '100%' }}>
          <TabsTrigger value="address2script">{t('address_conversion.address_to_script')}</TabsTrigger>
          <TabsTrigger value="script2address">{t('address_conversion.script_to_address')}</TabsTrigger>
        </TabsList>
        <TabsContent value="address2script">
          <AddressToScript />
        </TabsContent>
        <TabsContent value="script2address">
          <ScriptToAddress />
        </TabsContent>
      </Tabs>
    </Card>
  )
}
"use client"

import Card from "@/components/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs"
import { useTranslation } from "react-i18next"
import { DataToHash } from "./DataToHash"
import { ScriptToHash } from "./ScriptToHash"
import { Hash160 } from "./Hash160"



export default function Hasher() {
  const { t } = useTranslation("tools")
  return (
    <Card className="py-5 px-10 h-full">
      <div className="text-lg mb-5 font-medium">{t("hasher.title")}</div>
      <Tabs defaultValue="script_to_hash">
        <TabsList style={{ width: '100%' }}>
          <TabsTrigger value="script_to_hash">{t('hasher.script_to_hash')}</TabsTrigger>
          <TabsTrigger value="data_to_hash">{t('hasher.data_to_hash')}</TabsTrigger>
          <TabsTrigger value="hash160">{t('hasher.hash160')}</TabsTrigger>
        </TabsList>
        <TabsContent value="script_to_hash">
          <ScriptToHash />
        </TabsContent>
        <TabsContent value="data_to_hash">
          <DataToHash />
        </TabsContent>
        <TabsContent value="hash160">
          <Hash160 />
        </TabsContent>
      </Tabs>
    </Card>
  )
}
"use client"

import Card from "@/components/Card"
import CardPanel from "@/components/Card/CardPanel"
import DescItem from "@/components/Card/DescItem"
import CopyableText from "@/components/CopyableText"
import { Button } from "@/components/shadcn/button"
import { Textarea } from "@/components/shadcn/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs"
import { env } from "@/env"
import { NodeService } from "@/services/NodeService"
import { getEnvChainNodes } from "@/utils/envVarHelper"
import CKBRPC from "@nervosnetwork/ckb-sdk-rpc"
import { useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"



export default function BroadcastTx() {
  const { t } = useTranslation("tools");
  const txInpRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Partial<Record<'hash' | 'error', string>>>({});

  const [formatter] = useMemo(() => {
    const ins = new CKBRPC("");
    return [ins.paramsFormatter];
  }, []);
  const handleBroadcast = async () => {
    const inputted = txInpRef.current!.value
    if (!inputted) {
      setResult({ error: 'Please enter the transaction data' })
      return
    }

    try {
      setResult({})
      setLoading(true)
      let tx = JSON.parse(inputted.trim())
      if ('cellDeps' in tx) {
        // should be converted to snake_case
        tx = formatter.toRawTransaction(tx)
      }
      const nodes = getEnvChainNodes();
      const nodeService = new NodeService(nodes[0]!);
      const hash = await nodeService.sendTransaction(tx)
      setResult({ hash })
    } catch (e) {
      if (e instanceof Error) {
        setResult({ error: e.message })
        return
      }
      setResult({ error: 'Fail to broadcast the transaction' })
    } finally {
      setLoading(false)
    }
  };


  return (
    <Card className="py-5 px-10 h-full">
      <div className="text-lg mb-5 font-medium">{t("broadcast_tx.title")}</div>
      <div className="mb-1 dark:text-[#999]">{t('broadcast_tx.tx_to_broadcast')}:</div>
      <Textarea
        ref={txInpRef}
        placeholder={`${t('please_enter')} ${t('broadcast_tx.tx_to_broadcast')}`}
        className="block resize-none min-h-[160px]"
      />

      <div className="flex justify-center items-center mt-3">
        <Button loading={loading} onClick={handleBroadcast}>{t("broadcast_tx.broadcast")}</Button>
      </div>

      {
        (!!result.hash || !!result.error) && (
          <CardPanel className='p-5 mt-4 rounded-[8px]!'>
            {
              result.hash && (
                <DescItem label={<div className='w-20'>Tx Hash:</div>} flex={{ label: 'none', content: 1 }}>
                  <CopyableText>{result.hash}</CopyableText>
                </DescItem>
              )
            }
            {result.error ? <span className="text-destructive">{result.error}</span> : null}
          </CardPanel>
        )
      }

    </Card>
  )
}
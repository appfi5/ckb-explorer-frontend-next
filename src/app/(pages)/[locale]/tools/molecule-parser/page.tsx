"use client"

import Card from "@/components/Card"
import Link from "next/link"
import { Trans, useTranslation } from "react-i18next"
import { useCallback, useEffect, useState } from "react"
import { Molecule, CACHE_KEY as MOL_CACHE_KEY } from './Molecule'
import { cacheService } from "@/services/CacheService"
import { blockchainSchema, builtinCodecs, mergeBuiltinCodecs, type CodecMap } from "./constants"
import { SchemaSelect } from "./SchemaSelect"
import DataInput from "./DataInput"


export default function MoleculeParser() {
  const { t } = useTranslation("tools")
  const [codecMap, setCodecMap] = useState<CodecMap>({})
  const [selectedCodecName, setSelectedCodecName] = useState<string>('')

  const handleCodecMap = useCallback(
    (codecMap: CodecMap) => {
      setCodecMap(codecMap)
      setSelectedCodecName(Object.keys(codecMap)[0])
    },
    [setCodecMap, setSelectedCodecName],
  )
  const handleSelectCodec = (name: string) => {
    setSelectedCodecName(name)
  }

  useEffect(() => {
    const codecMap = mergeBuiltinCodecs(builtinCodecs)
    handleCodecMap(codecMap)
  }, [handleCodecMap])

  return (
    <Card className="py-5 px-10 h-full">
      <div className="text-lg mb-5 font-medium">{t("molecule_parser.title")}</div>
      <div className="dark:text-[#999]">
        <Trans
          ns="tools"
          i18nKey="molecule_parser.description"
          components={{
            LinkRFC008: (
              <Link
                href='https://github.com/nervosnetwork/rfcs/blob/e419bb7ea79ebf996a104b1a7e844c792c8ab3c5/rfcs/0008-serialization/0008-serialization.md'
                target='_blank'
                rel='noreferrer'
                className="text-primary hover:underline"
              />
            ),
            LinkBlockChainMol: (
              <Link
                href='https://github.com/nervosnetwork/ckb/blob/5a7efe7a0b720de79ff3761dc6e8424b8d5b22ea/util/types/schemas/blockchain.mol'
                target='_blank'
                rel='noopener noreferrer'
                className="text-primary hover:underline"
              />
            )
          }}
        />
      </div>

      <Molecule updateCodecMap={handleCodecMap} />

      {Object.keys(codecMap).length > 0 && (
        <SchemaSelect selectedCodecName={selectedCodecName} codecMap={codecMap} onSelectCodec={handleSelectCodec} />
      )}
      {Object.keys(codecMap).length > 0 && selectedCodecName !== '' && (
        <DataInput typeName={selectedCodecName} codec={codecMap[selectedCodecName]} />
      )}

    </Card>
  )
}
import React, { useState } from 'react'
import { hexFrom, mol } from '@ckb-ccc/core'
import { Alert, AlertTitle, AlertDescription } from '@/components/shadcn/alert'
import { Textarea } from '@/components/shadcn/input'
import { Button } from '@/components/shadcn/button'
import CardPanel from '@/components/Card/CardPanel'
import { useTheme } from '@/components/Theme'
import dynamic from 'next/dynamic'

const JsonView = dynamic(() => import("@microlink/react-json-view"), {
  ssr: false
})

export type UnpackType = string | number | undefined | { [property: string]: UnpackType } | UnpackType[]

type DataInputProps = {
  typeName?: string;
  codec: mol.CodecLike<any> | undefined
}

const formatInput = (input: string): string => {
  if (!input.startsWith('0x')) {
    return `0x${input}`
  }
  return input
}

const isBlank = (data: UnpackType): boolean => {
  if (!data) {
    return true
  }
  return false
}

export default function DataInput ({ typeName, codec }: DataInputProps) {
  const [inputData, setInputData] = useState<string>('')
  const [theme] = useTheme();
  const isDarkTheme = theme === 'dark';
  const [result, setResult] = useState<UnpackType>(undefined)
  const [errorMsg, setErrorMsg] = useState<string>('')

  const handleDecode = () => {
    if (!codec) {
      setErrorMsg('please select codec')
      return
    }
    try {
      const formattedInput = formatInput(inputData)
      const hexData = hexFrom(formattedInput)
      const result = codec.decode(hexData)
      setResult(result)
      setErrorMsg('')
    } catch (error: unknown) {
      setResult(undefined)
      setErrorMsg((error as Error).message)
    }
  }
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputData(e.target.value)
  }
  return (
    <>
      <div className="mt-4">
        <div className="mb-1 dark:text-[#999]">Input data</div>
        <Textarea
          value={inputData}
          onChange={handleChange}
          placeholder="0x..."
          className="block resize-none min-h-[160px]"
        />
      </div>

      <div className="flex justify-center items-center mt-3">
        <Button onClick={handleDecode}>
          Decode!
        </Button>
      </div>

      {!isBlank(result) && (
        <CardPanel className="p-4 mt-1 rounded-[8px]!">
          {typeof result === 'object'
            ? (
              <JsonView
                src={result}
                name={typeName || false}
                indentWidth={4}
                collapseStringsAfterLength={100}
                groupArraysAfterLength={20}
                iconStyle="square"
                displayDataTypes={false}
                quotesOnKeys={false}
                style={{
                  borderRadius: 4,
                  // background: isDarkTheme ? "#111" : "#fff",
                  padding: 8,
                  overflow: "auto",
                  // color: isDarkTheme ? "#fff" : "#232323",
                }}
                theme={{
                  base00: isDarkTheme ? "#111" : "#fff",
                  base01: "#ddd",
                  base02: "#ddd",
                  base03: "#444",
                  base04: "purple",
                  base05: "#444",
                  base06: "#444",
                  base07: isDarkTheme ? "#fff" : "#232323", // "#444",
                  base08: "#444",
                  base09: "var(--color-primary)",
                  base0A: "var(--color-primary)",
                  base0B: "var(--color-primary)",
                  base0C: "var(--color-primary)",
                  base0D: "var(--color-primary)",
                  base0E: "var(--color-primary)",
                  base0F: "var(--color-primary)",
                }}
              />
            )
            : (
              <div className="bg-white dark:bg-[#111] p-2 rounded-[4px] break-all whitespace-normal">
                {result}
              </div>
            )}
        </CardPanel>
      )}

      {errorMsg && (
        <Alert className="mt-1" variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription><pre className='break-all whitespace-normal'>{errorMsg}</pre></AlertDescription>
        </Alert>
      )}
    </>
  )
}

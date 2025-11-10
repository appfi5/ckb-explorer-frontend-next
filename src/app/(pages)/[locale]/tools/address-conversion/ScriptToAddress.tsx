import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group'
import { parseMultiVersionAddress, type ParseResult } from './parseMultiVersionAddress'
import { HashType } from '@/constants/common'
import { MultiVersionAddress } from './MultiVersionAddress'
import { isMultiVersionAddress, isErr } from './types'
import { Textarea } from '@/components/shadcn/input'
import CardPanel from '@/components/Card/CardPanel'
import { useQuery } from '@tanstack/react-query'
import ErrorMessage from '../components/ErrorMessage'

export const ScriptToAddress: React.FC = () => {
  const [codeHash, setCodeHash] = useState('')
  const [args, setArgs] = useState('')
  const [hashType, setHashType] = useState(HashType.TYPE)
  const { t } = useTranslation("tools")

  const {
    data: parsed = {
      mainnet: undefined,
      testnet: undefined,
    },
  } = useQuery({
    queryKey: ['script_to_address', codeHash, hashType, args],
    queryFn: async () => {
      const [mainnet, testnet] = await Promise.all([
        parseMultiVersionAddress({ codeHash, hashType, args }, true),
        parseMultiVersionAddress({ codeHash, hashType, args }, false),
      ])

      return { mainnet, testnet }
    },
  })

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div>
          <div className="mb-1 dark:text-[#999]">Code Hash:</div>
          <Textarea
            placeholder={`${t('please_enter')} Code Hash`}
            value={codeHash}
            onChange={e => setCodeHash(e.target.value)}
            className="resize-none"
          />
        </div>

        <div>
          <div className="mb-1 dark:text-[#999]">Hash Type:</div>
          <RadioGroup
            className="flex flex-row"
            onValueChange={value => setHashType(value as HashType)}
            value={hashType}
          >
            {Object.values(HashType).map(hashType => (
              <div className="flex flex-row items-center gap-2" key={hashType}>
                <RadioGroupItem value={hashType} id={hashType} />
                <label className='dark:text-[#999]' htmlFor={hashType}>{hashType.toLowerCase()}</label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div>
          <div className="mb-1 dark:text-[#999]">Args:</div>
          <Textarea
            placeholder={`${t('please_enter')} Args`}
            value={args}
            onChange={e => setArgs(e.target.value)}
            className="resize-none"
          />
        </div>

      </div>

      {args !== '' && codeHash !== '' && (
        <CardPanel className='p-5 mt-4 rounded-lg!'>
          <h2 className='font-medium'>Mainnet</h2>
          {isErr(parsed.mainnet) && <ErrorMessage>{parsed.mainnet.error}</ErrorMessage>}
          {isMultiVersionAddress(parsed.mainnet) && (
            <MultiVersionAddress displayName multiVersionAddr={parsed.mainnet} />
          )}
        </CardPanel>
      )}

      {args !== '' && codeHash !== '' && (
        <CardPanel className='p-5 mt-4 rounded-lg!'>
          <h2 className='font-medium'>Testnet</h2>
          {isErr(parsed.testnet) && <ErrorMessage>{parsed.testnet.error}</ErrorMessage>}
          {isMultiVersionAddress(parsed.testnet) && (
            <MultiVersionAddress displayName multiVersionAddr={parsed.testnet} />
          )}
        </CardPanel>
      )}
    </div>
  )
}

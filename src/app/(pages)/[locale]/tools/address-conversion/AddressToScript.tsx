import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { parseMultiVersionAddress } from './parseMultiVersionAddress'
import CopyableText from '@/components/CopyableText'
import { MultiVersionAddress } from './MultiVersionAddress'
import { isMultiVersionAddress, isErr } from './types'
import { Input, Textarea } from '@/components/shadcn/input'
import CardPanel from '@/components/Card/CardPanel'
import DescItem from '@/components/Card/DescItem'
import { useQuery } from '@tanstack/react-query'
import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import ErrorMessage from '../components/ErrorMessage'

export const AddressToScript: React.FC = () => {
  const [address, setAddress] = useState('')
  const { t } = useTranslation("tools")
  const { data: parsed } = useQuery({
    queryKey: ['address_to_script', address],
    queryFn: () => {
      if (!address) return null
      const prefix = address.substring(0, 3)
      const isMainnet = prefix === 'ckb'

      let script: CKBComponents.Script
      try {
        script = addressToScript(address)
      } catch {
        return { error: 'Invalid address' }
      }

      return parseMultiVersionAddress(script, isMainnet)
    },
  })

  return (
    <div>
      <div className="mb-1 dark:text-[#999]">CKB Address:</div>
      <Textarea
        value={address}
        onChange={e => setAddress(e.target.value)}
        placeholder={`${t('please_enter')} CKB address`}
        className="resize-none mb-5"
      />

      {isErr(parsed) && (
        <CardPanel className="p-5 rounded-lg!">
          <ErrorMessage>
            {parsed.error}
          </ErrorMessage>
        </CardPanel>
      )}
      {isMultiVersionAddress(parsed) && (
        <CardPanel className='flex flex-col p-5 gap-1 rounded-lg!'>
          <MultiVersionAddress displayName multiVersionAddr={parsed} />
          <DescItem label={<div className='w-20'>Code Hash:</div>} flex={{ label: 'none', content: 1 }}>
            <span className="font-menlo break-all"><CopyableText>{parsed.script.codeHash}</CopyableText></span>
          </DescItem>
          <DescItem label={<div className='w-20'>Hash Type:</div>} flex={{ label: 'none', content: 1 }}>
            <span ><CopyableText>{parsed.script.hashType}</CopyableText></span>
          </DescItem>
          <DescItem label={<div className='w-20'>Args:</div>} flex={{ label: 'none', content: 1 }}>
            <span className="font-menlo break-all"><CopyableText>{parsed.script.args}</CopyableText></span>
          </DescItem>
        </CardPanel>
      )}
    </div>
  )
}
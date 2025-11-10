import React from 'react'
import type { MultiVersionAddress as MultiVersionAddressType } from './types'
import CopyableText from '@/components/CopyableText'
import DescItem from '@/components/Card/DescItem'
import ScriptTag from '@/components/ScriptTag'

export const MultiVersionAddress: React.FC<{
  multiVersionAddr: MultiVersionAddressType
  displayName?: boolean
}> = ({ multiVersionAddr, displayName }) => {
  return (
    <>
      {displayName && multiVersionAddr.name && (
        <DescItem label={<div className='w-20'>Lock:</div>} flex={{ label: 'none', content: 1 }}>
          <ScriptTag category="lock" script={multiVersionAddr.script} />
        </DescItem>
      )}
      <DescItem label={<div className='w-20'>CKB2021:</div>} flex={{ label: 'none', content: 1 }}>
        <span className="break-all"><CopyableText>{multiVersionAddr.ckb2021FullFormat}</CopyableText></span>
      </DescItem>
    </>
  )
}

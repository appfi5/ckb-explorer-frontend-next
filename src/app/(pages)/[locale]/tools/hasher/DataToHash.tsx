import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HasherCkb } from '@ckb-ccc/core'
// import styles from './dataToHash.module.scss'
import CopyableText from '@/components/CopyableText'
import { Textarea } from '@/components/shadcn/input'
import CardPanel from '@/components/Card/CardPanel'
import DescItem from '@/components/Card/DescItem'
import ErrorMessage from '../components/ErrorMessage'

const blake2b = (data: string) => {
  const hasher = new HasherCkb()
  hasher.update(data)
  return hasher.digest()
}
export const DataToHash: React.FC = () => {
  const [data, setData] = useState('')
  const { t } = useTranslation("tools")

  const [hash, error] = useMemo(() => {
    const v = data.trim()
    if (!v) return [null, null]
    try {
      return [blake2b(v), null]
    } catch (e) {
      if (e instanceof Error) {
        const msg = e.message.split('\n')[0]
        if (msg) {
          return [null, msg]
        }
        return [null, e.message]
      }
      return [null, `${e}`]
    }
  }, [data])

  return (
    <div>
      <div>
        <div className="mb-1 dark:text-[#999]">Data:</div>
        <Textarea
          id="value"
          placeholder={`${t('please_enter')} ${t('hasher.data')}`}
          value={data}
          onChange={e => setData(e.target.value?.replace(/\s/g, ''))}
          className="resize-none"
        />
      </div>


      {
        (!!hash || !!error) && (
          <CardPanel className='p-5 mt-4 rounded-[8px]!'>
            {
              hash && (
                <DescItem label={<div className='w-20'>Data Hash:</div>} flex={{ label: 'none', content: 1 }}>
                  <CopyableText>{hash}</CopyableText>
                </DescItem>
              )
            }
            {error ? <ErrorMessage>{error}</ErrorMessage> : null}
          </CardPanel>
        )
      }
    </div>
  )
}

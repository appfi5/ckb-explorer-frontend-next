import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HasherCkb } from '@ckb-ccc/core'
import CopyableText from '@/components/CopyableText'
import { Textarea } from '@/components/shadcn/input'
import CardPanel from '@/components/Card/CardPanel'
import DescItem from '@/components/Card/DescItem'
import ErrorMessage from '../components/ErrorMessage'

const debounceInput = (fn: (value: unknown) => void, delay = 300) => {
  let timer: NodeJS.Timeout
  return (value: unknown) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.call(fn, value)
    }, delay)
  }
}

export const Hash160: React.FC = () => {
  const [value, setValue] = useState('')
  const { t } = useTranslation("tools")

  const [hash, error] = useMemo(() => {
    if (!value) return [null, null]
    try {
      // 42 for 0x + 40 for hash
      return [new HasherCkb().update(value).digest().slice(0, 42), null]
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
  }, [value])

  const saveValue = debounceInput(setValue)

  console.log({ hash, error })

  return (
    <div>
      {/* <div className={styles.value}>
        <label htmlFor="value">Value</label>

        <input
          id="value"
          placeholder={`${t('please_enter')} Value`}
          className={styles.input}
          value={value}
          onChange={e => saveValue(e.target.value?.replace(/\s/g, ''))}
        />
      </div> */}
      <div>
        <div className="mb-1 dark:text-[#999]">Value:</div>
        <Textarea
          placeholder={`${t('please_enter')} Value`}
          onChange={e => saveValue(e.target.value?.replace(/\s/g, ''))}
          className="resize-none"
        />
      </div>

      {/* {hash ? (
        <div className={styles.console}>
          <strong>Blake160:</strong>
          <CopyableText>{hash}</CopyableText>
        </div>
      ) : null}
      {error ? <span className={styles.error}>{error}</span> : null} */}
      {
        (!!hash || !!error) && (
          <CardPanel className='p-5 mt-4 rounded-[8px]!'>
            {
              hash && (
                <DescItem label={<div className='w-20'>Blake160:</div>} flex={{ label: 'none', content: 1 }}>
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

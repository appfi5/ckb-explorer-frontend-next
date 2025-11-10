import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Script, type ScriptLike } from '@ckb-ccc/core'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group'
import { HashType } from '@/constants/common'
// import styles from './scriptToHash.module.scss'
import CopyableText from '@/components/CopyableText'
import { Textarea } from '@/components/shadcn/input'
import CardPanel from '@/components/Card/CardPanel'
import DescItem from '@/components/Card/DescItem'
import ErrorMessage from '../components/ErrorMessage'

const debounceInput = (fn: (val: unknown) => void, delay = 300) => {
  let timer: NodeJS.Timeout
  return (value: unknown) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.call(this, value)
    }, delay)
  }
}

export const ScriptToHash: React.FC = () => {
  const [script, setScript] = useState<ScriptLike>({
    codeHash: '',
    hashType: 'type',
    args: '',
  })
  const { t } = useTranslation("tools")

  const [hash, error] = useMemo(() => {
    if (!script.codeHash || !script.hashType || !script.args) return [null, null]
    try {
      return [Script.from(script).hash(), null]
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
  }, [script])

  const saveScript = debounceInput(setScript)

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div>
          <div className="mb-1 dark:text-[#999]">Code Hash:</div>
          <Textarea
            placeholder={`${t('please_enter')} Code Hash`}
            onChange={e => saveScript((s: Script) => ({ ...s, codeHash: e.target.value }))}
            className="resize-none"
          />
        </div>

        <div>
          <div className="mb-1 dark:text-[#999]">Hash Type:</div>
          <RadioGroup
            className="flex flex-row"
            onValueChange={value => saveScript((s: Script) => ({ ...s, hashType: value }))}
            value={script.hashType.toString()}
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
            onChange={e => saveScript((s: Script) => ({ ...s, args: e.target.value }))}
            className="resize-none"
          />
        </div>
      </div>
      {
        (!!hash || !!error) && (
          <CardPanel className='p-5 mt-4 rounded-[8px]!'>
            {
              hash && (
                <DescItem label={<div className='w-20'>Script Hash:</div>} flex={{ label: 'none', content: 1 }}>
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

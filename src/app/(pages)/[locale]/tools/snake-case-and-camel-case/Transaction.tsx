"use client"
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
// import paramsFormatter from '@nervosnetwork/ckb-sdk-rpc/lib/paramsFormatter'
// import resultFormatter from '@nervosnetwork/ckb-sdk-rpc/lib/resultFormatter'
import CKBRPC from '@nervosnetwork/ckb-sdk-rpc';
import CopyIcon from '@/assets/icons/copy.svg?component'
// import styles from './transaction.module.scss'
import { Textarea } from '@/components/shadcn/input';
import IconBox from '@/components/IconBox';
import { Button } from '@/components/shadcn/button';
import { toast } from 'sonner';
import ErrorMessage from '../components/ErrorMessage';
import Tooltip from '@/components/Tooltip';

const Transaction = () => {
  const [camelCase, setCamelCase] = useState({ value: '', error: '' })
  const [snakeCase, setSnakeCase] = useState({ value: '', error: '' })
  const [paramsFormatter, resultFormatter] = useMemo(() => {
    const ins = new CKBRPC("");
    return [ins.paramsFormatter, ins.resultFormatter];
  }, []);
  const { t } = useTranslation("tools")

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.stopPropagation()
    e.preventDefault()
    const elm = e.currentTarget
    const { value, id } = elm

    switch (id) {
      case 'camel-case': {
        setCamelCase({ value, error: '' })
        setSnakeCase({ value: '', error: '' })
        break
      }
      case 'snake-case': {
        setSnakeCase({ value, error: '' })
        setCamelCase({ value: '', error: '' })
        break
      }
      default: {
        // ignore
      }
    }
  }

  const handleConvert = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    const elm = e.currentTarget
    const { target } = elm.dataset

    switch (target) {
      case 'to-camel-case': {
        if (!snakeCase.value) return
        try {
          const v = JSON.parse(snakeCase.value)
          if (typeof v !== 'object') {
            throw new Error('Invalid Object')
          }
          setCamelCase({
            value: JSON.stringify(resultFormatter.toTransaction(v)),
            error: '',
          })
        } catch (e) {
          if (e instanceof Error) {
            const error = e.message
            setSnakeCase(v => ({ ...v, error }))
            break
          }
          setSnakeCase(v => ({ ...v, error: 'Unknown error' }))
        }
        break
      }
      case 'to-snake-case': {
        if (!camelCase.value) return
        try {
          const v = JSON.parse(camelCase.value)
          if (typeof v !== 'object') {
            throw new Error('Invalid Object')
          }
          setSnakeCase({
            value: JSON.stringify(paramsFormatter.toRawTransaction(v)),
            error: '',
          })
        } catch (e) {
          if (e instanceof Error) {
            const error = e.message
            setCamelCase(v => ({ ...v, error }))
            break
          }
          setSnakeCase(v => ({ ...v, error: 'Unknown error' }))
        }
        break
      }
      default: {
        // ignore
      }
    }
  }

  const handleCopy = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation()
    e.preventDefault()
    const elm = e.currentTarget
    const { target } = elm.dataset
    let value = ''
    switch (target) {
      case 'snake-case': {
        value = snakeCase.value
        break
      }
      case 'camel-case': {
        value = camelCase.value
        break
      }
      default: {
        // ignore
      }
    }
    if (!value) return
    navigator.clipboard.writeText(value).then(
      () => {
        // setToast({ message: t('common.copied') })
        toast.success(t('copied'))
      },
      error => {
        console.error(error)
      },
    )
  }

  return (
    <div>
      <div>
        <div className="mb-1 dark:text-[#999]">Snake Case:</div>
        <div className="relative">
          <Textarea
            id="snake-case"
            value={snakeCase.value}
            onChange={handleChange}
            placeholder={t('snake_case_and_camel_case.tx_in_snake_case')}
            className="resize-none min-h-[160px]"
          />
          <div className="absolute top-3 right-3">
            <Tooltip
              trigger={
                <IconBox data-target="snake-case" onClick={handleCopy}>
                  <CopyIcon width={14} height={14} />
                </IconBox>
              }
            >
              <div>{t("copy")}</div>
            </Tooltip>
          </div>

        </div>
        <ErrorMessage>{snakeCase.error}</ErrorMessage>
      </div>
      <div className="pt-3 pb-5 flex flex-row items-center justify-center gap-3">
        <Button data-target="to-camel-case" onClick={handleConvert}>To camel case ↓</Button>
        <Button data-target="to-snake-case" onClick={handleConvert}>To snake case ↑</Button>
      </div>
      <div>
        <div className="mb-1 dark:text-[#999]">Camel Case:</div>
        <div className="relative">
          <Textarea
            id="camel-case"
            value={camelCase.value}
            onChange={handleChange}
            placeholder={t('snake_case_and_camel_case.tx_in_camel_case')}
            className="resize-none min-h-[160px]"
          />
          <div className="absolute top-3 right-3">
            <Tooltip
              trigger={
                <IconBox data-target="snake-case" onClick={handleCopy}>
                  <CopyIcon width={14} height={14} />
                </IconBox>
              }
            >
              <div>{t("copy")}</div>
            </Tooltip>
          </div>
        </div>
        <ErrorMessage>{camelCase.error}</ErrorMessage>
      </div>
    </div>
  )
}

export default Transaction

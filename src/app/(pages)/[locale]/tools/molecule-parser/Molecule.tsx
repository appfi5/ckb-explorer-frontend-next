import React, { useCallback, useState } from 'react'
import { HelpTip } from '@/components/HelpTip'
import { blockchainSchema, mergeBuiltinCodecs } from './constants'
import { cacheService } from '@/services/CacheService'
import { Textarea } from '@/components/shadcn/input'
import { Button } from '@/components/shadcn/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/shadcn/alert'
import { parseSchema } from './parser'
import { t } from 'i18next'
import { useTranslation } from 'react-i18next'


type Props = {
  updateCodecMap: (token: any) => void
}

export const CACHE_KEY = 'inputMol'

export const Molecule: React.FC<Props> = ({ updateCodecMap }) => {
  const [showAlert, setShowAlert] = React.useState(false)
  const [inputMol, setInputMol] = useState(cacheService.get(CACHE_KEY) || '')
  const [parseErrorMsg, setParseErrorMsg] = React.useState<string>('')
  const [parseSuccess, setParseSuccess] = useState(false)
  const { t } = useTranslation("tools");
  const handleConfirm = useCallback(() => {
    try {
      // get user input schema, and append with primitive schema
      const userCodecMap = parseSchema(`${blockchainSchema}/n${inputMol}`);

      const codecMap = mergeBuiltinCodecs(userCodecMap)

      setParseSuccess(true)
      setShowAlert(true)
      setParseErrorMsg('')
      updateCodecMap(codecMap)
      cacheService.set(CACHE_KEY, inputMol, { expireTime: Number.POSITIVE_INFINITY })
    } catch (error: unknown) {
      setParseSuccess(false)
      setShowAlert(true)
      setParseErrorMsg((error as Error).message)
      updateCodecMap({})
    }
  }, [inputMol, setParseErrorMsg, setShowAlert, setParseSuccess, updateCodecMap])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMol(e.currentTarget.value)
  }

  return (
    <>
      <div className='mt-3'>
        <label className="flex items-center dark:text-[#999]" htmlFor="input-schema">
          Input schema(mol)
          <HelpTip>
            {t("molecule_parser.input_tips")}
          </HelpTip>
          :
        </label>
        <Textarea
          id="input-schema"
          value={inputMol}
          onChange={handleChange}
          placeholder="e.g. vector OutPointVec <OutPoint>;"
          className='block mt-1 resize-none min-h-[160px]'
        />

        {showAlert && (
          <Alert variant={parseSuccess ? 'success' : 'destructive'} className='mt-1'>
            <AlertTitle>{parseSuccess ? 'Success!' : 'Error!'}</AlertTitle>
            <AlertDescription className='max-h-[200px] overflow-y-auto'>
              {parseSuccess ? 'Molecule successfully parsed! You can select a schema now.' : <pre>{parseErrorMsg}</pre>}
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="flex justify-center items-center mt-3">
        <Button onClick={handleConfirm}>
          Parse!
        </Button>
      </div>
    </>
  )
}

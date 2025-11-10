import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';
import type { CodecMap } from './constants';

type Props = {
  codecMap: CodecMap
  selectedCodecName: string
  onSelectCodec: (name: string) => void
}

const createCodecOptionsFromMap = (codecMap: CodecMap): string[] => {
  return Object.keys(codecMap)
}

export const SchemaSelect: React.FC<Props> = ({ onSelectCodec, selectedCodecName, codecMap }) => {
  const handleChange = (newValue: string | null) => {
    onSelectCodec(newValue!)
  }
  const top100Films = createCodecOptionsFromMap(codecMap).map(film => ({
    label: film,
    value: film,
  }))

  return (
    <div>
      <div className="mb-1 dark:text-[#999]">Select schema(mol):</div>
      <Select
        value={selectedCodecName}
        onValueChange={value => handleChange(value)}
      >
        <SelectTrigger className="w-full bg-card p-3">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {
            top100Films.map(tab => (
              <SelectItem key={tab.value} value={tab.value}>{tab.label}</SelectItem>
            ))
          }
        </SelectContent>
      </Select>
      {/* <CommonSelect value={selectedCodecName} options={top100Films} onChange={value => handleChange(value)} /> */}
    </div>
  )
}

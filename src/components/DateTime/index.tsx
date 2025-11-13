import { dayjs } from "@/utils/date";
import { useState } from "react";
import Tips from "../Tips";
import { useParsedDate } from "@/hooks";


type DateTimeProps = {
  date: number | string
  showRelative?: boolean
}

export default function DateTime({ date, showRelative }: DateTimeProps) {
  const relativeDateStr = useParsedDate(date)
  return (
    <Tips
      placement="top"
      trigger={
        <span className="font-hash">
          {showRelative ? relativeDateStr : dayjs(date).format("YYYY/MM/DD HH:mm:ss")}
        </span>
      }
    >
      <span className="font-hash">{dayjs(date).format("YYYY/MM/DD HH:mm:ssZZ")}</span>
    </Tips>
  )
}
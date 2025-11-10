import dayjs from "dayjs";
import { useState } from "react";
import Tips from "../Tips";


type RelativeDateTimeProps = {
  date: dayjs.ConfigType
}

export default function RelativeDateTime({ date }: RelativeDateTimeProps) {
  const [dDate] = useState(dayjs(date))
  const diff = dayjs().diff(dDate)
  return (
    <Tips
      trigger={
        diff > 1000 * 60 * 60 * 24 
          ? dDate.format("YYYY-MM-DD HH:mm:ss")
          : dDate.fromNow()
      }
    >
      {dDate.format("YYYY-MM-DD HH:mm:ssZZ")}
    </Tips>
  )
}
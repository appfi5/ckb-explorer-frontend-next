import type { ReactNode } from "react"
import type { DescItemProps } from "./DescItem"
import { useMediaQuery } from "@/hooks";
import CardPanel from "./CardPanel";
import DescItem from "./DescItem";



export type Field = Omit<DescItemProps, "children"> & {
  key: string;
  content: DescItemProps['children']
}


type DescPanelProps = {
  fields: Field[]
  fieldFlex?: DescItemProps['flex'],
}
export default function DescPanel(props: DescPanelProps) {
  const { fields, fieldFlex } = props
  // const splitInTowPanel = useMediaQuery("(width >=48rem)");
  const [lefetFields, rightFields] = filerAndSplitList(fields);

  if (!fields.length) return null;
  // if (!splitInTowPanel) {
  //   return (
  //     <CardPanel className="flex flex-col p-[20px] gap-[16px]">
  //       {fields.map(({ key, content, ...item }) => (
  //         <DescItem key={key} {...item} flex={fieldFlex || item.flex} >
  //           {content}
  //         </DescItem>
  //       ))}
  //     </CardPanel>
  //   )
  // }
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
      <CardPanel className="flex-1 basis-0 min-w-0 flex flex-col p-3 sm:p-5 gap-[16px]">
        {lefetFields.map(({ key, content, ...item }) => (
          <DescItem key={key} {...item} flex={fieldFlex || item.flex} >
            {content}
          </DescItem>
        ))}
      </CardPanel>
      <CardPanel className="flex-1 basis-0 min-w-0 flex flex-col p-3 sm:p-5 gap-[16px]">
        {rightFields.map(({ key, content, ...item }) => (
          <DescItem key={key} {...item} flex={fieldFlex || item.flex} >
            {content}
          </DescItem>
        ))}
      </CardPanel>
    </div>
  )
}

function filerAndSplitList(list: Field[]): [Field[], Field[]] {
  const filtered = list.filter((item) => item.show !== false);
  const len = filtered.length;
  return [filtered.slice(0, Math.ceil(len / 2)), filtered.slice(Math.ceil(len / 2))];
}
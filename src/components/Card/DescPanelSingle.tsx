import type { ReactNode } from "react"
import type { DescItemProps } from "./DescItem"
import CardPanel from "./CardPanel";
import DescItem from "./DescItem";

export type Field = Omit<DescItemProps, "children"> & {
  key: string;
  content: DescItemProps['children']
}


type DescPanelSingleProps = {
  fields: Field[]
  fieldFlex?: DescItemProps['flex'],
  textDirection?: 'left' | 'right' | 'center';
}
export default function DescPanelSingle(props: DescPanelSingleProps) {
  const { fields, fieldFlex, textDirection = 'center' } = props

  if (!fields.length) return null;

  return (
    <CardPanel className="flex flex-col p-[20px] gap-[16px]">
        {fields.map(({ key, content, ...item }) => (
          <DescItem key={key} {...item} flex={fieldFlex || item.flex} textDirection={textDirection}>
            {content}
          </DescItem>
        ))}
      </CardPanel>
  )
}

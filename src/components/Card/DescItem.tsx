import type { CSSProperties, ReactNode } from "react";
import Tooltip from "../Tooltip";
import QuestionIcon from "@/assets/icons/question.svg?component";
import classNames from "classnames";

export type DescItemProps = {
  show?: boolean;
  showContent?: boolean;
  contentClassName?: string;
  label: ReactNode;
  children: ReactNode;
  tooltip?: ReactNode;
  flex?: { label?: CSSProperties['flex'], content?: CSSProperties['flex'] }
  textDirection?: 'left' | 'right' | 'center';
  layout?: string;
};

export default function DescItem(props: DescItemProps) {
  const { show = true, showContent = true, tooltip, label, children, flex, textDirection = 'left', layout = "flex-row items-center gap-2", contentClassName } = props
  const labelFlex = flex?.label ?? 270;
  const contentFlex = flex?.content ?? 490;

  if (!show) return null;

  const textAlignClass = {
    left: 'text-left justify-start',
    right: 'text-right justify-end',
    center: 'text-center justify-center',
  }[textDirection] || 'text-center justify-center';

  return (
    <div className={classNames("flex", layout)}>
      <div className="text-[14px] leading-[22px] text-[#909399] basis-[0] flex flex-row items-center " style={{ flex: labelFlex }}>
        {label}
        {tooltip && (
          <Tooltip
            trigger={
              <QuestionIcon className="ml-1 hover:text-primary cursor-pointer" />
            }
          >
            {tooltip}
          </Tooltip>
        )}
      </div>
      <div className={classNames("basis-[0] min-w-0", textAlignClass, contentClassName)} style={{ flex: contentFlex }}>
        {showContent ? children : "-"}
      </div>
    </div>
  )
}
import { useIsMobile } from "@/hooks";
import type { TooltipProps } from "../Tooltip";
import Popover from "../Popover";
import Tooltip from "../Tooltip";
import classNames from "classnames";




export default function Tips(props: TooltipProps) {
  const isMobile = useIsMobile();
  const Component = isMobile ? Popover : Tooltip;
  return (
    <Component {...props} contentClassName={classNames(props.contentClassName, "max-w-[320px] w-fit")} />
  )
}
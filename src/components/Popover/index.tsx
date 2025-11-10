// import { Root, Trigger, Portal, Content, Arrow } from "@radix-ui/react-popover";
// import classNames from "classnames";
// import type { FC } from "react";
import "./index.scss";
// import styles from "./index.module.scss";
// import { useIsMobile } from "@/hooks";
// import Tooltip from "../Tooltip";
import { PopoverContent, PopoverTrigger, Popover as ShadcnPopover } from '@/components/shadcn/popover';

export interface TooltipProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  contentStyle?: React.CSSProperties;
  contentClassName?: string;
  disabled?: boolean;
  showArrow?: boolean;
  portalContainer?: HTMLElement | null;
  forceClick?: boolean;
  asChild?: boolean;
}

export default function Popover(props: TooltipProps) {
  const {
    children,
    trigger,
    placement = "bottom",
    open,
    onOpenChange,
    contentStyle,
    contentClassName,
    disabled,
    // showArrow = true,
    portalContainer,
    asChild,
  } = props;
  if (disabled) {
    return <>{trigger}</>;
  }
  return (
    <ShadcnPopover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild={asChild}>{trigger}</PopoverTrigger>
      <PopoverContent
        side={placement}
        className={contentClassName}
        style={contentStyle}
        container={portalContainer}
      >
        {children}
      </PopoverContent>
    </ShadcnPopover>
  )
}

// export  function OldPopover(props: TooltipProps) {
//   const {
//     children,
//     trigger,
//     placement = "bottom",
//     open,
//     onOpenChange,
//     contentStyle,
//     contentClassName,
//     disabled,
//     showArrow = true,
//     portalContainer,
//     forceClick,
//     asChild = true
//   } = props;
//   const isMobile = useIsMobile();

//   if (disabled) {
//     return <>{trigger}</>;
//   }
//   if (!isMobile && !forceClick) {
//     return (
//       <Tooltip
//         trigger={trigger}
//         placement={placement}
//         open={open}
//         onOpenChange={onOpenChange}
//         contentStyle={contentStyle}
//         contentClassName={contentClassName}
//         isPopover
//         showArrow={showArrow}
//         portalContainer={portalContainer}
//         asChild={asChild}
//       >
//         {children}
//       </Tooltip>
//     );
//   }
//   return (
//     <Root open={open} onOpenChange={onOpenChange}>
//       <Trigger asChild={asChild}>{trigger}</Trigger>
//       <Portal container={portalContainer}>
//         <Content
//           side={placement}
//           style={contentStyle}
//           className={classNames(styles.content, contentClassName)}
//         >
//           {showArrow && <Arrow className={styles.arrow} />}
//           {children}
//         </Content>
//       </Portal>
//     </Root>
//   );
// };



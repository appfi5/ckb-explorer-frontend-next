import {
  Provider,
  Root,
  Trigger,
  Portal,
  Content,
  Arrow,
} from "@radix-ui/react-tooltip";
import classNames from "classnames";
import { type FC } from "react";
import styles from "./index.module.scss";
import { Tooltip as ShadcnTooltip, TooltipContent, TooltipTrigger } from "../shadcn/tooltip";

export interface TooltipProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  contentStyle?: React.CSSProperties;
  contentClassName?: string;
  disabled?: boolean;
  isPopover?: boolean;
  showArrow?: boolean;
  portalContainer?: HTMLElement | null;
  asChild?: boolean;
}
export function OldTooltip(props: TooltipProps) {
  const {
    children,
    trigger,
    placement = "top",
    open,
    onOpenChange,
    contentStyle,
    contentClassName,
    disabled,
    isPopover = false,
    showArrow = true,
    portalContainer,
    asChild = true
  } = props;
  if (disabled) {
    return <>{trigger}</>;
  }
  return (
    <Provider delayDuration={0}>
      <Root open={open} onOpenChange={onOpenChange}>
        <Trigger asChild={asChild}>{trigger}</Trigger>
        <Portal container={portalContainer}>
          <Content
            side={placement}
            style={contentStyle}
            className={classNames(styles.content, contentClassName, {
              [styles.popover]: isPopover,
            })}
          >
            {showArrow && (
              <Arrow
                className={classNames(styles.arrow, {
                  [styles.popoverArrow]: isPopover,
                })}
              />
            )}
            {children}
          </Content>
        </Portal>
      </Root>
    </Provider>
  );
};

export default function Tooltip(props: TooltipProps) {
  const {
    children,
    trigger,
    placement = "top",
    open,
    onOpenChange,
    contentStyle,
    contentClassName,
    disabled,
    isPopover = false,
    showArrow = true,
    portalContainer,
    asChild
  } = props;
  if (disabled) {
    return <>{trigger}</>;
  }
  return (
    <ShadcnTooltip delayDuration={0} open={open} onOpenChange={onOpenChange} >
      <TooltipTrigger asChild={asChild}>{trigger}</TooltipTrigger>
      <TooltipContent
        container={portalContainer}
        className={classNames("max-w-[320px] break-all", contentClassName)} 
        side={placement}
      >
        {children}
      </TooltipContent>
    </ShadcnTooltip>
  )
}
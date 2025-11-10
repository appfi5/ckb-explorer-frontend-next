import type { ComponentProps, FC } from "react";
import classNames from "classnames";
import styles from "./index.module.scss";
import Tooltip, { type TooltipProps } from "../Tooltip";
import QuestionIcon from "@/assets/icons/question.svg?component";

export const HelpTip: FC<
  Omit<TooltipProps, "trigger"> & {
    iconProps?: ComponentProps<"img">;
    trigger?: React.ReactNode;
  }
> = ({ iconProps, ...props }) => {
  const finalProps: TooltipProps = {
    placement: "top",
    ...props,
    trigger: props.trigger ?? (
      <QuestionIcon  className="ml-1 hover:text-primary cursor-pointer" />
    ),
  };

  return (
    <Tooltip
      {...finalProps}
      contentClassName={classNames(styles.tooltip, finalProps.contentClassName)}
    />
  );
};

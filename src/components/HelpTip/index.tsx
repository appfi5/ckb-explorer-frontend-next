import type { ComponentProps, FC } from "react";
import classNames from "classnames";
import styles from "./index.module.scss";
import { type TooltipProps } from "../Tooltip";
import QuestionIcon from "@/assets/icons/question.svg?component";
import Tips from "../Tips";

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
    <Tips
      {...finalProps}
      contentClassName={classNames(styles.tooltip, finalProps.contentClassName)}
    />
  );
};

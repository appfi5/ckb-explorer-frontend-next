import classNames from "classnames";
import type { ComponentProps } from "react";


type IconBoxProps = ComponentProps<"div">

export default function IconBox(props: IconBoxProps) {
  const { className, ...restProps} = props;
  return (
    <div
      className={classNames(
        "flex items-center justify-center size-[20px] rounded-[4px] bg-white dark:bg-[#ffffff1a] border-[#ddd] dark:border-[transparent] border-[1px] hover:text-primary hover:border-(--color-primary) cursor-pointer",
        className
      )}
      {...restProps}
    />
  )
}
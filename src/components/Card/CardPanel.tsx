import classNames from "classnames";
import type { ComponentProps } from "react";




export default function CardPanel(props: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={classNames("rounded-[16px] bg-[#f5f9fb] dark:bg-[#303030]", props.className)}
    />
  )
}
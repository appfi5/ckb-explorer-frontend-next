
import { type ComponentProps } from "react";
import classNames from "classnames";



export default function SimpleButton(props: ComponentProps<"div">) {
  return (
    <div
      role="button"
      tabIndex={-1}
      {...props}
      className={classNames("cursor-pointer", props.className)}
    />
  )
}
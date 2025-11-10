import classNames from "classnames";
import type { ComponentProps } from "react";





export default function AssetContainer(props: ComponentProps<"div">) {
  const { className, ...rest } = props;
  return <div {...rest} className={classNames("bg-[#f5f5f5] dark:bg-[#303030]", className)} />
}
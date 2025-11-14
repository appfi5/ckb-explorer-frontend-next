
import OutlinkIcon from "@/assets/icons/outlink.svg?component"
import classNames from "classnames"
import Link from "next/link"
import type { ComponentProps } from "react"
import styles from "./OutLink.module.scss"

type NextLinkProsp = ComponentProps<typeof Link> & {
  iconSize?: number
}

export default function OutLink(props: NextLinkProsp) {
  const { children, iconSize = 20, ...rest } = props
  return (
    <Link
      {...rest}
      className={classNames(styles.link, props.className)}
    >
      {children}
      <OutlinkIcon width={iconSize} height={iconSize} className={classNames(styles.icon, "flex-none hidden sm:block rounded-[4px] bg-white border-[1px] border-[#ddd]")} />
    </Link>
  )
}
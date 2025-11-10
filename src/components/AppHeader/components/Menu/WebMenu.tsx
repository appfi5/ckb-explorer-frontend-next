import styles from './WebMenu.module.scss'
import classNames from "classnames";
import { useState, type ReactNode } from "react";

import Link from "next/link";
import { useMenu } from './utils';
import DropdownArrowIcon from "@/assets/icons/arrow-down.svg?component";
import Popover from '@/components/Popover';

export default function WebMenu({ className }: { className?: string }) {
  const menuList = useMenu();

  return (
    <div className={classNames("flex flex-row items-center gap-2", className)}>
      {
        menuList.map(item => (
          <MenuItem
            key={item.key}
            icon={item.icon}
            name={item.name}
            active={item.active}
            href={item.href}
            routes={item.routes}
          />
        ))
      }
    </div>
  )
}

type MenuItemProps = {
  icon: ReactNode,
  name: ReactNode,
  active?: boolean,
  href?: string,
  routes?: Array<{
    key: string,
    name: ReactNode,
    href: string,
    active?: boolean,
  }>
}

function MenuItem({ icon, name, active, href, routes }: MenuItemProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const composeActive = active || popoverOpen
  const dom = (
    <div className={classNames(styles.menuItem, "flex flex-row justify-center items-center h-[22px] gap-1 hover:text-primary", {
      "text-primary font-medium": composeActive,
      "text-white cursor-pointer": !composeActive,
      [styles.active!]: composeActive,
    })}>
      <div className={classNames(styles.bracket, styles.left, { [styles.hidden!]: !composeActive })}>
        <i></i>
      </div>
      <div className={classNames("flex items-center justify-center text-primary", styles.icon, { [styles.active!]: composeActive })}>{icon}</div>
      <div className="transition-[color_0.2s_linear]">{name}</div>
      {
        !!routes?.length && (
          <div className="transition-[color_0.2s_linear]">
            <DropdownArrowIcon />
          </div>
        )
      }
      <div className={classNames(styles.bracket, styles.right)} >
        <i></i>
      </div>
    </div>
  );

  if (routes?.length) {
    return (
      <Popover
        open={popoverOpen}
        onOpenChange={setPopoverOpen}
        showArrow={false}
        contentStyle={{
          marginTop: 8,
          minWidth: "var(--radix-popper-anchor-width)",
          width: "fit-content",
        }}
        contentClassName="border border-[#ddd] p-1.5"
        asChild={false}
        trigger={dom}
      >
        <div className="flex flex-col gap-1 capitalize">
          {
            routes.map(route => (
              <Link
                key={route.key}
                href={route.href}
                onClick={() => setPopoverOpen(false)}
                className={classNames(
                  "rounded-sm px-2 py-1 text-[#232323] hover:text-primary hover:bg-[#edf2f2]",
                  {
                    "text-primary": route.active,
                  }
                )}
              >
                {route.name}
              </Link>
            ))
          }
        </div>
      </Popover>
    )
  }
  if (!href) return dom;
  return (
    <Link href={href} target={href.startsWith("http") ? "_blank" : ""}>
      {dom}
    </Link>
  )
}

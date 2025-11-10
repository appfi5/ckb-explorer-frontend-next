import classNames from "classnames";
import { useState } from "react";
import Link from "next/link";

import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/shadcn/drawer"
import PixelBorderBlock from "@/components/PixelBorderBlock";
import InteImage from "@/components/InteImage";
import { useMenu } from "./utils";
import { ArrowRightLeft } from "lucide-react";
import { isMainnet } from "@/utils/chain";
import { useTranslation } from "react-i18next";
import { ChainName, MAINNET_URL, TESTNET_URL } from "@/constants/common";
import { isClient } from "@/utils/tool";
import BlockchainSwitch from "../BlockchainSwitch";
import DropdownArrowIcon from "@/assets/icons/arrow-down.svg?component";
import { useBoolean,useMediaQuery } from "@/hooks";

export default function MobileMenu() {
  const menuList = useMenu();
  const [open, setOpen] = useState(false);
  const [isChildrenOpen, setIsChildrenOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      container={isClient ? document.getElementById("root")! : null}
      direction="left"
    >
      <DrawerTrigger asChild>
        <PixelBorderBlock
          className={classNames("cursor-pointer block xl:hidden")}
          contentClassName="size-[24px] flex flex-col items-center justify-around">
          <div className="flex-none w-4.5 h-0.5 rounded-sm bg-white" />
          <div className="flex-none w-4.5 h-0.5 rounded-sm bg-white" />
          <div className="flex-none w-4.5 h-0.5 rounded-sm bg-white" />
        </PixelBorderBlock>
      </DrawerTrigger>
      <DrawerContent style={{ borderRight: 0 }}>
        <div className="h-full w-full bg-[#111] p-4 flex flex-col gap-4">
          <Link className="inline-flex" onClick={() => setOpen(false)} href="/">
            <InteImage src="/assets/ckb_logo.png" alt="" width={114} height={30} />
          </Link>
          <BlockchainSwitch />
          <div className="flex flex-col gap-2">
            {
              menuList.map(item => (
                <MenuItem
                  onClick={() => setOpen(false)}
                  key={item.key}
                  item={item}
                />
              ))
            }
          </div>
          {/* <Link
            className="text-white text-lg flex flex-row gap-2 items-center cursor-pointer hover:text-primary"
            href={isMainnet() ? TESTNET_URL : MAINNET_URL}
          >
            <ArrowRightLeft className="size-5" />
            <span>{t("navbar.to")} {isMainnet() ? `${ChainName.Testnet} Testnet` : `${ChainName.Mainnet} Mainnet`}</span>
          </Link> */}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

type MenuItemProps = {
  item: ReturnType<typeof useMenu>[number]
  onClick: () => void
}
function MenuItem({ item, onClick }: MenuItemProps) {
  const [expand, { toggle: toggleExpand }] = useBoolean(item.active);
  const composeActive = item.active || expand;
  const innerDom = (
    <>
      <span className="size-5 flex items-center justify-center">{item.icon}</span>
      <span>{item.name}</span>
    </>
  )
  if (!!item.href) {
    return (
      <Link
        href={item.href}
        target={item.href?.startsWith("http") ? "_blank" : ""}
        onClick={onClick}
        className={classNames("flex text-lg flex-row items-center gap-2", {
          "text-primary": item.active,
          "text-white hover:text-primary": !item.active
        })}
        key={item.key}
      >
        {innerDom}
      </Link>
    )
  }

  if (!!item.routes?.length) {
    return (
      <div>
        <div
          className={classNames("flex text-lg flex-row items-center gap-2", {
            "text-primary": composeActive,
            "text-white hover:text-primary": !composeActive
          })}
          onClick={() => toggleExpand()}
        >
          {innerDom}
          <div className="flex-1 flex justify-end">
            <DropdownArrowIcon className={classNames("", { "rotate-180": expand })} />
          </div>
        </div>
        <div className={classNames("pl-7 flex flex-col gap-2 mt-2", {
          "hidden": !expand
        })}>
          {
            item.routes.map(route => (
              <Link
                href={route.href}
                target={route.href?.startsWith("http") ? "_blank" : ""}
                onClick={onClick}
                className={classNames("flex text-base flex-row items-center gap-2", {
                  "text-primary": route.active,
                  "text-white hover:text-primary": !route.active
                })}
              >
                {route.name}
              </Link>
            ))
          }
        </div>
      </div>
    )
  }

  return (
    <div
      className={classNames("flex text-lg flex-row items-center gap-2", {
        "text-primary": item.active,
        "text-white hover:text-primary": !item.active
      })}>
      {innerDom}
    </div>
  )

}

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
import { useBoolean, useMediaQuery } from "@/hooks";
import ArrowIcon from "@/components/icons/arrow";
import { useQuery } from "@tanstack/react-query";

const handleVersion = (nodeVersion: string) => {
  if (nodeVersion && nodeVersion.includes("(")) {
    return `v${nodeVersion.slice(0, nodeVersion.indexOf("("))}`;
  }
  return nodeVersion;
};
export default function MobileMenu() {
  const menuList = useMenu();
  const [open, setOpen] = useState(false);
  const [isChildrenOpen, setIsChildrenOpen] = useState(false);
  const { t } = useTranslation();
  const query = useQuery({
    queryKey: ["node_version"],
    // keepPreviousData: true,
    // placeholderData: keepPreviousData,
    // initialData: () => cacheService.get<string>("node_version"),
    queryFn: async () => {
      // const { version } = await explorerService.api.fetchNodeVersion();
      const res = await server.explorer("GET /nets/version");
      const version = res?.version ?? ""; // "v0.0.1"
      // cacheService.set<string>("node_version", version, {
      //   expireTime: ONE_DAY_MILLISECOND,
      // });
      return version;
    },
  });
  const nodeVersion = query.data ?? "";
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
        <div className="h-full w-full bg-[#111] p-4 flex flex-col gap-5">
          <Link className="inline-flex" onClick={() => setOpen(false)} href="/">
            <InteImage src="/assets/ckb_logo.png" alt="" width={114} height={30} />
          </Link>
          {/* <Link
            className="text-white text-lg flex flex-row gap-2 items-center cursor-pointer hover:text-primary"
            href={isMainnet() ? TESTNET_URL : MAINNET_URL}
          >
            <ArrowRightLeft className="size-5" />
            <span>{t("navbar.to")} {isMainnet() ? <span className="text-testnet">{ChainName.Testnet} Testnet</span> : <span className="text-mainnet">{ChainName.Mainnet} Mainnet</span>}</span>
          </Link> */}
          <PixelBorderBlock
            className="cursor-pointer flex-col"
            apperanceClassName="*:data-[slot=border]:bg-[#4d4d4d] hover:*:data-[slot=bg]:bg-[#ffffff14]"
            contentClassName="relative py-1 px-2"
            onClick={() => window.location.href = isMainnet() ? TESTNET_URL : MAINNET_URL}
          >
            <div className="flex flex-col text-primary items-left justify-between gap-[2px] leading-[1] text-[12px]">
              <div className="uppercase">
                {isMainnet() ? `${ChainName.Mainnet} Mainnet` : `${ChainName.Testnet} Testnet`}
              </div>
              <div className="text-[10px]">
                {handleVersion(nodeVersion)}&nbsp;
              </div>
            </div>

            <ArrowRightLeft width={18} height={18} className="absolute right-2 top-0 bottom-0 text-primary m-auto" />
          </PixelBorderBlock>
          {/* <BlockchainSwitch /> */}
          <div className="flex flex-col gap-4">
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

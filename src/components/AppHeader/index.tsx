"use client"
import { usePathname } from "next/navigation";
import { useIsShowSearchBarInHeader } from "./util";
import Link from "next/link";
import InteImage from "../InteImage";
import BlockchainSwitch from "./components/BlockchainSwitch";
import ThemeSwitch from "./components/ThemeSwitch";
import LanguageSwitch from "./components/LanguageSwitch";
import { useKBar } from "kbar";
import PixelBorderBlock from "../PixelBorderBlock";
import SearchIcon from "@/assets/icons/search.svg?component";
import { useTranslation } from "react-i18next";
import WebMenu from "./components/Menu/WebMenu";
import MobileMenu from "./components/Menu/MobileMenu";
import {useMediaQuery } from '@/hooks';
import classNames from 'classnames';
import MaintainAlert from "./components/MaintainAlert";


export default function AppHeader() {
  // const { isActivated } = useCKBNode();
  const pathname = usePathname();
  const defaultSearchBarVisible = pathname !== "/" && pathname !== "/zh" && pathname !== "/search/fail";
  const isShowSearchBar = useIsShowSearchBarInHeader();
  return (
    <div className="sticky top-0 z-10 bg-[#111]" >
      <div className="flex flex-row container min-h-(--navbar-height) items-center">
        <Link className="flex-none mr-[10px] 2xl:mr-[56px]" href="/">
          <InteImage src="/assets/ckb_logo.png" alt="" width={114} height={30} />
        </Link>
        <div className="flex-1 basis-0 flex items-center">
          <WebMenu className="hidden xl:flex" />
        </div>
        <div className="flex flex-row items-center gap-1">
          {(defaultSearchBarVisible || isShowSearchBar) && <AppSearchTrigger />}
          <div className="hidden xl:block">
            <BlockchainSwitch />
          </div>
          <ThemeSwitch />
          <LanguageSwitch />
          <MobileMenu />
        </div>
      </div>
      {/* <MaintainAlert /> */}
    </div>
  )
}

function AppSearchTrigger() {
  const { query, options } = useKBar();
  const { t } = useTranslation();
  return (
    <PixelBorderBlock
      className={classNames("cursor-pointer hidden xl:block")}
      apperanceClassName="*:data-[slot=border]:bg-[#4d4d4d] hover:*:data-[slot=bg]:bg-[#ffffff14]"
      contentClassName="flex items-center justify-between h-[26px] w-[110px] 2xl:w-[234px] px-[6px]"
      onClick={() => {
        options.callbacks?.onOpen?.();
        query.toggle();
      }}
    >
      <span className="text-[#fff6]">{t("search.search")}</span>
      <SearchIcon width={20} height={20} color="white" opacity={0.4} />
    </PixelBorderBlock>
  )
}

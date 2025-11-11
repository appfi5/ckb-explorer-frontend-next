import { useShowSearchBarInHeader } from "@/components/AppHeader/util";
import { useElementIntersecting, useIsMobile, useMediaQuery } from "@/hooks";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useResizeDetector } from "react-resize-detector";
import styles from './index.module.scss';
import SearchIcon from '@/assets/icons/search.svg?component';
import classNames from "classnames";
import { useSearch } from "@/components/Search/useSearch";
import PixelBorderBlock from "@/components/PixelBorderBlock";
import SearchInput from "@/components/Search/SearchInput";
import SimpleButton from "@/components/SimpleButton";
import { AggregateSearchResults } from "@/components/Search/AggregateSearchResults";
import Card from "@/components/Card";
import CloseIcon from "@/assets/icons/close.svg?component";
import { useTheme } from "@/components/Theme";
import SearchRangeSelect from "@/components/Search/SearchRangeSelect";


export default function HomeSearch() {

  const ref = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { height: resizedHeight } = useResizeDetector({
    targetRef: ref,
    handleWidth: false,
  });
  const height = Math.round(resizedHeight ?? ref.current?.clientHeight ?? 0);
  const headerHeight = 64;
  const intersectingCheckOffset = height + headerHeight;

  const isFullDisplayInScreen = useElementIntersecting(
    ref,
    useMemo(
      () => ({
        threshold: 0,
        rootMargin: `-${intersectingCheckOffset}px`,
      }),
      [intersectingCheckOffset],
    ),
    true,
  );

  useShowSearchBarInHeader(!isFullDisplayInScreen);
  return (
    <Card className={classNames("flex flex-col items-center justify-center gap-3 pt-[32px] px-2 md:px-4 pb-[40px] z-1", styles.card)} ref={ref}>
      <div className={classNames("font-medium text-[20px] leading-[28px] dark:text-white")}>{t("common.ckb_explorer")}</div>
      <div className="flex-1 px-2 md:px-8 lg:px-[116px] w-full">
        {isFullDisplayInScreen ? <HomeSearchInner /> : <div className="size-[32px] md:size-[48px]" />}
      </div>
    </Card>
  );
}



function HomeSearchInner() {
  const {
    keyword,
    searchValue,
    setKeyword,
    handleSearch,
    isFetching,
    aggregateSearchResults,
    searchRange,
    setSearchRange,
    placeholder,
    setPlaceholder
  } = useSearch({});
  const { t } = useTranslation();
  // const isMobile = useIsMobile();
  const isMobile = useMediaQuery("(max-width: 40rem)");
  console.log({ isMobile })
  return (
    <>
      <div className="relative flex gap-1">
        <PixelBorderBlock
          compact={isMobile ? undefined : "right"}
          pixelSize="4px"
          className="flex-1"
          apperanceClassName="*:data-[slot=border]:bg-[#232323] *:dark:data-[slot=border]:bg-primary"
          contentClassName={classNames("flex items-center h-[24px] md:h-[32px]", styles.searchPanel)}
        >
          {/* <div className="size-4 md:size-5 flex-none dark:text-primary">
            <SearchIcon width="100%" height="100%" />
          </div> */}
          {/* <SearchIcon width={24} height={24} className="flex-none" />
        <SpinIcon width={24} height={24} className={styles.spinning} /> */}
          <SearchRangeSelect
            triggerClassName="text-md md:text-base flex-none w-[158px] sm:w-[170px]"
            onChange={(rangeCode, placeholder) => {
              setKeyword("");
              setPlaceholder(placeholder);
              setSearchRange(rangeCode);
            }}
          />
          <div className="flex-none h-full py-1 w-0.5">
            <div className="w-full h-full bg-[#232323] dark:bg-primary"></div>
          </div>
          <SearchInput
            className="text-md md:text-base!"
            autoFocus={!isMobile}
            loading={isFetching}
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            onEnter={handleSearch}
            placeholder={placeholder}
          />

          {searchValue && (
            <SimpleButton
              title="clear"
              onClick={() => setKeyword("")}
            >
              <div className="size-[20px] flex items-center justify-center rounded-full bg-[#ebebeb] dark:bg-[#fff3] hover:text-primary hover:bg-[rgb(from_var(--color-primary)_r_g_b_/_10%)] dark:hover:bg-[rgb(from_var(--color-primary)_r_g_b_/_20%)]">
                <CloseIcon />
              </div>
            </SimpleButton>
          )}

        </PixelBorderBlock>
        <PixelBorderBlock
          compact="left"
          pixelSize="4px"
          apperanceClassName="*:data-[slot=border]:bg-[#232323] *:dark:data-[slot=border]:bg-primary *:data-[slot=bg]:bg-[#232323] *:dark:data-[slot=bg]:bg-primary"
          className="hidden sm:flex cursor-pointer items-center justify-center"
          contentClassName="flex items-center justify-center w-[80px] md:w-[108px] text-[18px] leading-[24px]"
          onClick={handleSearch}
        >
          <span className="text-primary dark:text-white">{t("search.search")}</span>
        </PixelBorderBlock>
        {(isFetching || !!aggregateSearchResults) && (
          <AggregateSearchResults
            keyword={keyword}
            results={aggregateSearchResults ?? []}
            loading={isFetching}
          />
        )}
      </div>

    </>
  )

}
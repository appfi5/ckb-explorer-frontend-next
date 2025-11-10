// import { useHistory } from 'react-router-dom'
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { useRef, useState, type Dispatch, type FC, type SetStateAction } from "react";
import {
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  KBarResults,
  KBarProvider,
  useKBar,
} from "kbar";
import { useSearch } from "@/components/Search/useSearch";
import ResultItem from "./ResultItem";
import {
  getDisplayNameByAggregateSearchResult,
  getURLByAggregateSearchResult,
  SearchResultType,
  type AggregateSearchResult,
} from "@/components/Search/utils";
import { useRouter } from "next/navigation";
import { isClient } from "@/utils/tool";
import SearchIcon from "@/assets/icons/search.svg?component";
import CloseIcon from "@/assets/icons/close.svg?component";
import SimpleButton from "../SimpleButton";
import SearchRangeSelect from "../Search/SearchRangeSelect";

const KBarContent: FC<{ setOpenCount: Dispatch<SetStateAction<number>> }> = ({
  setOpenCount,
}) => {
  // const history = useHistory()
  const router = useRouter();
  const { t } = useTranslation();
  const { query } = useKBar();
  const [inpKey, setInpKey] = useState(0);
  const selectDropDownRef = useRef<HTMLDivElement>(null);
  const {
    keyword,
    searchValue,
    setKeyword,
    setSearchRange,
    placeholder,
    setPlaceholder,
    isFetching,
    restQueryState,
    aggregateSearchResults,
  } = useSearch({
    content: "",
    onEditEnd: () => { },
    onClear: () => { },
    debounceTime: 500,
  });

  const categories = (aggregateSearchResults ?? []).reduce(
    (acc, result) => {
      if (!acc[result.type]) {
        acc[result.type] = [];
      }
      acc[result.type].push(result);
      return acc;
    },
    {} as Record<SearchResultType, AggregateSearchResult[]>,
  );

  const content = (() => {
    if (isFetching && !restQueryState.isRefetching) {
      return (
        <div className="flex w-full items-center justify-center py-4 text-lg">
          <Loader2 className="animate-spin text-gray-300" />
        </div>
      );
    }
    if (
      aggregateSearchResults &&
      aggregateSearchResults.length === 0 &&
      !!searchValue
    ) {
      return (
        <div className="w-full px-3 py-4 text-center text-sm text-gray-400">
          {t("search.no_search_result")}
        </div>
      );
    }
    return (
      <div className="rounded-b-[16px] overflow-hidden">
        <KBarResults
          key={keyword}
          items={Object.entries(categories)
            .map(([type, items]) => [
              type,
              ...items.map((item) => ({
                name: getDisplayNameByAggregateSearchResult(item) ?? "",
                ...item,
                id: String(item.id),
                command: {
                  perform: () => {
                    const url = getURLByAggregateSearchResult(item);
                    if (url) {
                      // history.push(url)
                      router.push(url);
                    }
                  },
                },
              })),
            ])
            .flat()}
          onRender={({ item, active }) => {
            return typeof item === "string" ? (
              <div className="px-3 py-2 text-sm font-bold text-gray-500 uppercase">
                {item}
              </div>
            ) : (
              <ResultItem
                result={item as unknown as AggregateSearchResult}
                active={active}
                keyword={keyword}
              />
            );
          }}
        />
      </div>
    );
  })();

  return (
    // <KBarProvider
    //   options={{
    //     enableHistory: false,
    //     callbacks: {
    //       onOpen: () => {
    //         document.body.classList.add("pointer-events-none");
    //       },
    //       onClose: () => {
    //         document.body.classList.remove("pointer-events-none");
    //         setOpenCount((prev) => prev + 1);
    //       }
    //     },
    //   }}
    // >
    <KBarPortal container={isClient ? document.body : undefined}>
      <KBarPositioner className="z-9 bg-[#0a0a0acc] pointer-events-auto">
        <KBarAnimator className="text-foreground w-full max-w-[1000px] rounded-[16px] bg-white dark:bg-[#303030] border border-[#eee] dark:border-[#4c4c4c] shadow-lg">
          <div className="flex flex-row items-center pl-5 pr-8">
            {/* <SearchIcon width={24} height={24} /> */}
            <SearchRangeSelect
              triggerClassName="text-lg w-[190px]"
              popContainer={selectDropDownRef.current}
              onChange={(rangeCode, placeholder) => {
                setPlaceholder(placeholder);
                setSearchRange(rangeCode);

                query.setSearch("");
                setInpKey(prev => prev + 1)
                setKeyword("")
              }}
            />
            <KBarSearch
              key={inpKey}
              className="flex-1 w-full px-3 py-4 text-lg leading-[48px]"
              onChange={(e) => setKeyword(e.target.value)}
              defaultPlaceholder={placeholder}
            />
            <div className="size-[20px]">
              {
                !!keyword && (
                  <SimpleButton
                    className="size-[20px] flex items-center justify-center rounded-full bg-[#ebebeb] dark:bg-[#fff3] hover:text-primary hover:bg-[rgb(from_var(--color-primary)_r_g_b_/_10%)] dark:hover:bg-[rgb(from_var(--color-primary)_r_g_b_/_20%)]"
                    onClick={() => {
                      query.setSearch("");
                      setInpKey(prev => prev + 1)
                      setKeyword("")
                    }}
                  >
                    <CloseIcon />
                  </SimpleButton>

                )
              }
            </div>
          </div>
          {content}
          <div ref={selectDropDownRef}></div>
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
    // </KBarProvider>
  );
};

export default KBarContent;

import { type FC, memo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import styles from "./index.module.scss";
import { AggregateSearchResults } from "./AggregateSearchResults";
import SearchIcon from '@/assets/icons/search.svg?component';
import CloseIcon from "@/assets/icons/close.svg?component";
import SpinnerIcon from "./spinner.svg";
import ClearIcon from "./clear.svg";
import SimpleButton from "../SimpleButton";
import { useIsMobile } from "@/hooks";
import { useSearch } from "./useSearch";
import SearchInput from "./SearchInput";
import { isMac } from "@/utils/util";
import InteImage from "../InteImage";

const Search: FC<{
  content?: string;
  hasButton?: boolean;
  onEditEnd?: () => void;
  onClear?: () => void;
}> = memo(({ content, hasButton, onEditEnd, onClear }) => {
  const {
    keyword,
    searchValue,
    setKeyword,
    handleSearch,
    isFetching,
    aggregateSearchResults,
  } = useSearch({
    content,
    onEditEnd,
    onClear,
  });
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [isMacOS, setIsMacOS] = useState(false);

  useEffect(() => {
    setIsMacOS(isMac());
  }, []);

  return (
    <div
      className={styles.searchPanel}
      style={{
        height: hasButton ? "40px" : "32px",
        paddingRight: hasButton ? "0" : "8px",
      }}
    >
      {isFetching ? (
        <InteImage src={SpinnerIcon} alt="" className={classNames(styles.preIcon, styles.spinner)} />
      ) : (
        <SearchIcon className={styles.preIcon} />
      )}

      <SearchInput
        autoFocus={!isMobile}
        loading={isFetching}
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        onEnter={handleSearch}
        placeholder={t("navbar.search_placeholder")}
        className="flex-1"
      />

      {searchValue && (
        <SimpleButton
          className={styles.clear}
          title="clear"
          onClick={() => setKeyword("")}
        >
          <div className="size-[20px] flex items-center justify-center rounded-full bg-[#ebebeb] dark:bg-[#fff3] hover:text-primary hover:bg-[rgb(from_var(--color-primary)_r_g_b_/_10%)] dark:hover:bg-[rgb(from_var(--color-primary)_r_g_b_/_20%)]">
            <CloseIcon />
          </div>
        </SimpleButton>
      )}
      {/* <div className="ml-1 rounded-md border border-gray-200 px-1 py-0.5 text-xs text-gray-500">
        {isMacOS ? "⌘+K" : "Ctrl+K"}
      </div> */}
      {hasButton && (
        <div className={styles.searchButton} onClick={handleSearch}>
          {t("search.search")}
        </div>
      )}

      {(isFetching || aggregateSearchResults) && (
        <AggregateSearchResults
          keyword={keyword}
          results={aggregateSearchResults ?? []}
          loading={isFetching}
        />
      )}
    </div>
  );
});

export default Search;
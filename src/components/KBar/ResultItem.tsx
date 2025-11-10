import { forwardRef } from "react";
// import { cn } from "@/lib/utils";
import { SearchResultItem } from "@/components/Search/AggregateSearchResults";
import classNames from "classnames";
import type { AggregateSearchResult } from "../Search/utils";

const ResultItem = forwardRef(
  (
    {
      result,
      active,
      keyword,
    }: {
      result: AggregateSearchResult;
      active: boolean;
      keyword: string;
    },
    ref: React.Ref<HTMLDivElement>,
  ) => {
    return (
      <div
        ref={ref}
        className={classNames(
          "flex cursor-pointer items-center justify-between px-3 py-2",
          {
            "border-transparent": !active,
            // "border-gray-300 dark:": active,
            "bg-gray-100 dark:bg-[#363839]": active,
            "[&_*]:bg-inherit!": true,
          },
        )}
      >
        <SearchResultItem
          item={result}
          keyword={keyword}
          highlightedWhenHover={false}
        />
      </div>
    );
  },
);

export default ResultItem;

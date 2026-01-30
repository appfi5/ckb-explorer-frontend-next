
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { type FC, useEffect, useState } from "react";
// import {
//   SearchResultType,
//   type AggregateSearchResult,
// } from "@/services/ExplorerService";
import {
  getURLByAggregateSearchResult,
  getDisplayNameByAggregateSearchResult,
  type AggregateSearchResult,
  SearchResultType,
} from "./utils";
import { HighlightText } from "./HighlightText";
import { handleNftImgError, patchMibaoImg } from "@/utils/util";
import { localeNumberString } from "@/utils/number";
import styles from "./AggregateSearchResults.module.scss";
import Link from "next/link";
import InteImage from "../InteImage";
import Loading from "../Loading";
import TextEllipsis from "../TextEllipsis";

type Props = {
  keyword?: string;
  loading?: boolean;
  results: AggregateSearchResult[];
};

export const AggregateSearchResults: FC<Props> = ({
  keyword = "",
  results,
  loading,
}) => {
  const { t } = useTranslation();
  const [activatedCategory, setActivatedCategory] = useState<
    SearchResultType | undefined
  >(undefined);

  useEffect(() => {
    setActivatedCategory(undefined);
  }, [results]);

  const categories = results.reduce(
    (acc, result) => {
      if (!acc[result.type]) {
        acc[result.type] = [];
      }
      acc[result.type].push(result);
      return acc;
    },
    {} as Record<SearchResultType, AggregateSearchResult[]>,
  );

  const SearchResultCategoryPanel = (() => {
    return (
      <div className={styles.searchResultCategory}>
        {Object.entries(categories)
          .filter(([type]) =>
            activatedCategory === undefined ? true : activatedCategory === type,
          )
          .map(([type, items]) => (
            <div key={type} className={styles.category}>
              <div className={styles.categoryTitle}>{t(`search.${type}`)}</div>
              <div className={styles.categoryList}>
                {items.map((item) => (
                  <SearchResultItem
                    keyword={keyword}
                    key={item.id}
                    item={item}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    );
  })();

  return (
    <div
      className={styles.searchResultsPanelWrapper}
      data-role="search-result-list"
    >
      {!loading && Object.keys(categories).length > 0 && (
        <div className={styles.searchCategoryFilter}>
          {(Object.keys(categories) as SearchResultType[]).map((category) => (
            <div
              key={category}
              className={classNames(styles.searchCategoryTag, {
                [styles.active]: activatedCategory === category,
              })}
              onClick={() =>
                setActivatedCategory((pre) =>
                  pre === category ? undefined : category,
                )
              }
            >
              {t(`search.${category}`)} {`(${categories[category].length})`}
            </div>
          ))}
        </div>
      )}
      {loading ? (
        <Loading className="min-h-[70px]" />
      ) : results.length === 0 ? (
        <div className={styles.empty}>{t("search.no_search_result")}</div>
      ) : (
        SearchResultCategoryPanel
      )}
    </div>
  );
};

export const SearchResultItem: FC<{
  keyword?: string;
  item: AggregateSearchResult;
  highlightedWhenHover?: boolean;
}> = ({ item, keyword = "", highlightedWhenHover = true }) => {
  const { t } = useTranslation();
  const displayName = getDisplayNameByAggregateSearchResult(item)?.toString();
  const to = getURLByAggregateSearchResult(item);
  if (!to) return null;

  if (item.type === SearchResultType.UDT) {
    return (
      <Link
        className={classNames(styles.searchResult, {
          [styles.highlightedWhenHover]: highlightedWhenHover,
        })}
        href={to}
      >
        <div className={styles.boxContent}>
          <div style={{ display: "flex", width: "100%" }}>
            {!item.attributes.name ? (
              t("udt.unknown_token")
            ) : (
              <HighlightText
                text={item.attributes.name}
                keyword={keyword}
                style={{ flex: 2, marginRight: 4 }}
              />
            )}
            {/* {item.attributes.fullName && (
              <span
                className={classNames(styles.secondaryText, styles.subTitle)}
                style={{ flex: 1 }}
              >
                (
                <HighlightText
                  text={item.attributes.fullName}
                  keyword={keyword}
                  style={{ width: "100%" }}
                />
                )
              </span>
            )} */}
          </div>

          <div
            className={classNames(
              styles.secondaryText,
              styles.subTitle,
              "font-hash",
            )}
          >
            <span style={{ marginRight: 4, flexShrink: 0 }}>type hash: </span>
            <HighlightText
              style={{ width: "100%" }}
              text={item.attributes.typeHash}
              keyword={keyword}
            />
          </div>
        </div>
      </Link>
    );
  }

  if (item.type === SearchResultType.NFTCollection) {
    return (
      <Link
        className={classNames(styles.searchResult, {
          [styles.highlightedWhenHover]: highlightedWhenHover,
        })}
        href={to}
      >
        <div className={styles.content}>
          {item.attributes.iconUrl ? (
            <InteImage
              src={`${patchMibaoImg(item.attributes.iconUrl)}?size=small`}
              alt="cover"
              loading="lazy"
              className={styles.icon}
              onError={handleNftImgError}
            />
          ) : (
            <InteImage
              src="/images/spore_placeholder.svg"
              alt="cover"
              loading="lazy"
              className={styles.icon}
            />
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              flex: 1,
            }}
          >
            {!displayName ? (
              t("udt.unknown_token")
            ) : (
              <HighlightText
                text={displayName}
                keyword={keyword}
                style={{ flex: 1 }}
              />
            )}

            <div
              className={classNames(
                styles.secondaryText,
                styles.subTitle,
                "font-hash",
              )}
            >
              <span style={{ marginRight: 4, flexShrink: 0 }}>type hash: </span>
              <HighlightText
                style={{ width: "100%" }}
                text={item.attributes.typeScriptHash}
                keyword={keyword}
              />
            </div>

            <div
              className={classNames(
                styles.secondaryText,
                styles.subTitle,
                "font-hash",
              )}
            >
              <span style={{ marginRight: 4, flexShrink: 0 }}>cluster Id: </span>
              <HighlightText
                style={{ width: "100%" }}
                text={item.attributes.collectionId || ""}
                keyword={keyword}
              />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (item.type === SearchResultType.NFTItem) {
    return (
      <Link
        className={classNames(styles.searchResult, {
          [styles.highlightedWhenHover]: highlightedWhenHover,
        })}
        href={to}
      >
        <div className={styles.content}>
          {item.attributes.iconUrl ? (
            <InteImage
              src={`${patchMibaoImg(item.attributes.iconUrl)}?size=small`}
              alt="cover"
              loading="lazy"
              className={styles.icon}
              onError={handleNftImgError}
            />
          ) : (
            <InteImage
              src="/images/spore_placeholder.svg"
              alt="cover"
              loading="lazy"
              className={styles.icon}
            />
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              flex: 1,
            }}
          >
            {!displayName ? (
              t("udt.unknown_token")
            ) : (
              <div className="flex flex-row">
                <span className="mr-1">TokenId:</span>
                <HighlightText
                  text={displayName}
                  keyword={keyword}
                  style={{ flex: 1 }}
                />
              </div>
            )}

            <div
              className={classNames(
                styles.secondaryText,
                styles.subTitle,
                "font-hash",
              )}
            >
              <span style={{ marginRight: 4, flexShrink: 0 }}>collection Name: </span>
              <HighlightText
                text={item.attributes.collectionName}
                keyword={keyword}
                style={{ maxWidth: "100%" }}
              />
            </div>

            {
              !!item.attributes.collectionId && (
                <div
                  className={classNames(
                    styles.secondaryText,
                    styles.subTitle,
                    "font-hash",
                  )}
                >
                  <span style={{ marginRight: 4, flexShrink: 0 }}>cluster ID: </span>
                  <HighlightText
                    style={{ width: "100%" }}
                    text={item.attributes.collectionId || ""}
                    keyword={keyword}
                  />
                </div>
              )
            }

          </div>
        </div>
      </Link>
    );
  }

  if (item.type === SearchResultType.DID) {
    return (
      <Link
        className={classNames(styles.searchResult, {
          [styles.highlightedWhenHover]: highlightedWhenHover,
        })}
        href={to}
      >
        <div className={styles.content}>
          <HighlightText
            style={{ minWidth: 60, marginRight: 8 }}
            text={item.attributes.did}
            keyword={keyword}
          />
          <TextEllipsis
            text={item.attributes.address}
            ellipsis="address"
          />
          {/* <EllipsisMiddle
            className={classNames(styles.secondaryText, "font-hash")}
            style={{ maxWidth: "min(200px, 40%)" }}
            useTextWidthForPlaceholderWidth
            title={item.attributes.address}
          >
            {item.attributes.address}
          </EllipsisMiddle> */}
        </div>
      </Link>
    );
  }

  // if (item.type === SearchResultType.BtcTx) {
  //   return (
  //     <Link
  //       className={classNames(styles.searchResult, {
  //         [styles.highlightedWhenHover]: highlightedWhenHover,
  //       })}
  //       href={to}
  //     >
  //       <div className={styles.boxContent}>
  //         <div className={classNames(styles.subTitle)}>
  //           <HighlightText
  //             text={item.attributes.ckbTransactionHash}
  //             keyword={keyword}
  //             style={{ flex: 1, marginRight: 4 }}
  //           />
  //           <span className={styles.rgbPlus}>RGB++</span>
  //         </div>
  //         <div
  //           className={classNames(
  //             styles.secondaryText,
  //             styles.subTitle,
  //             "font-hash",
  //           )}
  //         >
  //           <span style={{ marginRight: 4, flexShrink: 0 }}>btc id:</span>
  //           <HighlightText
  //             style={{ width: "100%" }}
  //             text={item.attributes.txid}
  //             keyword={keyword}
  //           />
  //         </div>
  //       </div>
  //     </Link>
  //   );
  // }

  if (item.type === SearchResultType.Transaction) {
    return (
      <Link
        className={classNames(styles.searchResult, {
          [styles.highlightedWhenHover]: highlightedWhenHover,
        })}
        href={to}
      >
        <div className={styles.boxContent}>
          <HighlightText
            style={{ width: "100%" }}
            text={item.attributes.transactionHash}
            keyword={keyword}
          />

          <div
            className={classNames(
              styles.secondaryText,
              styles.subTitle,
              "font-hash",
            )}
          >
            <span style={{ marginRight: 4, flexShrink: 0 }}>
              {t("search.block")} #{" "}
              {localeNumberString(item.attributes.blockNumber)}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // if (item.type === SearchResultType.FiberGraphNode) {
  //   return (
  //     <Link
  //       className={classNames(styles.searchResult, {
  //         [styles.highlightedWhenHover]: highlightedWhenHover,
  //       })}
  //       href={to}
  //     >
  //       <div className={styles.boxContent}>
  //         <HighlightText
  //           style={{ width: "100%" }}
  //           text={item.attributes.nodeId}
  //           keyword={keyword}
  //         />

  //         <div
  //           className={classNames(
  //             styles.secondaryText,
  //             styles.subTitle,
  //             "font-hash",
  //           )}
  //         >
  //           <span style={{ marginRight: 4, flexShrink: 0 }}>
  //             {t("search.fiber_graph_node")} #{" "}
  //             {localeNumberString(item.attributes.nodeName)}
  //           </span>
  //         </div>
  //       </div>
  //     </Link>
  //   );
  // }

  return (
    <Link
      className={classNames(styles.searchResult, {
        [styles.highlightedWhenHover]: highlightedWhenHover,
      })}
      href={to}
    >
      <div className={styles.content}>
        {!displayName ? (
          t("udt.unknown_token")
        ) : (
          <HighlightText
            style={{ width: "100%" }}
            text={displayName}
            keyword={keyword}
          />
        )}
      </div>
    </Link>
  );
};

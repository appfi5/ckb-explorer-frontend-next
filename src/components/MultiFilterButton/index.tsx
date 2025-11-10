'use client';

import { useTranslation } from "react-i18next";
import { type PropsWithChildren, useEffect, useMemo, useState } from "react";
import SelectedIcon from "@/assets/selected-icon.svg";
import NotSelectedIcon from "@/assets/not-selected-icon.svg";
import PartialSelectedIcon from "@/assets/partial-selected-icon.svg";
import { useSearchParams as useCustomSearchParams } from "@/hooks";
import styles from "./styles.module.scss";
import Popover from "../Popover";
import Link from "next/link";
import {
  useSearchParams as useNextSearchParams,
  useRouter,
} from "next/navigation";
import type { JSX } from 'react';
import InteImage from "@/components/InteImage"
import FilterListIcon from "@/components/icons/filterList"



export function MultiFilterPopover({
  filterList,
  filterName,
  children,
}: PropsWithChildren<{
  filterName: string;
  filterList: {
    key: string;
    value: string;
    to: string;
    title: string | JSX.Element;
  }[];
}>) {
  const [selected, setSelected] = useState<string>("");
  const { t } = useTranslation();
  const params = useCustomSearchParams(filterName); 
  const filter = params[filterName];
  const router = useRouter();
  const nextSearchParams = useNextSearchParams(); 

  const types = useMemo(
    () => filter?.split(",").filter((t) => !!t) ?? [],
    [filter],
  );

  useEffect(() => {
    const filterMap = new Map<string, string>(
      filterList.map((f) => [f.key, f.value]),
    );
    setSelected(
      types
        .map((item) => filterMap.get(item))
        .filter(Boolean)
        .join(","),
    );
  }, [filter, filterList, types]);

  const isAllSelected = types.length === filterList.length;
  const isNoneSelected = types.length === 0;

  const baseSearchParams = useMemo(() => {
    const params = new URLSearchParams(nextSearchParams.toString());
    params.delete(filterName);
    params.delete("page");
    return params;
  }, [nextSearchParams, filterName]);

  return (
    <div className={styles.container}>
      {/* {!!selected && (
        <div className={styles.selected}>
          <span className={styles.selectedItems}>{selected}</span>
          <span>+{types.length}</span>
        </div>
      )} */}
      <Popover trigger={children}>
        <div className={styles.filterItems}>
          <div className={styles.selectTitle}>
            <h2>{t("components.multi_filter_button.select")}</h2>
            <Link
              href={{
                pathname: filterList[0].to,
                query: baseSearchParams.toString() 
                  ? Object.fromEntries(baseSearchParams) 
                  : undefined,
              }}
              onClick={(e) => {
                if (isNoneSelected) {
                  e.preventDefault();
                  const newParams = new URLSearchParams(baseSearchParams);
                  newParams.append(
                    filterName,
                    filterList.map((f) => f.key).join(","),
                  );
                  router.push(`${filterList[0].to}?${newParams.toString()}`);
                }
              }}
            >
              {types.length > 0 ? (
                isAllSelected ? <InteImage src={SelectedIcon} alt="" /> : <InteImage src={PartialSelectedIcon} alt="" />
              ) : (
                <InteImage src={NotSelectedIcon} alt="" />
              )}
            </Link>
          </div>
          {filterList.map((f) => (
            <Link
              key={f.key}
              href={{
                pathname: f.to,
                query: baseSearchParams.toString()
                  ? Object.fromEntries(baseSearchParams)
                  : undefined,
              }}
              onClick={(e) => {
                e.preventDefault();
                const subTypes = new Set(types);
                if (subTypes.has(f.key)) {
                  subTypes.delete(f.key);
                } else {
                  subTypes.add(f.key);
                }
                const newParams = new URLSearchParams(baseSearchParams);
                if (subTypes.size === 0) {
                  newParams.delete(filterName);
                } else {
                  newParams.append(filterName, Array.from(subTypes).join(","));
                }
                router.push(`${f.to}?${newParams.toString()}`);
              }}
              data-is-active={types.includes(f.key)}
              className={styles.filterItem}
            >
              <span className={styles.filterTitle}>{f.title}</span>
              {types.includes(f.key) ? <InteImage src={SelectedIcon} alt="" /> : <InteImage src={NotSelectedIcon} alt="" />}
            </Link>
          ))}
        </div>
      </Popover>
    </div>
  );
}

export function MultiFilterButton({
  filterList,
  filterName,
}: {
  filterName: string;
  filterList: {
    key: string;
    value: string;
    to: string;
    title: string | JSX.Element;
  }[];
}) {
  const params = useCustomSearchParams(filterName);
  const filter = params[filterName];
  return (
    <MultiFilterPopover filterList={filterList} filterName={filterName}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <FilterListIcon sortDirection={!!filter} />
      </div>
    </MultiFilterPopover>
  );
}

MultiFilterButton.displayName = "MultiFilterButton";

export default MultiFilterButton;
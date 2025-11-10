"use client"
import { type ReactElement } from "react";
import { type DefinedUseQueryResult, type UseQueryResult } from "@tanstack/react-query";
import { LOADING_WAITING_TIME } from "@/constants/common";
import Loading from "../Loading";
import { useDelayLoading } from "@/hooks";
import Empty from "../Empty";
import classNames from "classnames";
// import NoDataImg from "@/assets/icons/no-data.svg?component";

type QueryResultProps<TData, TError> = {
  query: UseQueryResult<TData, TError>;
  children: (data: TData) => ReactElement;
  delayLoading?: boolean;
  errorRender?: (err: TError) => ReactElement;
  loadingRender?: (show: boolean) => ReactElement;
  defaultLoadingClassName?: string;
};

export function QueryResult<TData, TError>(props: QueryResultProps<TData, TError>): ReactElement {
  const {
    query,
    children,
    delayLoading,
    errorRender,
    loadingRender,
    defaultLoadingClassName = "min-h-[80px]"
  } = props;
  const delayedLoading = useDelayLoading(LOADING_WAITING_TIME, true);

  switch (query.status) {
    case "error":
      return errorRender ? errorRender(query.error) : <Empty className="flex-1 h-full min-h-[40vh] gap-3" iconScale={2} message={query.error?.message ?? ""} />
    case "success":
      return children(query.data);
    // case "loading":
    case "pending":
    default:
      return loadingRender ? (
        loadingRender(delayLoading ? delayedLoading : true)
      ) : (
        <Loading show={delayLoading ? delayedLoading : true} className={classNames(defaultLoadingClassName, "flex-1")} />
      );
  }
}


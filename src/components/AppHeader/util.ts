import { createGlobalState, useGlobalState } from "@/utils/state";
import { useEffect } from "react";

const globalShowHeaderSearchBarCounter = createGlobalState<number>(0);

export function useShowSearchBarInHeader(show: boolean) {
  const [, setCounter] = useGlobalState(globalShowHeaderSearchBarCounter);

  useEffect(() => {
    if (!show) return;

    setCounter((counter) => counter + 1);
    return () => setCounter((counter) => counter - 1);
  }, [show, setCounter]);
}

export function useIsShowSearchBarInHeader() {
  const [counter] = useGlobalState(globalShowHeaderSearchBarCounter);
  return counter > 0;
}
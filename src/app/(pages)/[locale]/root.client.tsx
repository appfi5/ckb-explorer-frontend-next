"use client"

import { useBlockChainInfo } from "@/store/useBlockChainInfo";
import { useEffect } from "react";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const asyncLoopRun = (fn: () => Promise<void>, interval: number) =>
  fn()
    .then(() => sleep(interval))
    .then(() => { asyncLoopRun(fn, interval) })

export default function ClientRoot() {
  const { updateStatistics } = useBlockChainInfo();

  useEffect(() => {
    asyncLoopRun(updateStatistics, 4000);
    // asyncLoopRun(updateBlockNumber, 4000);
  }, [])

  return null;
}
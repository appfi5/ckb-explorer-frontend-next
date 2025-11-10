import { env } from "@/env";

export function getEnvChainNodes() {
  const backupNodes = env.NEXT_PUBLIC_CHAIN_NODE?.split(",") || [];
  return backupNodes;
};


export function getEnvDidIndexerUrls() {
  const didIndexerUrls = env.NEXT_PUBLIC_DID_INDEXER_URL?.split(",") || [];
  return didIndexerUrls;
}
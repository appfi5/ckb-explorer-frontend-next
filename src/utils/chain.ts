import { env } from "@/env";

export const isMainnet = () => {
  return env.NEXT_PUBLIC_CHAIN_TYPE === "mainnet";
};

export const isChainTypeError = (address: string): boolean => {
  const chainType = env.NEXT_PUBLIC_CHAIN_TYPE;
  if (address.startsWith("ckb") || address.startsWith("ckt")) {
    return (
      (chainType === "mainnet" && address.startsWith("ckt")) ||
      (chainType === "testnet" && address.startsWith("ckb"))
    );
  }
  return false;
};

export default {
  isMainnet,
  isChainTypeError,
};

import type { Script } from "../Script";

export interface LockHolderAmount {
  hashType: string;
  name: string;
  holderCount: string;
  codeHash: string;
}

export interface XUDTHolderAllocation {
  btcHolderCount: string;
  lockHashes: LockHolderAmount[];
}

export interface XUDT {
  holdersCount: string;
  addressesCount: string;
  createdAt: string;
  h24CkbTransactionsCount: string;
  issuerAddress: string;
  published: boolean;
  decimal: string | null;
  fullName: string | null;
  symbol: string | null;
  totalAmount: string;
  typeHash: string;
  typeScriptHash: string;
  typeScript: Script;
  udtType: "xudt";
  tags?: string[];
  xudtTags?: string[];
  iconFile: string;
  icon?: string;
  operatorWebsite: string;
  email: string;
  description: string;
  ssriContractOutpoint?: {
    cellIndex: number;
    txHash: string;
  };
}

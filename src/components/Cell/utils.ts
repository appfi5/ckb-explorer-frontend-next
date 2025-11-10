import clientDB from "@/database";
import type { KnownScriptInfo } from "@/database/known-scripts/tool";



export enum CellType {
  NORMAL = 0,
  NERVOS_DAO_DEPOSIT = 1,
  NERVOS_DAO_WITHDRAWING = 2,
  UDT = 3,
  M_NFT_ISSUER = 4,
  M_NFT_CLASS = 5,
  M_NFT_TOKEN = 6,
  NRC_721_TOKEN = 7,
  NRC_721_FACTORY = 8,
  COTA_REGISTRY = 9,
  COTA_REGULAR = 10,
  SPORE_CLUSTER = 11,
  SPORE = 12,
  OMIGA_INSCRIPTION_INFO = 13,
  OMIGA_INSCRIPTION = 14,
  XUDT = 15,
  UNIQUE = 16,
  XUDT_COMPATIBLE = 17,
  DID = 18,
  STABLEPP_POOL = 19,
  SSRI = 20,
}

function getCodeHashListFromCellType(cellType: NonNullable<KnownScriptInfo['cellTypeTag']>) {
  return clientDB.knownScript.byCellType(cellType)
    .reduce((arr, script) => {
      script.deployments.forEach(deployment => {
        arr.push(deployment.codeHash);
      });
      return arr;
    }, [] as string[]);
}

export const builtinUDTScriptCodeHashList = getCodeHashListFromCellType("udt")
export const builtinSporeScriptCodeHashList = getCodeHashListFromCellType("spore")
export const builtinDAOScriptCodeHashList = getCodeHashListFromCellType("dao")
export const builtinSporeClusterScriptCodeHashList = getCodeHashListFromCellType("spore-cluster")
export const builtinCKBFSCodeHashList = getCodeHashListFromCellType("ckbfs")

export const UDTTypeList = [
  CellType.UDT,
  CellType.XUDT,
  CellType.XUDT_COMPATIBLE,
];

export const UDTTypeText = {
  [CellType.UDT]: "UDT",
  [CellType.XUDT]: "xUDT",
  [CellType.XUDT_COMPATIBLE]: "xUDT-compatible",
}
import { builtinSporeClusterScriptCodeHashList, CellType } from "../utils";
import { DataParseUnit } from "./tool";
import { parseSporeClusterData } from "@/utils/spore";





export const sporeClusterDataParseUnit = new DataParseUnit(
  "spore-cluster",
  ({ cellType, typeScript }) => {
    if (cellType === CellType.SPORE_CLUSTER
      || (typeScript?.codeHash && builtinSporeClusterScriptCodeHashList.includes(typeScript.codeHash))
    ) {
      return true;
    }
    return false;
  },
  (dataStr) => {
    return parseSporeClusterData(dataStr);
  }
)
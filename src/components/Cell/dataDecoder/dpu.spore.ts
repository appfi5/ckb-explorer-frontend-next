import { builtinSporeScriptCodeHashList, CellType } from "../utils";
import { DataParseUnit } from "./tool";
import { parseSporeCellData } from "@/utils/spore";





export const sporeDataParseUnit = new DataParseUnit(
  "spore",
  ({ cellType, typeScript }) => {
    if (cellType === CellType.SPORE
      || (typeScript?.codeHash && builtinSporeScriptCodeHashList.includes(typeScript.codeHash))) {
      return true;
    }
    return false;
  },
  (dataStr) => {
    return parseSporeCellData(dataStr);
  }
)
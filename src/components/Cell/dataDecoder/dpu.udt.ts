import BigNumber from "bignumber.js";
import { builtinUDTScriptCodeHashList, UDTTypeList } from "../utils";
import { DataParseUnit, littleEndianToBigEndian } from "./tool";





export const udtDataParseUnit = new DataParseUnit(
  "udt",
  ({ cellType, typeScript }) => {
    if (UDTTypeList.find(type => type === cellType)
    || (typeScript?.codeHash && builtinUDTScriptCodeHashList.includes(typeScript.codeHash))) {
      return true;
    }
    return false;
  },
  (dataStr) => {
    const amountHex = dataStr.slice(0, 32);
    const unknownDataHex = dataStr.slice(32);
    const parsedData = {
      amount: new BigNumber(littleEndianToBigEndian(amountHex)).toFormat({ groupSeparator: "" }),
      ...(!!unknownDataHex && { unknownData: unknownDataHex })
    };
    // if(unknownDataHex) {
    //   parsedData.unknownData = unknownDataHex;
    // }
    return parsedData;
  }
)
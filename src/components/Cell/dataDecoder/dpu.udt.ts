import BigNumber from "bignumber.js";
import { builtinUDTScriptCodeHashList, UDTTypeList } from "../utils";
import { DataParseUnit, littleEndianToBigEndian } from "./tool";
import { withNetwork } from "@/utils/withNetwork";



const decodableScriptList = builtinUDTScriptCodeHashList.concat(withNetwork({
  testnet: ["0x1142755a044bf2ee358cba9f2da187ce928c91cd4dc8692ded0337efa677d21a"],
  mainnet: [],
}, []))

export const udtDataParseUnit = new DataParseUnit(
  "udt",
  ({ cellType, typeScript }) => {
    if (UDTTypeList.find(type => type === cellType)
    || (typeScript?.codeHash && decodableScriptList.includes(typeScript.codeHash))) {
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
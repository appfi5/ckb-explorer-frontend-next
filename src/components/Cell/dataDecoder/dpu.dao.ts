import BigNumber from "bignumber.js";
import {  builtinDAOScriptCodeHashList, CellType } from "../utils";
import { DataParseUnit, littleEndianToBigEndian } from "./tool";





export const daoDataParseUnit = new DataParseUnit(
  "dao",
  ({ cellType, typeScript }) => {
    if (cellType === CellType.NERVOS_DAO_DEPOSIT
      || cellType === CellType.NERVOS_DAO_WITHDRAWING
      || (typeScript?.codeHash && builtinDAOScriptCodeHashList.includes(typeScript.codeHash))) {
      return true;
    }
    return false;
  },
  (dataStr) => {
    const blockHex = dataStr.slice(0, 16);
    // const unknownDataHex = dataStr.slice(16);
    const blockNumber = new BigNumber(littleEndianToBigEndian(blockHex)).toFormat({ groupSeparator: "" });
    if(!blockNumber || blockNumber === '0') return {};
    return {
      blockNumber: blockNumber,
    };
  }
)
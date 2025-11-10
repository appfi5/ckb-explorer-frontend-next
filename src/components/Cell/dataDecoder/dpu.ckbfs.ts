import { mol } from "@ckb-ccc/core";
import { builtinCKBFSCodeHashList, CellType } from "../utils";
import { DataParseUnit } from "./tool";



const v3Parser = mol.table({
  index: mol.Uint32,
  checksum: mol.Uint32,
  content_type: mol.Bytes,
  filename: mol.Bytes,
})

const v2Parser = (() => {
  const Indexses = mol.vector(mol.Uint32)
  const BackLink = mol.table({
    index: Indexses,
    checksum: mol.Uint32,
    tx_hash: mol.Byte32,
  });
  const CKBFSData = mol.table({
    index: Indexses,
    checksum: mol.Uint32,
    content_type: mol.Bytes,
    filename: mol.Bytes,
    backlinks: mol.vector(BackLink),
  })
  return CKBFSData
})()

const findParser = (codeHash?: string) => {
  switch(codeHash) {
    case "0x31e6376287d223b8c0410d562fb422f04d1d617b2947596a14c3d2efb7218d3a": // v2
      return v2Parser;
    case "0xb5d13ffe0547c78021c01fe24dce2e959a1ed8edbca3cb93dd2e9f57fb56d695": // v3
      return v3Parser;
    default:
      return null;
  }
}

export const ckbfsDataParseUnit = new DataParseUnit(
  "ckbfs",
  ({ cellType, typeScript }) => {
    if ((typeScript?.codeHash && builtinCKBFSCodeHashList.includes(typeScript.codeHash))
    ) {
      return true;
    }
    return false;
  },
  (dataStr, { typeScript }) => {
    const parser = findParser(typeScript?.codeHash);
    const errorReturn = { message: "parse failed" }
    try {
      return parser?.decode(dataStr) ?? errorReturn;
    } catch (e) {
      console.error("ckbfs parse failed", e);
    }
    return errorReturn
  }
)
import type { CellType } from "../utils";



export const littleEndianToBigEndian = (v: string, keepHexPrefix = true) => {
  let source = v;
  if(source.startsWith("0x")) {
    source = source.slice(2);
  }
  const bytes = v.match(/\w{2}/g);
  if (!bytes) return "";
  const be = bytes.reverse().join("");
  if (Number.isNaN(+`0x${be}`)) {
    throw new Error("Invalid little-endian");
  }
  return keepHexPrefix ? `0x${be}` : be;
};


export type DPUMatchParams = {
  cellType?: CellType // APIExplorer.CellInfoResponse['cellType']
  typeScript?: APIExplorer.ScriptResponse
  typeHash?: string
}

export class DataParseUnit<DPUType extends string = string, ParsedContent extends Record<string, any> = Record<string, any>> {
  constructor(
    public type: DPUType,
    public match: (params: DPUMatchParams) => boolean,
    public parse: (v: string, params: DPUMatchParams) => ParsedContent
  ) {}
}
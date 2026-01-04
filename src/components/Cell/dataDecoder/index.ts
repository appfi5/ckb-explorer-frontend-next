// import { ckbfsDataParseUnit } from "./dpu.ckbfs";
import { daoDataParseUnit } from "./dpu.dao";
import { sporeDataParseUnit } from "./dpu.spore";
import { sporeClusterDataParseUnit } from "./dpu.sporeCluster";
import { udtDataParseUnit } from "./dpu.udt";
import { type DataParseUnit, type DPUMatchParams } from "./tool";


type ExtractTypeAndParseResult<T = any> = T extends DataParseUnit ? {
  type: T["type"];
  content: ReturnType<T["parse"]>;
} : never;

type ExtractType<T = any> = T extends DataParseUnit ? T["type"] : never;

export type DPUParseResult = undefined
  | ExtractTypeAndParseResult<typeof udtDataParseUnit>
  | ExtractTypeAndParseResult<typeof sporeDataParseUnit>
  | ExtractTypeAndParseResult<typeof sporeClusterDataParseUnit>
  | ExtractTypeAndParseResult<typeof daoDataParseUnit>
  // | ExtractTypeAndParseResult<typeof ckbfsDataParseUnit>
export type DPUParseType = undefined
  | ExtractType<typeof udtDataParseUnit>
  | ExtractType<typeof sporeDataParseUnit>
  | ExtractType<typeof sporeClusterDataParseUnit>
  | ExtractType<typeof daoDataParseUnit>

class DataParser {
  public dpuList: DataParseUnit[] = []
  add(dpu: DataParseUnit) {
    this.dpuList.push(dpu)
    return this;
  }

  parse(params: DPUMatchParams, hexData: string): DPUParseResult {
    if (!hexData || hexData === "0x") {
      return;
    }
    const noPrefixData = hexData.startsWith("0x") ? hexData.slice(2) : hexData;
    for (const dpu of this.dpuList) {
      if (dpu.match(params)) {
        return {
          type: dpu.type,
          content: dpu.parse(noPrefixData, params)
        } as unknown as NonNullable<DPUParseResult>
      }
    }
  }
  parseType(params: DPUMatchParams): DPUParseType {
    for (const dpu of this.dpuList) {
      if (dpu.match(params)) {
        return dpu.type as DPUParseType;
      }
    }
  }
}

const parser = new DataParser();

parser
  .add(udtDataParseUnit)
  .add(sporeDataParseUnit)
  .add(sporeClusterDataParseUnit)
  .add(daoDataParseUnit)
  // .add(ckbfsDataParseUnit)



export default function parseData(params: DPUMatchParams, data: string) {
  return parser.parse(params, data);
}

export function parseType(params: DPUMatchParams) {
  return parser.parseType(params);
}
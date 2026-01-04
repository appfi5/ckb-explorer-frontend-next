import { Script, type ScriptLike } from "@ckb-ccc/core";


type UDTParams = {
  name: string;
  icon: string;
  symbol: string;
  decimalPlaces: number;
  type: ScriptLike;
  manager?: string;
  tags?: string[];
};

export type UDT = {
  name: string;
  icon: string;
  symbol: string;
  decimalPlaces: number;
  type: ScriptLike;
  typeHash: string;
  manager?: string;
  tags: string[];
}

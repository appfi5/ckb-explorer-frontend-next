import type { UDT } from "@/database/udts/tool"
import type { ccc } from "@ckb-ccc/core"


export type UDTDetail = APIExplorer.UdtDetailResponse & {
  typeScriptHash: string
  typeScript?: ccc.Script
  info?: UDT
}
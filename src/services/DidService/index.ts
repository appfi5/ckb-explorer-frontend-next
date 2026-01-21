import { getEnvDidIndexerUrls } from "@/utils/envVarHelper";
import { ccc, ClientPublicMainnet, ClientPublicTestnet } from "@ckb-ccc/core";

export const getReverseAddresses = async (
  account: string,
): Promise<ReverseAddress[] | null> => {
  const didIndexerUrls = getEnvDidIndexerUrls();
  const didIndexerUrl = didIndexerUrls[0]
  if (!didIndexerUrl) return null;

  try {
    const response = await fetch(
      `${didIndexerUrl}/v1/account/reverse/address`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account,
        }),
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data?.data?.list ?? null;
  } catch {
    return null;
  }
};

export async function getDasAccount(ckbAddress: string) {
  const ckbAddr = await ccc.Address.fromString(ckbAddress, new (ckbAddress.startsWith("ckt") ? ClientPublicTestnet : ClientPublicMainnet));
  const args = ckbAddr.script.args;
  if (ckbAddr.script.codeHash !== "0x9376c3b5811942960a846691e16e477cf43d7c7fa654067c9948dfcd09a32137" || !args.startsWith("0x05")) return;
  const didIndexerUrls = getEnvDidIndexerUrls();
  const didIndexerUrl = didIndexerUrls[0]
  if (!didIndexerUrl) return;
  try {
    const response = await fetch(
      `${didIndexerUrl}/v1/reverse/record`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "blockchain",
          key_info: {
            coin_type: "",
            chain_id: "1",
            key: `0x${args.slice(-40)}`
          }
        }),
      },
    );

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    return (data?.data?.account ?? "") as string;
  } catch {
    return;
  }
}

interface ReverseAddress {
  key_info: Record<"chain_id" | "coin_type" | "key", string>;
  type: string;
}

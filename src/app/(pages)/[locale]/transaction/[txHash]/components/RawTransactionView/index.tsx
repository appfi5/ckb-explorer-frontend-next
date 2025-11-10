import type { FC } from "react";
import { useQuery } from "@tanstack/react-query";
// import JsonView from "@microlink/react-json-view";
import { ccc } from "@ckb-ccc/core";
// import Loading from "../AwesomeLoadings/Spinner";
import dynamic from "next/dynamic";
import Loading from "@/components/Loading";
import { NodeService } from "@/services/NodeService";
import { useTheme } from "@/components/Theme";
import { getEnvChainNodes } from "@/utils/envVarHelper";


const JsonView = dynamic(() => import("@microlink/react-json-view"), {
  ssr: false
})

const RawTransactionView: FC<{ hash: string }> = ({ hash }) => {
  const [theme] = useTheme();
  const isDarkTheme = theme === "dark";
  const { data, isLoading } = useQuery({
    queryKey: ["tx", hash],
    queryFn: () => {
      const nodes = getEnvChainNodes();
      const node = nodes[0]
      if (!node) return null;
      const nodeService = new NodeService(node);
      return nodeService.rpc.getTransaction(hash)
    },
    enabled: true,
  });
  if (isLoading) {
    return (
      <Loading className="min-h-[40px]" />
    );
  }
  if (!data?.transaction) return <div className="mt-[16px]">{`Transaction ${hash} not loaded`}</div>;

  return (
    <JsonView
      src={JSON.parse(ccc.stringify(data.transaction))}
      name="Transaction"
      indentWidth={4}
      collapseStringsAfterLength={100}
      groupArraysAfterLength={20}
      iconStyle="square"
      displayDataTypes={false}
      style={{
        borderRadius: 4,
        marginTop: 16,
        // background: isDarkTheme ? "#111" : "#fff",
        padding: 8,
        overflow: "auto",
        // color: isDarkTheme ? "#fff" : "#232323",
      }}
      onSelect={(select) => {
        switch (select.name) {
          case "txHash": {
            window.open(`/transaction/${select.value}`, "_blank");
            break;
          }
          // case "codeHash": {
          //   const [, index, lockType] = select.namespace;
          //   if (!index || !lockType) return;
          //   const script = data.transaction.outputs[index as any]?.[lockType as "lock" | "type"];
          //   if (script) {
          //     window.open(
          //       `/script/${script.codeHash}/${script.hashType}`,
          //       "_blank",
          //     );
          //   }
          //   break;
          // }
          default: {
            // ignore
          }
        }
      }}
      theme={{
        base00: isDarkTheme ? "#111" : "#fff",
        base01: "#ddd",
        base02: "#ddd",
        base03: "#444",
        base04: "purple",
        base05: "#444",
        base06: "#444",
        base07: isDarkTheme ? "#fff" : "#232323", // "#444",
        base08: "#444",
        base09: "var(--color-primary)",
        base0A: "var(--color-primary)",
        base0B: "var(--color-primary)",
        base0C: "var(--color-primary)",
        base0D: "var(--color-primary)",
        base0E: "var(--color-primary)",
        base0F: "var(--color-primary)",
      }}
    />
  );
};
export default RawTransactionView;

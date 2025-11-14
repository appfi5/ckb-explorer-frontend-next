import { useState, memo } from "react";
import classNames from "classnames";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  ChainName,
  IS_MAINNET,
  MAINNET_URL,
  ONE_DAY_MILLISECOND,
  TESTNET_URL,
} from "@/constants/common";
import Popover from "@/components/Popover";
import ArrowIcon from "@/assets/icons/arrow-down.svg?component";
import PixelBorderBlock from "@/components/PixelBorderBlock";
import server from "@/server";

const handleVersion = (nodeVersion: string) => {
  if (nodeVersion && nodeVersion.includes("(")) {
    return `v${nodeVersion.slice(0, nodeVersion.indexOf("("))}`;
  }
  return nodeVersion;
};

export default function BlockchainSwitch() {
  const query = useQuery({
    queryKey: ["node_version"],
    // keepPreviousData: true,
    // placeholderData: keepPreviousData,
    // initialData: () => cacheService.get<string>("node_version"),
    queryFn: async () => {
      // const { version } = await explorerService.api.fetchNodeVersion();
      const res = await server.explorer("GET /nets/version");
      const version = res?.version ?? ""; // "v0.0.1"
      // cacheService.set<string>("node_version", version, {
      //   expireTime: ONE_DAY_MILLISECOND,
      // });
      return version;
    },
  });
  const nodeVersion = query.data ?? "";
  const [open, setOpen] = useState(false);


  return (
    <>
      {/* <PixelBorderBlock
        className="cursor-pointer flex-col"
        apperanceClassName="*:data-[slot=border]:bg-[#4d4d4d] hover:*:data-[slot=bg]:bg-[#ffffff14]"
        contentClassName="relative py-[1px] px-2"
      >
        <div className="flex flex-col text-primary items-left justify-between gap-[2px] leading-[1] text-[12px]">
          <div className="uppercase">
            {IS_MAINNET ? `${ChainName.Mainnet} Mainnet` : `${ChainName.Testnet} Testnet`}
          </div>
          <div className="text-[10px]">
            {handleVersion(nodeVersion)}&nbsp;
          </div>
        </div>

        <ArrowIcon className="absolute right-0 top-0 bottom-0 text-primary m-auto" />
      </PixelBorderBlock> */}
      <Popover
        onOpenChange={setOpen}
        open={open}
        showArrow={false}
        contentStyle={{
          marginTop: 8,
          padding: 4,
          minWidth: "var(--radix-popper-anchor-width)",
          width: "fit-content",
        }}
        contentClassName="dark:bg-[#232323]!"
        trigger={
          <PixelBorderBlock
            className="cursor-pointer flex-col hidden lg:block"
            contentClassName="relative py-[1px] pl-[2px] pr-[24px]"
          >
            <div className="flex flex-col text-primary text-left justify-between gap-[2px] leading-[1] text-[12px]">
              <div className="uppercase">
                {IS_MAINNET ? `${ChainName.Mainnet} Mainnet` : `${ChainName.Testnet} Testnet`}
              </div>
              <div className="text-[10px]">
                {handleVersion(nodeVersion)}&nbsp;
              </div>
            </div>

            <ArrowIcon className="absolute right-0 top-0 bottom-0 text-primary m-auto" />
          </PixelBorderBlock>
        }
      >
        <div className="flex flex-col gap-1 capitalize">
          <a
            className="rounded-sm px-2 py-1 dark:text-white dark:hover:text-primary hover:bg-[#f4f4f5] dark:hover:bg-[#303030]"
            href={MAINNET_URL}
          >
            {`${ChainName.Mainnet} Mainnet`}
          </a>
          <a
            className="rounded-sm px-2 py-1 dark:text-white dark:hover:text-primary hover:bg-[#f4f4f5] dark:hover:bg-[#303030]"
            href={TESTNET_URL}
          >
            {`${ChainName.Testnet} Testnet`}
          </a>
        </div>
      </Popover>
    </>
  );
};

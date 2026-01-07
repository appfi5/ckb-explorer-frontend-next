import { useTranslation } from "react-i18next";
import ListContainer from "./ListContainer";
import { useQuery } from "@tanstack/react-query";
import { BLOCK_POLLING_TIME } from "@/constants/common";
import Loading from "@/components/Loading";
import BlockLightIcon from "../../assets/block.light.svg?component"
import BlockDarkIcon from "../../assets/block.dark.svg?component"
import Link from "next/link";
import classNames from "classnames";
import styles from './LatestBlocks.module.scss';
import { shannonToCkb } from "@/utils/util";
import BigNumber from "bignumber.js";
import server from "@/server";
import TwoSizeAmount from "@/components/TwoSizeAmount";
import { useBlockChainInfo } from "@/store/useBlockChainInfo";
import { useTheme } from "@/components/Theme";
import OutLink from "@/components/OutLink";
import DateTime from "@/components/DateTime";
import CKBAddress from "@/components/CKBAddress";
export default function LatestBlocks() {
  const { t } = useTranslation();
  const blocksQuery = useQuery({
    queryKey: ["latest_blocks"],
    refetchInterval: BLOCK_POLLING_TIME,
    queryFn: async () => {
      const list = await server.explorer("GET /blocks/homePage", { pageSize: 15 });
      return {
        blocks: list ?? [],
      }
    }
  });

  const blocks = blocksQuery.data?.blocks ?? [];

  return (
    <ListContainer
      title={t("home.latest_blocks")}
      link="/block/list"
    >
      {
        blocks.length > 0 ? (
          blocks.map((block) => (
            <BlockItem key={block.number} block={block} />
          ))
        ) : (
          <Loading className="py-[56px]" />
        )
      }
    </ListContainer>
  )
}



function BlockItem({ block }: { block: APIExplorer.BlockListResponse }) {
  const { t } = useTranslation();
  const liveCellChanges = Number(block.liveCellChanges);
  const topBlockNumber = useBlockChainInfo(t => t.blockNumber);
  const [theme] = useTheme();
  const isDarkTheme = theme === "dark";
  const BlockIcon = isDarkTheme ? BlockDarkIcon : BlockLightIcon;
  return (
    <div className={classNames("flex flex-col sm:flex-row justify-between bg-[#F5F9FB] dark:bg-[#303030] gap-4 sm:gap-2 p-3 sm:p-4 lg:p-6 xl:p-4 2xl:p-6 rounded-[8px]", styles.block)}>

      <div className="flex flex-row gap-[12px]">
        <div className="hidden sm:flex size-[54px] rounded-[4px] text-primary">
          <BlockIcon width="100%" height="100%" />
        </div>
        <div className="flex-1 items-center sm:items-start flex flex-row sm:flex-col justify-between">
          {/* <Link className={classNames("font-bold text-[18px] leading-[1] hover:text-primary")} href={`/block/${block.number}`}>
            <TextWithLinkIcon className="font-hash">
              {block.number}
            </TextWithLinkIcon>
          </Link> */}

          <OutLink
            className="font-hash font-bold text-base sm:text-[18px] leading-[1]"
            href={`/block/${block.number}`}
          >
            <span>
              <span className="inline sm:hidden mr-1 font-normal">#</span>
              <span className="text-primary sm:text-inherit">{block.number}</span>
            </span>
          </OutLink>
          <div className="font-medium text-xs sm:text-sm text-[#999] leading-[1]">
            <DateTime date={block.timestamp} showRelative />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-1">
        <div className="flex flex-row text-sm sm:text-[16px] leading-[22px] gap-3">
          <span className="text-[#232323] dark:text-white font-medium whitespace-nowrap">{t("home.miner")}</span>
          <Link
            className="hover:text-primary"
            href={`/address/${block.minerHash}`}
          >
            <CKBAddress
              className="underline"
              address={block.minerHash}
              ellipsis="address"
            />
          </Link>

        </div>
        <div className="text-[14px] text-[#999] leading-[1]">
          <span>{t("home.reward")}</span>
          <span className="ml-[8px]">
            {
              block.reward ? (
                <TwoSizeAmount
                  className="inline"
                  decimalClassName="text-[12px]"
                  amount={shannonToCkb(block.reward)}
                  format={[2, BigNumber.ROUND_FLOOR]}
                  unit={<span className="text-[12px]">{topBlockNumber - block.number < 11 ? "+" : ""}</span>}
                />
              )
                : t("block.pending")
            }

            {/* {isDelayBlock ? <span data-role="suffix">+</span> : null} */}
          </span>
        </div>
      </div>

      <div className="sm:basis-[90px] flex flex-row items-center sm:flex-col sm:items-end justify-between text-right">
        <div className="font-hash text-sm sm:text-base leading-[22px]">
          {block.transactionsCount}
          <span className="ml-1">TXs</span>
        </div>
        <div className="font-medium text-[#999] leading-[1] text-xs sm:text-sm">
          {`${liveCellChanges >= 0 ? "+" : "-"}${Math.abs(liveCellChanges)} ${t("home.cells")}`}
        </div>
      </div>
    </div >
  )
}
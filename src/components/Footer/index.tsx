"use client"

import { type ReactNode, memo } from "react";
import { useTranslation } from "react-i18next";
import { getCurrentYear } from "@/utils/date";
import XIcon from "./icons/footer_X.svg?component";
import MediumIcon from "./icons/footer_medium.svg?component";
import TelegramIcon from "./icons/footer_telegram.svg?component";
import RedditIcon from "./icons/footer_reddit.svg?component";
import YoutubeIcon from "./icons/footer_youtube.svg?component";
import ForumIcon from "./icons/footer_forum.svg?component";
import Discord from "./icons/footer_discord.svg?component";
import FooterLogoIcon from "../icons/footerLogoIcon";
import FooterUpIcon from "./icons/footer-up.svg?component";
import { usePathname } from 'next/navigation';
import styles from "./styles.module.scss"

interface FooterLinkItem {
  label: string;
  url: string;
  icon?: ReactNode;
}

const DataList: { name: string; items: FooterLinkItem[] }[] = [
  {
    name: "nervos_foundation",
    items: [
      {
        label: "about_us",
        url: "https://www.nervos.org/",
      },
      {
        label: "media_kit",
        url: "https://www.nervos.org/media-kit",
      },
    ],
  },
  {
    name: "developer",
    items: [
      {
        label: "docs",
        url: "https://docs.nervos.org",
      },
      {
        label: "gitHub",
        url: "https://github.com/nervosnetwork",
      },
      {
        label: "whitepaper",
        url: "https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0002-ckb/0002-ckb.md",
      },
      {
        label: "faucet",
        url: "https://faucet.nervos.org/",
      },
      // {
      //   label: "api-doc",
      //   url: "https://ckb-explorer.readme.io/reference/transaction",
      // },
      {
        label: "community_nodes",
        url: "https://docs.nervos.org/docs/getting-started/blockchain-networks#public-networks",
      },
      {
        label: "tools",
        url: "/tools",
      },
      // {
      //   label: "service_configuration",
      //   url: "/service-configuration",
      // },
    ],
  },
  {
    name: "community",
    items: [
      {
        label: "knowledge_base",
        url: "https://www.nervos.org/knowledge-base",
      },
      {
        label: "ckb_world",
        url: "https://www.ckb.world",
      },
      {
        label: "eco_fund",
        url: "https://www.ckbeco.fund",
      },
      {
        label: "network",
        url: "/charts/node-geo-distribution",
      },
    ],
  },
];

const IconList = [
  {
    label: "discord",
    icon: <Discord />,
    url: "https://discord.com/invite/FKh8Zzvwqa",
  },
  {
    label: "X",
    icon: <XIcon />,
    url: "https://x.com/nervosnetwork",
  },
  {
    label: "blog",
    icon: <MediumIcon />,
    url: "https://medium.com/nervosnetwork",
  },
  {
    label: "telegram",
    icon: <TelegramIcon />,
    url: "https://t.me/nervosnetwork",
  },
  {
    label: "reddit",
    icon: <RedditIcon />,
    url: "https://www.reddit.com/r/NervosNetwork/",
  },
  {
    label: "youtube",
    icon: <YoutubeIcon />,
    url: "https://www.youtube.com/channel/UCONuJGdMzUY0Y6jrPBOzH7A",
  },
  {
    label: "forum",
    icon: <ForumIcon />,
    url: "https://talk.nervos.org/",
  },
]

export default memo(() => {
  const [t] = useTranslation();
  const pathname = usePathname();

  const hideScollToTop = !(pathname === "/" || pathname === "/zh")

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="bg-white dark:bg-black">
      <div
        className="w-full min-h-fit container pt-[64px] md:pt-[64px] pb-3 text-[#484D4E] dark:text-[#999999] transition-colors duration-300"
      >
        <div className="flex flex-col gap-2 md:flex-row md:justify-between border-b-1 pb-[24px] md:pb-[44px] mb-3 border-[#D9D9D9] dark:border-[#484D4E]">
          <div className="flex flex-col gap-y-11 mb-5 md:mb-0">
            <FooterLogoIcon className="text-black dark:text-white" />
            <div className="flex flex-row flex-wrap items-center gap-x-4 gap-y-6 md:w-72">
              {
                IconList.map((item) => (
                  <a
                    className={`${styles.link} basis-[55px] flex flex-col gap-y-1`}
                    href={item.url}
                    rel="noopener noreferrer"
                    key={item.label}
                    title={t(`footer.${item.label}`)}
                    target="_blank"
                  >
                    <span className="flex items-center justify-center mb-2.5 text-[#232323]">
                      {item.icon}
                    </span>
                    <span className="text-center text-xs font-medium text-[#484D4E] dark:text-[#999999]">
                      {t(`footer.${item.label}`)}
                    </span>
                  </a>
                ))
              }
            </div>
          </div>
          <div className="flex-2" />
          {/* <div className="flex flex-col gap-y-5 md:flex-row md:gap-x-40 md:gap-y-0"> */}
          {
            DataList.reduce((arr, list, index) => {
              if (index !== 0) {
                arr.push(<div key={`spliter_${index}`} className="flex-1" />);
              }
              arr.push((
                <div className='flex flex-col gap-y-2' key={list.name}>
                  <div className="font-medium text-lg leading-[2] text-black dark:text-white">{t(`footer.${list.name}`)}</div>
                  <div className="flex flex-col gap-y-2">
                    {
                      list.items.map((item) => (
                        <a
                          key={item.label}
                          className="text-sm font-medium hover:text-primary"
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t(`footer.${item.label}`)}
                        </a>
                      ))
                    }
                  </div>
                </div>
              ))
              return arr;
            }, [] as ReactNode[])
          }
          <div className="flex-2" />
          {/* </div> */}
          <div className="w-[30px]">
            {!hideScollToTop && <FooterUpIcon className="text-black dark:text-white cursor-pointer hover:text-primary" onClick={() => scrollToTop()} />}
          </div>
        </div>
        <div className="flex flex-col text-[12px] md:flex-row md:justify-between md:tems-center text-center text-[#999999] dark:text-[#484D4E]">
          <span>
            Powered by Appfi5
          </span>
          <div>
            <span>{`Copyright © ${getCurrentYear()} Nervos Foundation. `}</span>
            <span>All Rights Reserved.</span>
          </div>
        </div>
      </div>
    </div>
  );
});

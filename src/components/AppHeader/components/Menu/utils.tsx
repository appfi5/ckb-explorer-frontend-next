import { env } from "@/env";
import { usePathname } from "next/navigation"

import { useTranslation } from "react-i18next";
import MenuIconHome from "@/assets/icons/menu.home.svg?component";
import MenuIconDAO from "@/assets/icons/menu.dao.svg?component";
import MenuIconCharts from "@/assets/icons/menu.charts.svg?component";
import MenuIconTokens from "@/assets/icons/menu.tokens.svg?component";
import MenuIconFaucet from "@/assets/icons/menu.faucet.svg?component";
import MenuIconFree from "@/assets/icons/menu.free.svg?component";


export function useMenu() {
  const currentPathName = usePathname();
  const { t, i18n } = useTranslation();
  const lanPathPrefix = i18n.language === 'en' ? "" : `/${i18n.language}`;

  const list = [
    {
      key: 'home',
      name: t('navbar.home'),
      href: '/',
      active: currentPathName === `${lanPathPrefix || "/"}`,
      icon: <MenuIconHome />,
    },
    {
      key: 'dao',
      name: t('navbar.nervos_dao'),
      href: '/nervosdao',
      icon: <MenuIconDAO />,
      active: currentPathName === `${lanPathPrefix}/nervosdao`,
    },
    {
      key: 'charts',
      name: t('navbar.charts'),
      href: '/charts',
      icon: <MenuIconCharts />,
      active: currentPathName.startsWith(`${lanPathPrefix}/charts`),
    },
    {
      key: 'tokens',
      name: t('navbar.tokens'),
      icon: <MenuIconTokens />,
      active: currentPathName.startsWith(`${lanPathPrefix}/udts`)
        || currentPathName.startsWith(`${lanPathPrefix}/nft-collections`),
      routes: [
        {
          key: 'udts',
          name: t('navbar.coins'),
          href: '/udts',
          active: currentPathName.startsWith(`${lanPathPrefix}/udts`)
        },
        {
          key: 'nft-collections',
          name: t('navbar.nft_collections'),
          href: "/nft-collections",
          active: currentPathName.startsWith(`${lanPathPrefix}/nft-collections`)
        }
      ]

    },
    {
      key: 'feeRate',
      name: t('navbar.fee_rate'),
      href: '/feeRate',
      icon: <MenuIconFree />,
      active: currentPathName.startsWith(`${lanPathPrefix}/feeRate`),
    },
  ]
  if (env.NEXT_PUBLIC_CHAIN_TYPE === "testnet") {
    list.push({
      key: "faucet",
      name: t("navbar.faucet"),
      icon: <MenuIconFaucet />,
      href: 'https://faucet.nervos.org/',
      active: false
    })
  }
  return list;
}

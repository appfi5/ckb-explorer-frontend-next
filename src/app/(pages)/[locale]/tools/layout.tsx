"use client"
import type { PropsWithChildren } from "react";
import styles from "./layout.module.scss";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select"
import { usePathname, useRouter } from "next/navigation";
import { Trans, useTranslation } from "react-i18next";
import classNames from "classnames";
import Card from "@/components/Card";


export default function ToolsLayout({ children }: PropsWithChildren<{}>) {


  return (
    <div className="container min-h-page-height flex flex-col lg:flex-row gap-5 py-5">
      <div className="flex-none">
        <NavMenu />
      </div>
      <div className="flex-1 self-stretch">
        {children}
      </div>
    </div>
  )
}



function NavMenu() {
  const pathname = usePathname()
  const { t } = useTranslation("tools");
  const router = useRouter();
  const toolName = pathname.split('/').pop()!;
  const tabs = [
    { key: 'address-conversion', name: t("address_conversion.title"), },
    { key: 'hasher', name: t("hasher.title"), },
    {
      key: 'snake-case-and-camel-case',
      name: t("snake_case_and_camel_case.title"),
    },
    { key: 'broadcast-tx', name: t("broadcast_tx.title"), },
    { key: 'molecule-parser', name: t("molecule_parser.title"), },
  ]

  return (
    <>
      <div className={classNames("hidden lg:flex", styles.tabs)}>
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className={classNames(styles.tab, { [styles.active!]: tab.key === toolName })}
            onClick={() => router.push(`/tools/${tab.key}`)}
          >
            {tab.name}
          </div>
        ))}
      </div>
      <Card className="block lg:hidden">
        <Select
          value={toolName}
          onValueChange={(value) => { router.push(`/tools/${value}`) }}
        >
          <SelectTrigger className="w-full border-0 bg-card p-3">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {
              tabs.map(tab => (
                <SelectItem key={tab.key} value={tab.key}>{tab.name}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </Card>

    </>
  )
}
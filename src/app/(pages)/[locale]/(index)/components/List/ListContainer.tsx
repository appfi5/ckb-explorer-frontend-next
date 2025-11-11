import type { PropsWithChildren, ReactNode } from "react";
import ArrowRightIcon from "../../assets/list.arrow.right.svg?component"
import OutlinkIcon from "@/assets/icons/outlink.svg?component"
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Card from "@/components/Card";


export default function ListContainer(props: PropsWithChildren<{ title?: ReactNode; link: string }>) {
  const { title, link, children } = props;
  const { t } = useTranslation()
  return (
    <Card className="flex flex-col overflow-hidden border-none!">
      <div className="flex flex-row items-center pl-5 sm:pl-8 pr-[36px] justify-between bg-[#232323] dark:bg-primary text-primary dark:text-white text-base sm:text-[20px] leading-[48px] font-medium">
        {title}
        {/* <ArrowRightIcon /> */}
      </div>
      <div className="flex-1 p-4 md:p-8 flex flex-col gap-[12px] dark:border-x dark:border-x-[#282B2C]">
        {children}
      </div>
      <Link
        href={link}
        className="flex items-center justify-center border-t dark:border text-sm sm:text-base font-medium leading-[24px] border-t-[#d9d9d9] dark:border-[#282B2C] hover:bg-primary dark:text-primary hover:text-white py-[12px] rounded-b-lg">
        {t("home.more")}
        <OutlinkIcon width={20} height={20} />
      </Link>
    </Card>
  )
}
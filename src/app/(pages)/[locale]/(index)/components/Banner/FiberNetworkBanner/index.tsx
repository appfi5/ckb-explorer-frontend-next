import classNames from "classnames";

import styles from "./index.module.scss"
import { useTranslation } from "react-i18next";
import Link from "next/link";
import PixelBorderBlock from "@/components/PixelBorderBlock";
import OutlinkIcon from "@/assets/icons/outlink.small.svg?component";

export default function FiberNetworkBanner() {
  const { t } = useTranslation()
  return (
    <div className={classNames(styles.banner)}>
      <div className={styles.content}>
        <h1 className="text-[18px] md:text-[40px]">{t(`banner.fiber_title`)}</h1>
        <h3 className="text-[12px] md:text-[18px]">{t(`banner.fiber_subtitle`)}</h3>
        <div className={styles.links}>
          <Link
            href="https://www.ckbfiber.net/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <PixelBorderBlock
              className="group"
              contentClassName="py-0.5 px-2.5 flex flex-row items-center gap-2 text-[#fff] group-hover:text-primary text-[12px] md:text-[14px]"
              apperanceClassName="*:data-[slot=border]:bg-[#D9D9D9] *:group-hover:data-[slot=border]:bg-primary"
            >
              <span>{t(`banner.learn_more`)}</span>
              <OutlinkIcon className="group-hover:text-primary" />
            </PixelBorderBlock>
          </Link>
        </div>
      </div>
    </div>
  )
}
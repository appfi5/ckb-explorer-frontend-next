import classNames from "classnames"
import Card from "."
import styles from './HashCardHeader.module.scss';
import CopyButton from "../CopyButton";
import TextEllipsis from "../TextEllipsis";
import { useMemo, type PropsWithChildren, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import BlockIcon from "@/assets/icons/block.svg?component"
import TransactionIcon from '@/assets/icons/transaction.svg?component'

type HashCardHeaderProps = PropsWithChildren<{
  className?: string;
  hash: string
  type: "block" | "transaction" | "address" | "script",
  actions?: ReactNode[]
}>
export default function HashCardHeader(props: HashCardHeaderProps) {
  const { className, type, hash, actions, children } = props;
  // const setToast = useSetToast()
  const { t } = useTranslation()


  const title = useMemo(() => {
    switch (type) {
      case "block":
        return t("block.block")
      case "transaction":
        return t("transaction.transaction")
      case "address":
        return t("address.address")
      case "script":
        return "Script"
      default:
        return "Unknown"
    }
  }, [t, type])

  return (
    <Card className={classNames("flex flex-col mt-5 p-3 sm:p-6 z-1", styles.card, className)}>
      <div className="flex flex-row items-center gap-3">
        {
          type === "script"
            ? null
            : type === "block"
              ? <BlockIcon className="flex-none dark:text-white w-[20px] h-[30px] md:w-[26px]" />
              : <TransactionIcon className="flex-none dark:text-white w-[20px] md:w-[26px]" />
        }
        <span className="flex-none font-medium text-base md:text-xl">
          {title}
        </span>
        <div className="flex-1 flex flex-row min-w-0 items-center gap-1 sm:gap-3">
          <span className="font-hash text-sm md:text-lg min-w-0 overflow-hidden pl-1 md:pl-3">
            <TextEllipsis
              text={hash}
              ellipsis={{ tail: -8 }}
              showTooltip={false}
            />
          </span>
          <div className="flex flex-row items-center">
            {type !== "script" && <CopyButton text={hash} />}
            {actions}
          </div>
        </div>

      </div>
      {children}
    </Card>
  )
}
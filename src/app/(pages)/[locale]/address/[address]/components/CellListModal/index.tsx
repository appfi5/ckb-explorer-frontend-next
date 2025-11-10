import type { PropsWithChildren, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import CloseIcon from "@/assets/icons/close.svg?component";
import TooltipMoreIcon from "@/assets/icons/tooltip.more.svg?component";
import Tooltip from "@/components/Tooltip";
import LiveCells, { type LiveCellsProps } from "../LiveCells";
import { useTranslation } from "react-i18next";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

function DefaultModalTrigger() {
  const { t } = useTranslation();
  return (
    <Tooltip
      trigger={
        <div className="flex items-center justify-center size-[20px] rounded-[4px] bg-white dark:bg-[#ffffff1a] border-[#ddd] dark:border-[transparent] border-[1px] hover:text-primary hover:border-(--color-primary) cursor-pointer ">
          <TooltipMoreIcon />
        </div>
      }
    >
      {t("address.check_cells")}
    </Tooltip>
  )
}

type CellListModalProps = {
  address: string,
  trigger?: ReactNode;
  cellRange: LiveCellsProps['cellRange'];
}
export default function CellListModal({ address, trigger, cellRange }: CellListModalProps) {
  const { t } = useTranslation();
  return (
    <Dialog>
      <DialogTrigger asChild={false} className="flex">
        {trigger || <DefaultModalTrigger />}
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="p-4 md:max-w-[960px] md:py-5"
      >
        <VisuallyHidden>
          <DialogTitle>{typeof cellRange === "object" ? cellRange.name : cellRange} {t("address.cell_list")}</DialogTitle>
        </VisuallyHidden>
        <DialogClose
          data-slot="dialog-close"
          className="absolute top-6 right-4 ml-auto cursor-pointer outline-0"
          aria-label="Close"
          title="Close"
        >
          <div className="border border-[#ddd] p-[5px] rounded-[4px] hover:text-primary hover:border-(--color-primary)">
            <CloseIcon width={10} height={10} />
          </div>
          <span className="sr-only">Close</span>
        </DialogClose>
        <div className="font-medium text-black dark:text-white text-lg md:text-[20px] leading-[28px]">
          {typeof cellRange === "object" ? cellRange.name : cellRange} {t("address.cell_list")}
        </div>
        <LiveCells
          cellRange={cellRange}
          address={address}
          listContainerClassName="mx-[-16px] px-4"
        />
      </DialogContent>
    </Dialog>
  );
};


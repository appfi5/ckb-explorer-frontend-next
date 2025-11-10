import type { PropsWithChildren } from "react";
import CellInfo from "../CellInfo";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from "../../ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import CloseIcon from "@/assets/icons/close.svg?component";
import { useTranslation } from "react-i18next";

const CellModal = ({ cell, children }: PropsWithChildren<{ cell: { id: APIExplorer.CellOutputResponse['id'] } }>) => {
  const { t } = useTranslation("cell");
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="p-3 sm:p-4 md:max-w-[960px] md:py-5"
        aria-description="cell info"
      >
        <VisuallyHidden>
          <DialogTitle>{t("modal-title")}</DialogTitle>
        </VisuallyHidden>
        <CellInfo
          cellId={cell.id}
          suffix={
            <DialogClose
              data-slot="dialog-close"
              className="ml-auto cursor-pointer outline-0"
              aria-label="Close"
              title="Close"
            >
              <div className="border border-[#ddd] p-[5px] rounded-[4px] hover:text-primary hover:border-(--color-primary)">
                <CloseIcon width={10} height={10} />
              </div>
              <span className="sr-only">Close</span>
            </DialogClose>
          }
        />
      </DialogContent>
    </Dialog>
  );
};

export default CellModal;

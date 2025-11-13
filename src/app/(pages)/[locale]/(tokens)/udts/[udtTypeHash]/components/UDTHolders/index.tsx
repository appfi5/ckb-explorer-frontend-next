
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import CloseIcon from "@/assets/icons/close.svg?component";
import { useTranslation } from "react-i18next";
import TooltipMoreIcon from "@/assets/icons/tooltip.more.svg?component";
import { useQuery } from "@tanstack/react-query";
import { localeNumberString } from "@/utils/number";
import TextEllipsis from "@/components/TextEllipsis";
import server from "@/server";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import Tooltip from "@/components/Tooltip";
import { DialogTitle } from "@radix-ui/react-dialog";
export default function UDTHolders({ udtInfo }: { udtInfo: APIExplorer.UdtDetailResponse & { typeScriptHash: string } }) {
  const { data: holderCategoryList, isLoading } = useQuery({
    queryKey: ['udt-holder-list', udtInfo.typeScriptHash],
    queryFn: async () => {
      const list = await server.explorer("GET /udts/{typeScriptHash}/holder_allocation", { typeScriptHash: udtInfo.typeScriptHash });
      if (!!list?.length) {
        list.sort((a, b) => Number(b.holderCount) - Number(a.holderCount));
      }
      return list
    }
  });


  if (isLoading) return null;
  if (!holderCategoryList?.length) return '-';

  return (
    <UDTHoldersInner holderCategoryList={holderCategoryList} udtInfo={udtInfo} />
  )
}


function UDTHoldersInner({ holderCategoryList, udtInfo }: { udtInfo: APIExplorer.UdtDetailResponse, holderCategoryList: APIExplorer.UdtHolderAllocationsResponse[] }) {
  const btcHoldersCount = 0; // +(holderInfo.btcHolderCount ?? 0);
  const ckbHoldersCount = holderCategoryList.reduce((acc, cur) => acc + +cur.holderCount, 0) ?? 0
  const { t } = useTranslation();
  return (
    <div className="flex flex-row gap-2">
      <span className="font-hash">{localeNumberString(udtInfo.holdersCount)}</span>
      <Dialog>
        <DialogTrigger>
          <Tooltip
            trigger={
              <div className="flex items-center justify-center size-[20px] rounded-[4px] bg-white dark:bg-[#ffffff1a] border-[#ddd] dark:border-[transparent] border-[1px] hover:text-primary hover:border-(--color-primary) cursor-pointer ">
                <TooltipMoreIcon />
              </div>
            }
          >
            {t('xudt.holder_distribution')}
          </Tooltip>
        </DialogTrigger>
        <DialogContent
          showCloseButton={false}
          className="relative p-4 w-[640px] md:py-5 dark:border dark:border-[#4C4C4C]"
        >
          <VisuallyHidden>
            <DialogTitle>{t('xudt.holder_distribution')}</DialogTitle>
          </VisuallyHidden>
          <DialogClose
            data-slot="dialog-close"
            className="absolute cursor-pointer outline-0 right-5 top-6"
            aria-label="Close"
            title="Close"
          >
            <div className="border border-[#ddd] p-[5px] rounded-[4px] hover:text-primary hover:border-(--color-primary)">
              <CloseIcon width={10} height={10} />
            </div>
            <span className="sr-only">Close</span>
          </DialogClose>
          <ModalContent
            ckbLockHashes={holderCategoryList}
            btcHoldersCount={btcHoldersCount}
            ckbHoldersCount={ckbHoldersCount}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ModalContent({ ckbHoldersCount, btcHoldersCount, ckbLockHashes }: {
  ckbHoldersCount: string | number
  btcHoldersCount: string | number
  ckbLockHashes?: APIExplorer.UdtHolderAllocationsResponse[]
}) {
  const { t } = useTranslation();

  return (
    <>
      <div className="text-xl font-medium">{t('xudt.holder_distribution')}</div>
      <div>
        {t('xudt.holder_distribution_description', {
          ckb: localeNumberString(ckbHoldersCount),
          btc: localeNumberString(btcHoldersCount),
        })}
      </div>
      <div className="max-h-[50vh] overflow-y-auto">
        <div className="border border-[#eee] dark:border-[#4c4c4c] rounded-[8px] w-auto md:w-[420px]  m-auto">
          <div className="rounded-t-[8px] bg-[#F5F9FB] dark:bg-[#363839] flex flex-row items-center justify-between p-3">
            <span className="font-medium">{t("xudt.lock_hash")}</span>
            <span className="font-medium">{t("xudt.count")}</span>
          </div>
          {
            !!btcHoldersCount && (
              <div className="flex flex-row items-center justify-between p-3">
                <span className="font-medium">BTC</span>
                <span className="font-hash">{btcHoldersCount}</span>
              </div>
            )
          }
          {
            ckbLockHashes?.map(lockInfo => (
              <div className="flex flex-row items-center justify-between p-3 border-t border-[#eee]">
                <span className="flex-1 font-medium break-all gap-1">
                  {
                    lockInfo.name || (
                      <TextEllipsis
                        text={lockInfo.lockCodeHash}
                        ellipsis="address"
                      />
                    )
                  }
                </span>
                <span className="flex-none min-w-[5em] text-right font-hash">{lockInfo.holderCount}</span>
              </div>
            ))
          }
        </div>
      </div>
    </>
  )
}
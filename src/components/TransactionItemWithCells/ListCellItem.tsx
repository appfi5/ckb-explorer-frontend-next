import { IOType } from "@/constants/common";
import Tooltip from "../Tooltip";
import Link from "next/link";
import LeftArrow from '@/assets/icons/leftArrow.svg?component';
import { useTranslation, Trans } from "react-i18next";
import TextEllipsis from "../TextEllipsis";
import OutLink from "../OutLink";
import { localeNumberString } from "@/utils/number";
import HelpIcon from "@/assets/icons/help.svg?component";
import styles from './index.module.scss';
import { CellStatus } from "../Cell/CellStatus";
import RelateTxOutputIcon from '@/assets/icons/relate-tx.output.svg?component';
import RelateTxCellConsumedIcon from '@/assets/icons/relate-tx.cell-consumed.svg?component';
import TwoSizeAmount from "../TwoSizeAmount";
import { shannonToCkb } from "@/utils/util";
import CellModal from "../Cell/CellModal";
import InfoIcon from '@/assets/icons/info.svg?component';
import Tips from "../Tips";
import ScriptTag from "../ScriptTag";
import { addressToScript } from "@nervosnetwork/ckb-sdk-utils";
import { cn } from "@/lib/utils";

type ListCellItemProps = {
  currentAddress?: string;
  ioType: IOType;
  cell: APIExplorer.CellInputResponse | APIExplorer.CellOutputResponse;
}
export default function ListCellItem(props: ListCellItemProps) {
  const { cell, ioType, currentAddress } = props;
  const { t } = useTranslation();

  if ((cell as APIExplorer.CellInputResponse).fromCellbase) {
    return <Cellbase cell={cell} />;
  }
  let addressText = t("address.unable_decode_address");
  let highLight = false;
  if (cell.addressHash) {
    addressText = cell.addressHash;
  }
  highLight = addressText !== currentAddress;
  let lockScript: CKBComponents.Script | undefined;
  try {
    lockScript = addressToScript(cell.addressHash);
  } catch { }

  return (
    <div className="@container bg-[#d9d9d91a] dark:bg-[#363839] min-h-[20px] p-3 rounded-xs">
      <div className="flex flex-col @5xl:flex-row @5xl:py-2.5 gap-y-2 gap-x-2">
        <div className="flex flex-row gap-x-2 items-center">
          {ioType === IOType.Input && (
            <Tooltip
              trigger={
                <Link className="flex size-[20px]" href={`/transaction/${cell.generatedTxHash}`}>
                  <LeftArrow width="100%" height="100%" />
                </Link>
              }
              placement="top">
              {`${t("transaction.related_transaction")}`}
            </Tooltip>
          )}
          {
            highLight ? (
              <OutLink
                className="flex grow-0 shrink-1 min-w-0 truncate"
                href={`/address/${cell.addressHash}`}
              >
                <TextEllipsis
                  className="max-w-125 min-w-0 text-sm underline"
                  text={addressText}
                  ellipsis={{ tail: -8 }}
                />
              </OutLink>
            ) : (
              <div className="flex flex-row items-center gap-2">
                <TextEllipsis
                  className="text-sm"
                  text={addressText}
                  ellipsis={{ head: 4, tail: -8 }}
                />
              </div>
            )
          }
          {
            ioType === IOType.Output && (
              <>
                {cell.status === CellStatus.LIVE && (
                  <div className="flex-none flex items-center justify-center gap-[8px] size-[20px]">
                    <Tooltip trigger={<RelateTxCellConsumedIcon width="100%" height="100%" />} placement="top">{`${t("transaction.unspent_output")}`}</Tooltip>
                  </div>
                )}
                {cell.status === CellStatus.COMSUMED && (
                  <div className="flex-none flex items-center justify-center gap-[8px]">
                    <Tooltip
                      trigger={
                        <Link className="flex size-[20px]" href={`/transaction/${cell.consumedTxHash}`}>
                          <RelateTxOutputIcon width="100%" height="100%" />
                        </Link>
                      }
                      placement="top"
                    >{`${t("transaction.related_transaction")}`}</Tooltip>
                  </div>
                )}
              </>
            )
          }
        </div>

        <div className="flex-1 flex flex-col @xl:flex-row @xl:justify-between @xl:items-center gap-y-2">
          <div className={cn(
            "flex flex-row gap-2 min-w-50",
            "empty:hidden @xl:empty:block pb-2 @xl:pb-0 border-b @xl:border-none border-dashed border-b-[#d9d9d9]"
          )}>
            <ScriptTag category="lock" short withTag={false} script={lockScript} className="h-[20px]!" />
            <ScriptTag category="type" short withTag={false} script={cell.typeScript} className="h-[20px]!" />
          </div>
          <div className="flex flex-row items-center justify-end gap-2">
            <TwoSizeAmount
              className="leading-[20px]"
              integerClassName="text-sm"
              decimalClassName="text-xs"
              amount={shannonToCkb(cell.capacity)}
              format={[8]}
              unit={<span className="ml-2! text-[#999] text-sm">CKB</span>}
            />
            <Tooltip
              asChild={false}
              trigger={
                <CellModal cell={cell}>
                  <div className="flex size-[20px]">
                    <InfoIcon width="100%" height="100%" className={styles.infoIcon} />
                  </div>
                </CellModal>
              }
              placement="top"
            >
              {`${t("transaction.cell-info")} `}
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  )
}



function Cellbase({ cell }: { cell: APIExplorer.CellInputResponse }) {
  const { t } = useTranslation();
  if (!cell.targetBlockNumber || cell.targetBlockNumber <= 0) {
    return (
      //  className={styles.cellbasePanel}
      <div className="flex flex-row h-16 justify-between px-3 items-center bg-[#d9d9d91a] dark:bg-[#363839] rounded-[2px]">
        <div className="cellbaseContent">Cellbase</div>
      </div>
    );
  }

  const tooltipContent = (
    <Trans
      i18nKey="glossary.cellbase_for_block"
      components={{
        // -eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
        link1: (
          <a
            href="https://docs.nervos.org/docs/basics/concepts/consensus/"
            target="_blank"
            rel="noreferrer"
          />
        ),
      }}
    />
  );

  return (
    <div className="flex flex-row h-16 justify-between px-3 items-center bg-[#d9d9d91a] dark:bg-[#363839] rounded-[2px]">
      <div className="flex align-center justify-center gap-2">
        <div className="cellbaseContent">Cellbase for Block</div>
        <Tips
          trigger={<HelpIcon className={styles.helpIcon} />}
          placement="top"
        >
          {tooltipContent}
        </Tips>
      </div>
      <div className="flex align-center justify-center gap-2">
        <OutLink href={`/block/${cell.targetBlockNumber}`} className="font-hash underline">
          {localeNumberString(cell.targetBlockNumber)}
        </OutLink>
      </div>
    </div>
  );
};

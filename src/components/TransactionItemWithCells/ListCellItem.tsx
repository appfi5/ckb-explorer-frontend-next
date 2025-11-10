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
import SandClockIcon from '@/assets/icons/sandClock.svg?component';
import { CellStatus } from "../Cell/CellStatus";
import RelateTxOutputIcon from '@/assets/icons/relate-tx.output.svg?component';
import TwoSizeAmount from "../TwoSizeAmount";
import { shannonToCkb } from "@/utils/util";
import CellModal from "../Cell/CellModal";
import InfoIcon from '@/assets/icons/info.svg?component';
import Tips from "../Tips";
import ScriptTag from "../ScriptTag";
import { addressToScript } from "@nervosnetwork/ckb-sdk-utils";

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
    <div className="flex flex-row flex-wrap items-center gap-1 justify-between p-3 min-h-16 bg-[#d9d9d91a] dark:bg-[#363839]">
      <div className="flex flex-row flex-wrap items-center gap-2">
        {ioType === IOType.Input && (
          <>
            <Tooltip
              trigger={
                <Link href={`/transaction/${cell.generatedTxHash}`}>
                  <LeftArrow />
                </Link>
              }
              placement="top">
              {`${t("transaction.related_transaction")}`}
            </Tooltip>
          </>
        )}
        {
          highLight ? (
            <OutLink href={`/address/${cell.addressHash}`} className="underline">
              <TextEllipsis
                text={addressText}
                ellipsis="address"
              />
            </OutLink>
          ) : (
            <div className="flex flex-row items-center gap-2">
              <TextEllipsis
                text={addressText}
                ellipsis="address"
              />
              {/* <Tooltip
                        trigger={
                          <div className="flex items-center justify-center size-[20px] border border-[#ddd] p-[2px] bg-white rounded-sm">
                            <HomeIcon />
                          </div>
                        }
                        placement="top"
                      >
                        {`${t("address.current-address")} `}
                      </Tooltip> */}
            </div>
          )
        }
        {
          ioType === IOType.Output && (
            <>
              {cell.status === CellStatus.LIVE && (
                <div className="flex items-center justify-center gap-[8px]">
                  <Tooltip trigger={<SandClockIcon />} placement="top">{`${t("transaction.unspent_output")}`}</Tooltip>
                  {/* <div className="bg-[#FFB0411A] text-[#FFB041] text-[12px] font-medium leading-[20px] py-[2px] px-[4px] border rounded-[2px]">Live Cell</div> */}
                </div>
              )}
              {cell.status === CellStatus.COMSUMED && (
                <div className="flex items-center justify-center gap-[8px]">
                  <Tooltip
                    trigger={
                      <Link href={`/transaction/${cell.consumedTxHash}`}>
                        <RelateTxOutputIcon />
                      </Link>
                    }
                    placement="top"
                  >{`${t("transaction.related_transaction")}`}</Tooltip>
                  {/* <div className="bg-[#FFB0411A] text-[#FFB041] text-[12px] font-medium leading-[20px] py-[2px] px-[4px] border rounded-[2px]">Live Cell</div> */}
                </div>
              )}
            </>
          )
        }
        <div className="flex flex-row gap-2 min-w-50">
          <ScriptTag category="lock" short withTag={false} script={lockScript} className="h-[20px]!" />
          <ScriptTag category="type" short withTag={false} script={cell.typeScript} className="h-[20px]!" />
        </div>


        {/* {
          !!decodedCellType && (
            <div>{decodedCellType.toUpperCase()}</div>
          )
        } */}
      </div>
      <div className="flex flex-row items-center gap-2">
        {/* <TransactionCellCapacity cell={cell} ioType={ioType} /> */}
        <TwoSizeAmount
          integerClassName="font-menlo"
          decimalClassName="font-menlo text-[12px]"
          amount={shannonToCkb(cell.capacity)}
          format={[8]}
          unit={<span className="ml-2! text-[#999]">CKB</span>}
        />
        <Tooltip
          asChild={false}
          trigger={
            <CellModal cell={cell}>
              {/* <InfoIcon className="infoIcon cursor-pointer" /> */}
              <InfoIcon className={styles.infoIcon} />
            </CellModal>
          }
          placement="top"
        >
          {`${t("transaction.cell-info")} `}
        </Tooltip>
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
        <OutLink href={`/block/${cell.targetBlockNumber}`} className="underline">
          {localeNumberString(cell.targetBlockNumber)}
        </OutLink>
      </div>
    </div>
  );
};

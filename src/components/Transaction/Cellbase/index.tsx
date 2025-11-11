import { Trans } from "react-i18next";
import { localeNumberString } from "@/utils/number";
import HelpIcon from "@/assets/icons/help.svg?component";
import styles from "./index.module.scss";
import type { Cell } from "@/models/Cell";
import Tooltip from "../../Tooltip";
import { useTranslation } from "react-i18next";
import OutLink from "@/components/OutLink";

const Cellbase = ({
  cell,
  isDetail,
}: {
  cell: Partial<
    Pick<Cell, "generatedTxHash" | "cellIndex" | "targetBlockNumber">
  >;
  isDetail?: boolean;
}) => {
  const { t } = useTranslation();
  if (!cell.targetBlockNumber || cell.targetBlockNumber <= 0) {
    return (
      <div className={styles.cellbasePanel}>
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
    <div className={`${styles.cellbasePanel} ${isDetail && styles.isDetail}`}>
      <div className="flex align-center justify-center gap-[8px]">
        {/* <Tooltip trigger={<LeftArrow />} placement="top">{`${t("transaction.related_transaction")}`}</Tooltip> */}
        <div className="cellbaseContent">Cellbase for Block</div>
        <Tooltip
          trigger={
            <HelpIcon className={styles.helpIcon} />
          }
          contentClassName={styles.tooltip}
          placement="top"
        >
          {tooltipContent}
        </Tooltip>
      </div>
      <div className="flex align-center justify-center gap-[8px]">
        <OutLink href={`/block/${cell.targetBlockNumber}`} className="font-hash underline">
          {localeNumberString(cell.targetBlockNumber)}
        </OutLink>
      </div>
    </div>
  );
};

export default Cellbase;

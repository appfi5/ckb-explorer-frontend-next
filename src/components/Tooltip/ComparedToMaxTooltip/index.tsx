import type { ReactNode } from "react";
import styles from "./styles.module.scss";
import { localeNumberString } from "@/utils/number";
import TooltipMoreIcon from "@/assets/icons/tooltip.more.svg?component";
import { isNil } from "lodash";
import Tips from "@/components/Tips";

const ComparedToMaxTooltip: any = ({
  numerator,
  maxInEpoch,
  maxInChain,
  titleInEpoch,
  titleInChain,
  children,
  unit,
}: {
  numerator: number | null;
  maxInEpoch: number | null;
  maxInChain: number | null;
  titleInEpoch: string;
  titleInChain: string;
  children?: ReactNode;
  unit?: string;
}) => {
  const percentOfMaxInEpoch =
    numerator && maxInEpoch
      ? Math.round((10000 * numerator) / maxInEpoch) / 100
      : 0;
  const percentOfMaxInChain =
    numerator && maxInChain
      ? Math.round((10000 * numerator) / maxInChain) / 100
      : 0;
  if (isNil(maxInEpoch) && isNil(maxInChain)) {
    return null;
  }
  return (
    <Tips
      placement="top"
      contentClassName={`${styles.comparedSizeTooltip}`}
      trigger={
        <div className="ml-[8px] flex items-center justify-center size-[20px] rounded-[4px] bg-white dark:bg-[#ffffff1a] border-[#ddd] dark:border-[transparent] border-[1px] hover:text-primary hover:border-(--color-primary) cursor-pointer ">
          <TooltipMoreIcon />
        </div>
      }
    >
      <>
        {maxInEpoch ? (
          <div className={styles.inEpoch}>
            <div>{titleInEpoch}</div>
            <div className="flex justify-between text-[12px] leading-[20px]">
              <div>
                <span className="font-menlo text-primary">{localeNumberString(maxInEpoch)}</span>
                {unit ? <span className="text-primary"> {unit}</span> : ""}
              </div>

              <span className="text-[#999]">({percentOfMaxInEpoch}%)</span>
            </div>
            <div
              className="mt-[4px]"
              style={{ backgroundColor: "rgba(255, 255,255, 0.3)", height: 8, borderRadius: 4 }}
            >
              <div
                className="bg-primary rounded-[4px] h-[8px]"
                style={{
                  width: `${Math.max(percentOfMaxInEpoch, 2)}%`,
                }}
              />
            </div>
          </div>
        ) : null}
        {maxInChain ? (
          <div className={styles.inChain}>
            <div>{titleInChain}</div>
            <div className="flex justify-between text-[12px] leading-[20px]">
              <div>
                <span className="font-menlo text-primary">{localeNumberString(maxInChain)}</span>
                {unit ? <span className="text-primary"> {unit}</span> : ""}
              </div>
              <span className="text-[#999]">({percentOfMaxInChain}%)</span>
            </div>
            <div
              className="mt-[4px]"
              style={{ backgroundColor: "rgba(255, 255,255, 0.3)", height: 8, borderRadius: 4 }}
            >
              <div
                className="bg-primary rounded-[4px] h-[8px]"
                style={{
                  width: `${Math.max(percentOfMaxInChain, 2)}%`,
                }}
              />
            </div>
          </div>
        ) : null}
        {children ? <hr /> : ""}
        {children}
      </>
    </Tips>
  );
};

export default ComparedToMaxTooltip;
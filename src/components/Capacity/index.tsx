import BigNumber from "bignumber.js";
import { useMemo } from "react";
import styles from "./Capacity.module.scss";
import TwoSizeAmount from "../TwoSizeAmount";

interface CapacityProps {
  capacity: string;
  type?: "value" | "diff";
  layout?: "responsive" | "fixed";
  unit?: "CKB" | string | null;
  display?: "full" | "short";
  textDirection?: 'left' | 'right' | 'center';
  unitClassName?: string;
  contentClassName?: string;
  integerClassName?: string;
}

const Capacity: React.FC<CapacityProps> = ({
  capacity,
  type = "value",
  layout = "fixed",
  unit = "CKB",
  display = "full",
  textDirection = 'center',
  unitClassName,
  contentClassName,
  integerClassName,
}) => {
  const [int, dec, diffStatus] = useMemo(() => {
    const c = new BigNumber(capacity);
    const [int, dec] = c
      .toFormat(display === "full" ? 8 : undefined)
      .split(".");
    if (type !== "diff" || c.isZero()) return [int, dec];
    if (c.isPositive()) return [int, dec, "positive"];
    return [int, dec, "negative"];
  }, [capacity, display, type]);

  const textAlignClass = {
    left: 'text-left justify-start',
    right: 'text-right justify-end',
    center: 'text-center justify-center',
  }[textDirection] || 'text-center justify-center';

  return (
    <div
      className={`${styles.container} w-full ${textAlignClass} ${contentClassName}`}
      data-type={type}
      data-diff-status={diffStatus}
      data-layout={layout}
    >
      {/* <div>
        <span data-role="int" className="text-[#232323] dark:text-white">{int}</span>
        {dec ? (
          <span data-role="dec" className="dark:text-white! font-menlo">
            {`.${dec}`}
          </span>
        ) : null}
      </div>
      {unit && <span className={`${styles.unit} ${unitClassName}`}>{unit}</span>} */}
      <TwoSizeAmount
        format={display === "full" ? [8] : undefined}
        integerClassName={`${integerClassName} font-menlo`}
        decimalClassName="font-menlo text-[12px]"
        amount={capacity}
        unit={unit && <span className={`${styles.unit} ${unitClassName}`}>{unit}</span>}
      />
    </div>
  );
};

export default Capacity;

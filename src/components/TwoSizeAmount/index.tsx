import BigNumber from "bignumber.js"
import classNames from "classnames"
import { useMemo, type CSSProperties, type ReactNode } from "react"

type TwoSizeAmountProps = {
  className?: string
  style?: CSSProperties
  amount: string | number
  unit?: ReactNode
  integerClassName?: string
  decimalClassName?: string
  decimalPlaces?: number | undefined
  format?: [number] | [number, BigNumber.RoundingMode] | [number, BigNumber.RoundingMode, BigNumber.Format]
}

export default function TwoSizeAmount(props: TwoSizeAmountProps) {
  const { amount, unit, className, style, integerClassName, decimalClassName, format } = props
  // const [decimalPlaces, roundingMode, bigFormat] = format || [];
  const [int, dec] = useMemo(() => {
    const c = new BigNumber(amount);
    const [int, dec] = c
      .toFormat(...(format || [])) // display === "full" ? 8 : undefined)
      .split(".");
    return [int, dec];
  }, [amount])
  return (
    <div className={classNames(className)} style={style}>
      <span className={classNames("font-menlo",integerClassName)}>{int}{!!dec && "."}</span>
      <span className={classNames("font-menlo",decimalClassName)}>{dec}</span>
      {unit}
    </div>
  )
}
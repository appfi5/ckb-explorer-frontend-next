



import NoDataImg from "@/assets/icons/no-data.svg?component";
import classNames from "classnames";

type EmptyProps = {
  className?: string;
  message?: string;
  iconScale?: number;
};
export default function Empty({ iconScale = 1, className = "min-h-[40px] gap-2", message = "No Data" }: EmptyProps) {
  return (
    <div className={classNames("flex flex-col justify-center items-center", className)}>
      <NoDataImg width={64 * iconScale} height={47 * iconScale} className="text-[#999]" />
      <span className={classNames("text-[#909399] dark:text-[#999] leading-[1]", iconScale > 1 ? "text-lg" : "")}>{message}</span>
    </div>
  );
}
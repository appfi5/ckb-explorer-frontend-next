



import NoDataImg from "@/assets/icons/no-data.svg?component";
import classNames from "classnames";
import MediaQuery from "react-responsive";

export type EmptyProps = {
  className?: string;
  message?: string;
  iconScale?: number;
};
export default function Empty({ iconScale = 1, className = "min-h-[40px] gap-2", message = "No Data" }: EmptyProps) {
  return (
    <div className={classNames("flex flex-col justify-center items-center", className)}>
      <MediaQuery query="(max-width: 40rem)">
        {(isMobile) => {
          const fixScale = isMobile ? 0.8 : 1;
          return (
            <>
              <NoDataImg width={64 * iconScale * fixScale} height={47 * iconScale * fixScale} className="text-[#999]" />
              <span className={classNames("text-[#909399] dark:text-[#999] leading-[1]", iconScale > 1 ? "text-lg" : "")}>{message}</span>
            </>
          )
        }}
      </MediaQuery>

    </div>
  );
}
import { useState, useRef, useEffect } from "react";
import SimpleButton from "../SimpleButton";
import PixelBorderBlock from "@/components/PixelBorderBlock";
import SearchIcon from '@/assets/icons/search.svg?component';
import CloseIcon from "@/assets/icons/close.svg?component";
import { useTheme } from "@/components/Theme";
import classNames from "classnames";

type FilterProps = {
  defaultValue?: string;
  placeholder?: string;
  onFilter: (query: string) => void;
  onReset: () => void;
  className?: string;
}
export default function Filter(props: FilterProps) {
  const {
    defaultValue = "",
    placeholder,
    onFilter,
    onReset,
    className
  } = props;
  const [theme] = useTheme();
  const [filterValue, setFilterValue] = useState(defaultValue);
  const showClear = !!filterValue;
  const inputElement = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFilterValue(defaultValue);
  }, [defaultValue]);


  return (
    <div
      className={classNames("", className)} //  `${styles.filterPanel} ${className}`
    >
      <PixelBorderBlock
        pixelSize="2px"
        // hoverEffect={false}
        apperanceClassName="*:data-[slot=border]:bg-[#D9D9D9] *:dark:data-[slot=border]:bg-[#4c4c4c]"
        className="w-full h-[32px]"
        contentClassName="h-full flex items-center justify-left px-[9px] text-[14px] leading-[22px]"
        // backgroundColor="transparent"
        // borderColor={theme === "dark" ? "#4C4C4C" : "#F0F1F8"}
      >
        {/* {showReset && <ResetFilter />} */}
        <SearchIcon width={16} height={16} className="flex-none text-[#CCCCCC] dark:text-[#5B5B5B]" />
        <input
          className="flex-1 leading-[22px] h-full px-2 outline-0 placeholder:text-[#ccc] dark:placeholder:text-[#5B5B5B]"
          // className={
          //   `${styles.filterInputPanel} ${showReset ? styles.showReset : ""}`
          // }
          ref={inputElement}
          placeholder={placeholder}
          value={filterValue}
          onChange={(event) => setFilterValue(event.target.value)}
          onKeyUp={(event) => {
            if (event.keyCode === 13) {
              const query = filterValue.trim().replace(",", "");
              if (query !== "") {
                onFilter(query);
              } else {
                onReset();
              }
            }
          }}
        />
        {showClear && (
          <SimpleButton
            onClick={() => {
              setFilterValue("");
              if (defaultValue) onReset();
            }}
          >
            <div className="size-[14px] flex items-center justify-center rounded-full bg-[#ebebeb] dark:bg-[#fff3] hover:text-primary hover:bg-[rgb(from_var(--color-primary)_r_g_b_/_10%)] dark:hover:bg-[rgb(from_var(--color-primary)_r_g_b_/_20%)]">
              <CloseIcon width={6} height={6} />
            </div>
          </SimpleButton>
        )}
      </PixelBorderBlock>

    </div>
  );
};


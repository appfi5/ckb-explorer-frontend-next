
import ToTopIcon from "@/assets/icons/scroll-to-top.svg?component";
import classNames from "classnames";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { debounce, throttle } from "lodash";
import { useCallback, useEffect, useState } from "react";

type ToTopButtonProps = {
  className?: string;
  scrollTo?: number;
  threshold?: number;
};

export default function ToTopButton(props: ToTopButtonProps) {
  const { className, scrollTo = 0, threshold = 1000 } = props;
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  // throttle set scrolling to false
  const debounceStop = useCallback(debounce(function () {
    setIsScrolling(false);
  }, 500), []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setShow(latest > threshold);
    setIsScrolling(true);
    debounceStop()
  })
  return (
    <div className={classNames(
      "md:hidden! fixed h-11 w-15 overflow-hidden bottom-22 right-0",
      className
    )}
    >
      <div
        className={classNames("relative flex cursor-pointer items-center justify-center size-11 transition-[left] bg-white dark:bg-[#232323] rounded-full border border-[#d9d9d9] dark:border-[#999] shadow-[0_2px_8px_0_rgba(62,62,62,0.1)", {
          "left-11": isScrolling || !show,
          "left-0": !isScrolling && show
        })}
        onClick={() => window.scrollTo({ top: scrollTo, behavior: "smooth" })}
      >
        <ToTopIcon />
      </div>
    </div>
  )
}
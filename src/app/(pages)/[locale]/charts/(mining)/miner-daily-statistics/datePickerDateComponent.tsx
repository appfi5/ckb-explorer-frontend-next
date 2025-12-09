"use client";

import { useState, useRef, useEffect,useCallback } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import dayjs from "dayjs";
import styles from "./minerDailyStatistics.module.scss"
import PixelBorderBlock from "@/components/PixelBorderBlock";
import { useTranslation } from "react-i18next";
import { enAU, zhCN } from "react-day-picker/locale";
import CalendarIcon from '@/assets/icons/calendar.svg?component'

interface timeRangeProps {
  startTime: Date;
  endTime: Date;
}

const DatePickerDateComponent = ({ timeRange, setSelectedDate, selectedDate }: { timeRange: timeRangeProps, setSelectedDate: (date: Date | undefined) => void, selectedDate: Date | undefined }) => {
  const { t, i18n } = useTranslation();
  const IsZhCN = i18n.language === "zh";
  const startTimestamp = Number(timeRange.startTime) * 1000;
  const startDate = new Date(startTimestamp);
  const newStartDate = startDate.setDate(startDate.getDate() - 1);
  const endTimestamp = Number(timeRange.endTime) * 1000;

  const isStartValid = !!startTimestamp && !isNaN(startTimestamp);
  const isEndValid = !!endTimestamp && !isNaN(endTimestamp);

  const [isOpen, setIsOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const formattedDate = selectedDate
    ? dayjs(selectedDate).format("YYYY-MM-DD")
    : "请选择日期";


  const disabledDate = (date: Date) => {
    if (isStartValid && isEndValid) {
      return date < new Date(newStartDate) || date > new Date(endTimestamp);
    }

    return false;
  };

  useEffect(() => {
    if(!!endTimestamp){
      setSelectedDate(new Date(endTimestamp));
    }
  }, [endTimestamp,setSelectedDate]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`${styles.dateContainer} relative`} ref={calendarRef}>
      <div className={`${styles.chartDetailTitleBtn}`}>
        <PixelBorderBlock
          pixelSize="2px"
          apperanceClassName="*:data-[slot=border]:bg-[#D9D9D9] *:dark:data-[slot=border]:bg-[#4C4C4C] *:dark:data-[slot=bg]:bg-[#303030] hover:*:data-[slot=bg]:bg-[#ffffff14]"
          className="cursor-pointer w-full h-[32px]!"
          contentClassName="h-full flex items-center justify-left px-[9px] text-[14px] leading-[22px]"
        >
          <div className="w-full flex justify-between items-center text-[#232323] dark:text-[#999999]" onClick={() => setIsOpen(!isOpen)}>
            {formattedDate}
            <CalendarIcon className={styles.icons} />
          </div>
        </PixelBorderBlock>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 rounded-lg backdrop-blur-[50px] shadow-[0_0_12px_2px_rgba(0,0,0,0.08)] dark:shadow-[0_0_12px_2px_#00000040] bg-white dark:bg-[#303030] p-4 z-10">
          <DayPicker
            mode="single"
            locale={IsZhCN ? zhCN : enAU}
            disabled={disabledDate}
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setIsOpen(false);
            }}
            captionLayout="dropdown"
            defaultMonth={isEndValid ? new Date(endTimestamp) : new Date()}
            {...(isStartValid ? { startMonth: new Date(startTimestamp) } : {})}
            {...(isEndValid ? { endMonth: new Date(endTimestamp) } : {})}

          />
        </div>
      )}
    </div>
  );
};

export default DatePickerDateComponent;
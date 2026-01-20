"use client";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import dayjs from "dayjs";
import styles from "./index.module.scss";
import PixelBorderBlock from "@/components/PixelBorderBlock";
import { useTranslation } from "react-i18next";
import CalendarIcon from '@/assets/icons/calendar.svg?component';
import LeftArrowIcon from "./left.svg?component";
import RightArrowIcon from "./right.svg?component";
import Tooltip from "@/components/Tooltip";

export interface MonthPickerProps {
    selectedMonth: Date | undefined;
    onSelect: (month: Date) => void;
    disabledDate?: Date | string;
}
const MonthPickerComponent = ({
    selectedMonth,
    onSelect,
    disabledDate
}: MonthPickerProps) => {
    const startYear = 2019;
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);
    const monthNames = useMemo(() => t('date_info.months', { returnObjects: true }), [t]);
    const currentDateInfo = useMemo(() => {
        const now = new Date();
        return {
            fullYear: now.getFullYear(),
            month: now.getMonth(),
        };
    }, []);
    const { fullYear: currentFullYear, month: currentMonth } = currentDateInfo;
    const [currentYear, setCurrentYear] = useState(selectedMonth?.getFullYear() || currentFullYear);
    const years = useMemo(() =>
        Array.from({ length: currentFullYear - startYear + 1 }, (_, i) => startYear + i),
        [currentFullYear, startYear]
    );

    const formattedMonth = useMemo(() => {
        if (!selectedMonth) return t("date_info.months_placeholder");
        const validDate = dayjs(selectedMonth).isValid() ? selectedMonth : new Date();
        return dayjs(validDate).format("YYYY-MM");
    }, [selectedMonth, t]);

    const disabledDateObj = useMemo(() => {
        if (!disabledDate) return null;
        const dateObj = new Date(disabledDate);

        return isNaN(dateObj.getTime()) ? null : dateObj;
    }, [disabledDate]);

    const isDateDisabled = useCallback((year: number, month: number) => {
        if (year > currentFullYear || (year === currentFullYear && month > currentMonth)) {
            return true;
        }
        if (!disabledDateObj) return false;
        const disabledYear = disabledDateObj.getFullYear();
        const disabledMonth = disabledDateObj.getMonth();
        return year < disabledYear || (year === disabledYear && month < disabledMonth);
    }, [currentFullYear, currentMonth, disabledDateObj]);

    const isLeftArrowDisabled = useMemo(() => {
        if (!disabledDateObj) return currentYear <= startYear;
        const disabledYear = disabledDateObj.getFullYear();
        return currentYear <= Math.max(startYear, disabledYear);
    }, [currentYear, startYear, disabledDateObj]);

    const isRightArrowDisabled = useMemo(() => {
        return currentYear >= currentFullYear;
    }, [currentYear, currentFullYear]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={pickerRef}>
            <div className={`${styles.chartDetailTitleBtn}`}>
                <PixelBorderBlock
                    pixelSize="2px"
                    apperanceClassName="*:data-[slot=border]:bg-[#D9D9D9] *:dark:data-[slot=border]:bg-[#4C4C4C] *:dark:data-[slot=bg]:bg-[#303030] hover:*:data-[slot=bg]:bg-[#ffffff14]"
                    className="cursor-pointer w-full h-[32px]!"
                    contentClassName="h-full flex items-center justify-left px-[9px] text-[14px] leading-[22px]"
                >
                    <div
                        className="w-full flex justify-between items-center text-[#232323] dark:text-[#999999]"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {formattedMonth}
                        <CalendarIcon className={styles.icons} />
                    </div>
                </PixelBorderBlock>
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-2 rounded-lg backdrop-blur-[50px] shadow-[0_0_12px_2px_rgba(0,0,0,0.08)] dark:shadow-[0_0_12px_2px_#00000040] bg-white dark:bg-[#303030] p-2 z-10 select-none" onDoubleClick={(e) => e.preventDefault()}>
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#D9D9D9] dark:border-[#4C4C4C]">
                        <Tooltip
                            trigger={
                                <LeftArrowIcon
                                    className={styles.arrowicons}
                                    data-disabled={isLeftArrowDisabled}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (isLeftArrowDisabled) return;
                                        const minYear = disabledDateObj
                                            ? Math.max(startYear, disabledDateObj.getFullYear())
                                            : startYear;
                                        setCurrentYear(prev => Math.max(prev - 1, minYear));
                                    }}
                                />
                            }
                            placement="top"
                            disabled={!isLeftArrowDisabled}
                        >
                            {t("date_info.arrow_left_desc")}
                        </Tooltip>

                        <span className="mx-2 font-medium select-none">{currentYear}</span>

                        <Tooltip
                            trigger={
                                <RightArrowIcon
                                    className={styles.arrowicons}
                                    data-disabled={currentYear >= currentFullYear}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (isRightArrowDisabled) return;
                                        setCurrentYear(prev => Math.min(prev + 1, currentFullYear));
                                    }}
                                />
                            }
                            placement="top"
                            disabled={!isRightArrowDisabled}
                        >
                            {t("date_info.arrow_right_desc")}
                        </Tooltip>

                    </div>

                    <div className="w-[270px] grid grid-cols-3 gap-2">
                        {monthNames.map((month, index) => {
                            const isSelected = selectedMonth
                                && selectedMonth.getFullYear() === currentYear
                                && selectedMonth.getMonth() === index;

                            const isDisabled = isDateDisabled(currentYear, index);

                            return (
                                <button
                                    key={index}
                                    className={`select-none p-2 rounded-sm text-sm ${isSelected
                                        ? 'bg-[#D9D9D94D]'
                                        : isDisabled
                                            ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed hover:bg-transparent'
                                            : 'hover:bg-[#D9D9D94D] dark:hover:bg-gray-700'
                                        }`}
                                    onClick={() => {
                                        if (!isDisabled) {
                                            const selectedDate = new Date(Date.UTC(currentYear, index, 1));
                                            onSelect(selectedDate);
                                            setIsOpen(false);
                                        }
                                    }}
                                    disabled={isDisabled}
                                >
                                    {month}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MonthPickerComponent;
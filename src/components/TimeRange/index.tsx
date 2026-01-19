import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useIsMobile } from "@/hooks";

type TimeRangeOption = '15D' | '1M' | '6M' | '1Y' | 'ALL';

interface TimeRangeProps {
    setSelectedValue?: (value: number) => void;
}

const calculateDays = {
    '15D': 15,
    '1M': 30,
    '6M': 180,
    '1Y': 365,
    'ALL': 0,
}

export default function TimeRange({
    setSelectedValue,
}: TimeRangeProps) {
    const [currentRange, setCurrentRange] = useState<TimeRangeOption>('15D');
    const [t] = useTranslation();
    const isMobile = useIsMobile();
    const handleRangeChange = (range: TimeRangeOption) => {
        const days = calculateDays[range];
        setCurrentRange(range);
        setSelectedValue?.(days);
    };

    const timeRangeOptions: TimeRangeOption[] = ['15D', '1M', '6M', '1Y', 'ALL'];

    return (
        <div className="flex items-center gap-[12px]">
            {!isMobile && <span className="text-[#999999] dart:text-[#D9D9D9] text-xs">
                {t('date_info.time_range')}:
            </span>}
            <div className="flex gap-1.5 items-center h-[36px] px-1.5 rounded-sm bg-[#EDF2F2] dark:bg-[#232323E5]">
                {timeRangeOptions.map((range) => (
                    <button
                        key={range}
                        className={cn(
                            'outline-none px-2 py-1 text-xs font-medium rounded-xs transition-all duration-200 cursor-pointer bg-[#FFFFFF] dark:bg-[#363839] shadow-[0_0_2px_0_rgba(0,0,0,0.1)] text-[#999999]',
                            currentRange === range && 'bg-primary! text-white! shadow-none'
                        )}
                        onClick={() => handleRangeChange(range)}
                    >
                        {t(`date_info.${range}`)}
                    </button>
                ))}
            </div>
        </div>
    );
}
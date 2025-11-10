import React, { useState } from "react";
import LeftIcon from "./left.svg?component";
import RightIcon from "./right.svg?component";
import { useTranslation } from "react-i18next";
import { useIsMobile, useMediaQuery } from "@/hooks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { PresetPageSizes, ListPresetPageSizes } from '@/constants/common'

interface PaginationProps {
  // totalPages: number; // 总页数
  total?: number; // 总数
  currentPage: number; // 当前页
  onChange: (page: number, size?: number) => void; // 页码切换回调
  presetPageSizes?: number[]; // 页码切换list
  paginationType?: 'list' | 'page'; // 分页类型
  pageSize: number; // 当前页面条数
  setPageSize?: (pageSize: number) => void; // 改变页面数据条数
  textDirection?: 'left' | 'right' | 'center'; // 分页方向
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  total = 0,
  currentPage,
  onChange,
  paginationType = 'list',
  pageSize,
  setPageSize,
  textDirection = 'end',
  className
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const isMaxW = useMediaQuery(`(max-width: 1111px)`)
  const pageSizeList = paginationType === 'list' ? ListPresetPageSizes : PresetPageSizes
  const [inputPage, setInputPage] = useState(currentPage);
  const [selectedValue, setSelectedValue] = useState<number>(pageSize ?? pageSizeList[0]);

  const textAlignClass = {
    left: 'justify-start',
    right: 'justify-end',
    center: 'justify-center',
  }[textDirection] || 'justify-end';

  // const totalPages = Math.max(totalPages, 1);
  const totalPages = Math.ceil(total / pageSize);
  const current = Math.min(Math.max(currentPage, 1), totalPages);

  const changePage = (page: number) => {
    if (page && page >= 1 && page <= totalPages) {
      onChange(page);
      setInputPage(Math.min(page + 1, totalPages));
    }
  };

  const handleSelectClick = (value: number) => {
    const numValue = Number(value);
    setSelectedValue(numValue);
    setPageSize?.(numValue);
  }

  // 生成详细页码及中间省略号
  const generatePageItems = () => {
    const items: React.ReactNode[] = [];
    for (let i = 1; i <= totalPages; i++) {
      // 显示首尾页、当前页前后2页
      if (i === 1 || i === totalPages || Math.abs(i - current) <= 2) {
        items.push(
          <button
            key={i}
            onClick={() => changePage(i)}
            className={`
              h-8 px-3 py-2  transition-colors rounded-[2px]
              border border-[#D9D9D9] flex items-center justify-center
              ${i === current
                ? `bg-primary text-white border-transparent`
                : "bg-white text-[#232323] hover:bg-gray-100 dark:hover:bg-[#363839] dark:border-[#4C4C4C] dark:bg-[#232323E5] dark:text-white"}
            `}
          >
            {i}
          </button>
        );
      }
      // 插入省略号（避免连续省略）
      else if (items[items.length - 1]?.type !== "span") {
        items.push(
          <span key={`ellipsis-${i}`} className="h-8 w-8 text-center text-[#00000040] dark:text-[#999999]">...</span>
        );
      }
    }
    return items;
  };

  if (totalPages < 2) {
    return null;
  }

  return (
    <div className={`${className} flex items-center space-x-2 py-4 ${textAlignClass}`}>
      {!isMobile && !isMaxW && <div className="flex items-center space-x-2 mr-3"><span>{t("pagination.total_page")}</span><span>{total}</span><span>{t("pagination.end_page")}</span></div>}
      {/* 上一页按钮 */}
      <button
        onClick={() => {
          if (current > 1) {
            changePage(current - 1);
          }
        }}
        disabled={current === 1}
        className={`
          w-8 h-8 p-[10px] rounded-[2px] border border-[#D9D9D9] dark:border-[#4C4C4C] flex items-center justify-center transition-opacity
          ${current === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-[#363839]"}
        `}
        aria-label="Previous page"
      >
        <LeftIcon className={`${current === 1 ? "text-[#D9D9D9]" : "text-[#232323] dark:text-white"}`} />
      </button>

      {/* 中间页码 */}
      {!isMobile && <div className="flex items-center space-x-1">
        {generatePageItems()}
      </div>}

      {/* 下一页按钮 */}
      <button
        onClick={() => {
          if (current < totalPages) {
            changePage(current + 1);
          }
        }}
        disabled={current === totalPages}
        className={`
          w-8 h-8 p-[10px] rounded-[2px] border border-[#D9D9D9] dark:border-[#4C4C4C] flex items-center justify-center transition-opacity mr-3
          ${current === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-[#363839]"}
        `}
        aria-label="Next page"
      >
        <RightIcon className={`${current === totalPages ? "text-[#D9D9D9]" : "text-[#232323] dark:text-white"}`} />
      </button>

      {/* 切换分页 */}
      <Select value={String(selectedValue)} onValueChange={(value) => handleSelectClick(value)}>
        <SelectTrigger className="h-[32px]! border border-[#D9D9D9]! rounded-[2px]! dark:border-[#4C4C4C]! shadow-none!">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {
            pageSizeList.map((item) => (
              <SelectItem key={item} value={String(item)}>{item} / {t("pagination.page_unit")}</SelectItem>
            ))
          }
        </SelectContent>
      </Select>

      {/* 跳转区域 */}
      {!isMobile && !isMaxW && <div className="flex items-center space-x-2 ml-3">
        <span className="text-sm text-[#232323] dark:text-white">{t("pagination.goto")}:</span>
        <input
          className="w-[50px] h-8 px-2 border border-[#D9D9D9] dark:border-[#4C4C4C] dark:text-white rounded-[2px] text-sm focus:outline-none"
          type="number"
          min={1}
          max={totalPages}
          value={inputPage}
          onChange={(event) => {
            const pageNo = parseInt(event.target.value, 10);
            setInputPage(
              Number.isNaN(pageNo)
                ? Number(event.target.value)
                : Math.min(pageNo, totalPages),
            );
          }}
          onKeyUp={(e) => e.key === "Enter" && changePage(inputPage)}
        />
      </div>}
    </div>
  );
};

export default Pagination;

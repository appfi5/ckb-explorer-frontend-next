import React, { useRef, useEffect, useState } from 'react';

interface EllipsisMiddleProps {
  text: string;
  className?: string;
  startLength?: number; // 开头保留长度，默认6
  endLength?: number;   // 结尾保留长度，默认6
  ellipsis?: string;    // 省略符号，默认'...'
}

const EllipsisMiddle: React.FC<EllipsisMiddleProps> = ({
  text,
  className = "",
  startLength = 6,
  endLength = 6,
  ellipsis = "...",
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [displayText, setDisplayText] = useState(text);

  // 计算需要显示的文本（中间省略）
  const calculateDisplayText = () => {
    if (!containerRef.current) return text;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;

    // 创建临时元素测量文本宽度（复用Tailwind字体样式）
    const temp = document.createElement("span");
    temp.className = "absolute invisible whitespace-nowrap";
    temp.style.font = getComputedStyle(container).font;
    document.body.appendChild(temp);

    // 完全显示的情况
    temp.textContent = text;
    if (temp.offsetWidth <= containerWidth) {
      document.body.removeChild(temp);
      return text;
    }

    // 中间省略处理
    const start = text.slice(0, startLength);
    const end = text.slice(-endLength);
    let result = `${start}${ellipsis}${end}`;

    // 二次检查：如果省略后仍超出，进一步缩短
    temp.textContent = result;
    if (temp.offsetWidth > containerWidth) {
      const shorterStart = text.slice(0, Math.max(2, startLength - 2));
      const shorterEnd = text.slice(-Math.max(2, endLength - 2));
      result = `${shorterStart}${ellipsis}${shorterEnd}`;
    }

    document.body.removeChild(temp);
    return result;
  };

  // 初始化和窗口变化时重新计算
  useEffect(() => {
    setDisplayText(calculateDisplayText());
    const handleResize = () => setDisplayText(calculateDisplayText());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [text, startLength, endLength, ellipsis]);

  return (
    <span
      ref={containerRef}
      className={`whitespace-nowrap overflow-hidden ${className} m-0 p-0`}
      title={text} // 悬停显示完整文本
    >
      {displayText}
    </span>
  );
};

export default EllipsisMiddle;

// 工具函数：强制格式化原始数值（禁用科学计数法，保留完整值）
export const localeNumberString = (num: number): string => {
    // 处理整数（无小数部分）
    if (Number.isInteger(num)) {
        return num.toLocaleString('en-US', {
            useGrouping: true, // 千分位分隔
            maximumFractionDigits: 0 // 不显示小数
        });
    }
    // 处理小数（保留原始小数位，最多8位）
    return num.toLocaleString('en-US', {
        useGrouping: true,
        maximumFractionDigits: 8,
        minimumFractionDigits: 1 // 确保小数位至少显示1位（如15.5而非15）
    });
};

// 工具函数：对数标准化（仅用于环形图占比计算）
export const logNormalize = (value: number): number => {
    if (value <= 0) return 0;
    return Math.log10(value);
};

// 工具函数：归一化占比计算
export const getNormalizedRatio = (values: number[]): number[] => {
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum === 0 ? values.map(() => 0) : values.map(val => (val / sum) * 100);
};

export const assertNotArray = (value: any): asserts value is object => {
    if (Array.isArray(value)) throw new Error('Value should not be an array');
};
import { useTheme } from "@/components/Theme";
import { env } from "@/env";

export const useChartTheme = () => {
    const [theme] = useTheme();
    const isDarkTheme = theme === "dark";
    const isTestnet = env.NEXT_PUBLIC_CHAIN_TYPE === "testnet";
    
    const LightChartColor = {
        areaColor: "#00CC9B",
        colors: ["#5700FF", "#00CC9B", "#484E4E"],
        moreColors: [
            "#5700FF",
            "#00CC9B",
            "#484E4E",
            "#FF5656",
            "#24C0F0",
            "#BCCC00",
            "#4661A6",
            "#EDAF36",
            "#E63ECB",
            "#69E63E",
        ],
        cellCount: ["#5700FF", "#484E4E", "#00CC9B"],
        totalSupplyColors: ["#5700FF", "#00CC9B", "#484E4E"],
        daoColors: ["#00CC9B", "#5700FF", "#232323"],
        secondaryIssuanceColors: ["#484E4E", "#5700FF", "#00CC9B"],
        liquidityColors: ["#5700FF", "#484E4E", "#00CC9B"],
    };
    const DarkChartColor = {
        areaColor: "#00CC9B",
        colors: ["#9672FA", "#00CC9B", "#484E4E"],
        moreColors: [
            "#9672FA",
            "#00CC9B",
            "#484E4E",
            "#FF5656",
            "#24C0F0",
            "#BCCC00",
            "#4661A6",
            "#EDAF36",
            "#E63ECB",
            "#69E63E",
        ],
        cellCount: ["#9672FA", "#484E4E", "#00CC9B"],
        totalSupplyColors: ["#9672FA", "#00CC9B", "#484E4E"],
        daoColors: ["#00CC9B", "#9672FA", "#EDF2F2"],
        secondaryIssuanceColors: ["#484E4E", "#9672FA", "#00CC9B"],
        liquidityColors: ["#9672FA", "#484E4E", "#00CC9B"],
    }

    const lightPieColor = ['#5700FF', '#6839fb', '#794ffb', '#8a65fc', '#9a7bfc', '#ab91fd'];
    const darkPieColor = ['#9672FA', '#AC8FFF', '#B79FFB', '#C7B3FF', '#D6C8FF', '#E9E1FF'];

    const mainnetAreaStyle = ['#00CC9B4D', '#00CC9B00','#00CC9B'];
    const testnetAreaStyle = ['#9672FA4D', '#9672FA00','#9672FA'];

    const ChartColor = isDarkTheme ? DarkChartColor : LightChartColor;

    const DaoChartPieColor = [isDarkTheme ? "#EDF2F2" : "#232323","#5700FF",isTestnet ? "#9672FA" : "#00CC9B"]

    return {
        axisLabelColor: isDarkTheme ? '#999999' : '#484D4E',
        axisLineColor: isDarkTheme ? '#5B5B5B' : '#DDDDDD',
        chartThemeColor: ChartColor,
        baseColors: [
            ...ChartColor.colors.slice(0, 2),
            "#FF5733",
            "#FFC300",
            "#DAF7A6",
            "#33FF57",
            "#33C1FF",
            "#8A33FF",
            "#FF33A8",
            "#FF33F6",
            "#FF8C33",
            "#FFE733",
        ],
        pieColor: isDarkTheme ? darkPieColor : lightPieColor,
        feeColors: ['#0099FF', '#00CC9B', '#FF4545'],
        AreaStyleColors: isTestnet ? testnetAreaStyle : mainnetAreaStyle,
        DaoChartPieColor: DaoChartPieColor,
    };
};
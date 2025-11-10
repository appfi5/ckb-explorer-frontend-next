import { useMemo } from "react";
import type { EChartsOption } from "echarts";
import * as echarts from "echarts/core";
import { GridComponent, TitleComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { localeNumberString } from "@/utils/number";
import Loading from "@/components/Loading";
import { useIsExtraLarge } from "@/hooks";
import { type ChartItem } from "@/server/dataTypes";
import Link from "next/link";
import { ReactChartCore } from "../../../charts/components/common";
import { avgMockData } from "./avgMockData";
import Image from "next/image";
import ChartNoDataImg from '@/assets/icons/chart-no-data.png';
import { useTheme } from "@/components/Theme";
import Empty from "@/components/Empty";
import server from "@/server";
import { env } from "@/env";

echarts.use([
  GridComponent,
  TitleComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);

const useOption = () => {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const isDarkTheme = theme === "dark";
  return (
    statisticAverageBlockTimes: ChartItem.AverageBlockTime[],
    useMiniStyle: boolean,
  ): EChartsOption => {
    const rootStyle = window.getComputedStyle(document.documentElement);
    const primaryColor = rootStyle.getPropertyValue("--color-primary").trim();
    const bgColor = env.NEXT_PUBLIC_CHAIN_TYPE === "testnet" ? "#FCFBFF" : "#F5F9FB"
    return {
      color: [primaryColor],
      title: {
        text: t("statistic.average_block_time_title"),
        textAlign: "left",
        textStyle: {
          color: "#999999",
          fontSize: 12,
          fontWeight: "normal",
        },
      },
      grid: {
        show: true,
        left: useMiniStyle ? "1%" : "2%",
        right: 20,
        top: useMiniStyle ? "20%" : "15%",
        bottom: "2%",
        containLabel: true,
        borderColor: "transparent",
        backgroundColor: isDarkTheme ? "#292A2B" : bgColor
        // backgroundColor: "rgb(255, 0, 0)"
      },
      xAxis: [
        {
          axisLine: {
            lineStyle: {
              color: isDarkTheme ? "#3D535B" : "#ddd",
              width: 1,
            },
          },
          data: statisticAverageBlockTimes.map((data) => data.timestamp),
          axisLabel: {
            color: "#999999",
            formatter: (value: string) =>
              dayjs(Number(value) * 1000).format("MM/DD"),
          },
          boundaryGap: false,
        },
      ],
      yAxis: [
        {
          position: "left",
          type: "value",
          scale: true,
          nameTextStyle: {
            align: "left",
          },
          splitLine: {
            lineStyle: {
              color: isDarkTheme ? "#3D535B" : "#ddd",
              width: 1,
              opacity: 0.8,
              type: "dashed"
            },
          },
          axisLine: {
            lineStyle: {
              color: "#999999",
              width: 1,
            },
          },
          axisLabel: {
            formatter: (value: number) => localeNumberString(value),
          },
        },
        // {
        //   position: "right",
        //   type: "value",
        //   axisLine: {
        //     lineStyle: {
        //       color: primaryColor,
        //       width: 1,
        //     },
        //   },
        // },
      ],
      series: [
        {
          name: t("statistic.daily_moving_average"),
          type: "line",
          yAxisIndex: 0,
          lineStyle: {
            color: primaryColor,
            width: 1,
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: `${primaryColor}4d` // 0% 处的颜色
              }, {
                offset: 1, color: `${primaryColor}00` // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          },
          symbol: "none",
          data: statisticAverageBlockTimes.map((data) =>
            (Number(data.avgBlockTimeDaily) / 1000).toFixed(2),
          ),
        },
      ],
    };
  };
};

export default function AverageBlockTimeChart() {
  const isXL = useIsExtraLarge();
  const parseOption = useOption();

  const query = useQuery({
    queryKey: ["fetchStatisticAverageBlockTimes"],
    // queryFn: () => avgMockData, // explorerService.api.fetchStatisticAverageBlockTimes(),
    queryFn: async () => {
      const resData = await server.explorer("GET /distribution_data/{indicator}", { indicator: "average_block_time" });
      return resData?.averageBlockTime ?? []
    },
    refetchOnWindowFocus: false,
  });
  const fullStatisticAverageBlockTimes = useMemo(
    () => query.data ?? [],
    [query.data],
  );

  const statisticAverageBlockTimes = useMemo(() => {
    const last14Days = -336;
    return fullStatisticAverageBlockTimes.slice(last14Days);
  }, [fullStatisticAverageBlockTimes]);

  if (query.isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (statisticAverageBlockTimes.length === 0) {
    return (
      <Empty className="h-full gap-2" />
    )
  }

  // if (query.isLoading || statisticAverageBlockTimes.length === 0) {
  //   return (
  //     <div className="h-full flex items-center justify-center">
  //       {query.isLoading ? (
  //         <Loading />
  //       ) : (
  //         <InteImage
  //           className="w-[105px] h-auto bg-red-500"
  //           src={ChartNoDataImage}
  //           alt="chart no data"
  //         />
  //       )}
  //     </div>
  //   );
  // }

  return (
    <Link href="/charts/average-block-time" className="block h-full cursor-pointer">
      <ReactChartCore
        option={parseOption(statisticAverageBlockTimes, isXL)}
        notMerge
        lazyUpdate
        style={{
          height: "100%",
        }}
      />
    </Link>
  );
}

import { memo, useMemo } from "react";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import type { EChartsOption } from "echarts";
import * as echarts from "echarts/core";
import { GridComponent, TitleComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { handleAxis } from "@/utils/chart";
import Loading from "@/components/Loading";
import { useIsExtraLarge } from "@/hooks";
import Link from "next/link";
import { ReactChartCore } from "../../../charts/components/common";
import { useTheme } from "@/components/Theme";
import server from "@/server";
import Empty from "@/components/Empty";
import { env } from "@/env";
// import { Link } from '@/components/Link'

echarts.use([
  GridComponent,
  TitleComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);

type HashRateChartItem = Pick<APIExplorer.DailyStatisticResponse, "createdAtUnixtimestamp" | "avgHashRate">
const useOption = () => {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const isDarkTheme = theme === "dark";
  return (
    statisticHashRates: HashRateChartItem[],
    useMiniStyle: boolean,
  ): EChartsOption => {
    const rootStyle = window.getComputedStyle(document.documentElement);
    const primaryColor = rootStyle.getPropertyValue("--color-primary").trim();
    const bgColor = env.NEXT_PUBLIC_CHAIN_TYPE === "testnet" ? "#FCFBFF" : "#F5F9FB"
    return {
      color: [primaryColor],
      title: {
        text: t("block.hash_rate_hps"),
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
      },
      xAxis: [
        {
          axisLine: {
            lineStyle: {
              color: isDarkTheme ? "#3D535B" : "#ddd",
              width: 1,
            },
          },
          data: statisticHashRates.map((data) => data.createdAtUnixtimestamp),
          axisLabel: {
            color: "#999999",
            formatter: (value: string) => dayjs(+value * 1000).format("MM/DD"),
          },
          boundaryGap: false,
        },
      ],
      yAxis: [
        {
          position: "left",
          type: "value",
          scale: true,
          axisLine: {
            lineStyle: {
              color: "#999999",
              width: 1,
            },
          },
          splitLine: {
            lineStyle: {
              color: isDarkTheme ? "#3D535B" : "#ddd",
              width: 1,
              opacity: 0.8,
              type: "dashed"
            },
          },
          axisLabel: {
            formatter: (value: number) => handleAxis(new BigNumber(value), 0),
          },
          boundaryGap: ["5%", "2%"],
        },
        // {
        //   position: "right",
        //   type: "value",
        //   axisLine: {
        //     lineStyle: {
        //       color: "#999999",
        //       width: 1,
        //     },
        //   },
        // },
      ],
      series: [
        {
          name: t("block.hash_rate"),
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
                offset: 0, color: `${primaryColor}4d` 
              }, {
                offset: 1, color: `${primaryColor}00`
              }],
              global: false 
            }
          },
          symbol: "none",
          data: statisticHashRates.map((data) =>
            new BigNumber(data.avgHashRate).toNumber(),
          ),
        },
      ],
    };
  };
};
export default function HashRateChart() {
  const isXL = useIsExtraLarge();
  const query = useQuery({
    queryKey: ["fetchStatisticHashRate"],
    queryFn: () => server.explorer("GET /daily_statistics/{indicator}", { indicator: "avg_hash_rate" }),
    refetchOnWindowFocus: false,
  });


  const fullStatisticHashRates = useMemo(() => query.data ?? [], [query.data]);
  const parseOption = useOption();

  const statisticHashRates = useMemo(() => {
    const last14Days = -15; // one day offset
    return fullStatisticHashRates.slice(last14Days);
  }, [fullStatisticHashRates]);

  if (query.isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (statisticHashRates.length === 0) {
    return (
      <Empty className="h-full gap-2" />
    )
  }

  // if (query.isLoading || statisticHashRates.length === 0) {
  //   return (
  //     <div className="h-full flex items-center justify-center">
  //       {query.isLoading ? (
  //         <Loading />
  //       ) : (
  //         <div className="flex flex-col items-center">
  //           <Image src={ChartNoDataImg} alt="chart no data" />
  //           <span>No Data</span>
  //         </div>
  //         // <InteImage
  //         //   className="w-[105px] h-auto bg-red-500"
  //         //   src={ChartNoDataImage}
  //         //   alt="chart no data"
  //         // />
  //       )}
  //     </div>
  //   );
  // }

  return (
    <Link href="/charts/hash-rate" className="block h-full cursor-pointer">
      <ReactChartCore
        option={parseOption(statisticHashRates, isXL)}
        notMerge
        lazyUpdate
        style={{
          height: "100%"
        }}
      />
    </Link>
  );
}



"use client"
import {
  type ComponentProps,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
} from "react";
import classNames from "classnames";
import "echarts-gl";
import * as echarts from "echarts/core";
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent,
  GeoComponent,
  LegendComponent,
  MarkLineComponent,
  DataZoomComponent,
  BrushComponent,
} from "echarts/components";
import {
  MapChart,
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
} from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import type { EChartsOption } from "echarts";
import type { CallbackDataParams } from "echarts/types/dist/shared";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import ChartNoDataImage from "./chart_no_data.png";
import ChartNoDataAggronImage from "./chart_no_data_aggron.png";
import { isMainnet } from "@/utils/chain";
import Loading from "@/components/Loading";
import Content from "@/components/Content";
import { useIsMobile, usePrevious, useWindowResize } from "@/hooks";
import { isDeepEqual } from "@/utils/util";
import { HelpTip } from "@/components/HelpTip";
import { ChartColor, type ChartColorConfig } from "@/constants/common";
import styles from "./index.module.scss";
import InteImage from "@/components/InteImage";
import DownloadIcon from "@/assets/icons/download.svg?component";
import PixelBorderBlock from "@/components/PixelBorderBlock";
import { useTheme } from "@/components/Theme";

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent,
  GeoComponent,
  MapChart,
  CanvasRenderer,
  LegendComponent,
  MarkLineComponent,
  DataZoomComponent,
  BrushComponent,
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
]);

const LoadingComp = ({ isThumbnail }: { isThumbnail?: boolean }) =>
  isThumbnail ? <Loading /> : <Loading show />;

const ChartLoading = ({
  show,
  isThumbnail = false,
}: {
  show: boolean;
  isThumbnail?: boolean;
}) => {
  const { t } = useTranslation();
  return (
    <div
      className={classNames(
        styles.loadingPanel,
        isThumbnail && styles.isThumbnail,
      )}
    >
      {show ? (
        <LoadingComp isThumbnail={isThumbnail} />
      ) : (
        <div
          className={classNames(
            styles.chartNoDataPanel,
            isThumbnail && styles.isThumbnail,
          )}
        >
          <InteImage
            className={isThumbnail ? styles.isThumbnail : ""}
            alt="no data"
            src={isMainnet() ? ChartNoDataImage : ChartNoDataAggronImage}
          />
          <span>{t("statistic.no_data")}</span>
        </div>
      )}
    </div>
  );
};

const ReactChartCore = ({
  option,
  isThumbnail,
  onClick,
  notMerge = false,
  lazyUpdate = false,
  style,
  className = "",
}: {
  option: EChartsOption;
  isThumbnail?: boolean;
  onClick?: (param: CallbackDataParams) => void;
  notMerge?: boolean;
  lazyUpdate?: boolean;
  style?: CSSProperties;
  className?: string;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const prevOption = usePrevious(option);
  const prevClickEvent = usePrevious(onClick);

  useEffect(() => {
    let chartInstance: echarts.ECharts | null = null;
    if (chartRef.current) {
      if (!chartInstanceRef.current) {
        const renderedInstance = echarts.getInstanceByDom(chartRef.current);
        if (renderedInstance) {
          renderedInstance.dispose();
        }
        chartInstanceRef.current = echarts.init(chartRef.current);
      }
      chartInstance = chartInstanceRef.current;
      try {
        if (!isDeepEqual(prevOption, option, ["formatter"])) {
          chartInstance.setOption(option, { notMerge, lazyUpdate });
        }
        if (
          onClick &&
          typeof onClick === "function" &&
          onClick !== prevClickEvent
        ) {
          chartInstance.on("click", onClick);
        }
      } catch (error) {
        console.error("error", error);
        if (chartInstance) {
          chartInstance.dispose();
        }
      }
    }
  }, [onClick, lazyUpdate, notMerge, option, prevClickEvent, prevOption]);

  useWindowResize(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current?.resize();
    }
  });

  return (
    <div
      style={{ ...style }}
      className={classNames(className, isThumbnail ? "h-[200px]" : "h-[30vh] sm:h-[70vh]")}
      ref={chartRef}
    />
  );
};

const dataToCsv = (data?: (string | number)[][]) => {
  if (!data || data.length === 0) {
    return undefined;
  }
  let csv = "";
  data.forEach((row) => {
    csv += row.join(",");
    csv += "\n";
  });
  return csv;
};

const ChartPage = ({
  title,
  children,
  description,
  data,
  style,
  queryNode,
  isNoDefaultStyle
}: {
  style?: CSSProperties;
  title: string;
  children: ReactNode;
  description?: string;
  data?: (string | number)[][];
  queryNode?: ReactNode;
  isNoDefaultStyle?: boolean;
}) => {
  const csv = dataToCsv(data);
  const { t } = useTranslation();
  const [theme] = useTheme();
  const isDarkTheme = theme === "dark";
  const isMobile = useIsMobile();

  const fileName = (
    title.indexOf(" (") > 0 ? title.substring(0, title.indexOf(" (")) : title
  )
    .replace(/&/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-");

  const defaultContentClassName = !isNoDefaultStyle ? "container md:shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] bg-[white] dark:bg-[#232323E5] dark:shadow-[0_4px_4px_rgba(0,0,0,0.25)] dark:backdrop-blur-[50px] dark:border-2 dark:border-[#282B2C] rounded-[8px] p-3 sm:p-5 my-[20px]!" : ''
  return (
    <Content>
      <div className={defaultContentClassName}>
        <div className={styles.chartDetailTitlePanel}>
          <div>
            <span className="text-[18px] font-medium mr-1">{title}</span>
            {description && (
              <HelpTip placement="bottom" iconProps={{ alt: "chart help" }}>
                {description}
              </HelpTip>
            )}
          </div>
          <div className={`${styles.chartDetailTitleBtn}`}>
            {csv && !isMobile && <PixelBorderBlock
              pixelSize="2px"
              apperanceClassName="*:data-[slot=border]:bg-[#D9D9D9] *:dark:data-[slot=border]:bg-[#4C4C4C] hover:*:data-[slot=bg]:bg-[#ffffff14]"
              className="cursor-pointer w-full h-[32px]"
              contentClassName="h-full flex items-center justify-left px-[9px] text-[14px] leading-[22px]"
            // backgroundColor={isDarkTheme ? "transparent" : "#fff"}
            >
              <a
                className="flex items-center justify-center gap-[7px]"
                rel="noopener noreferrer"
                href={`data:text/csv;charset=utf-8,${encodeURI(csv)}`}
                target="_blank"
                download={`${fileName}.csv`}
              >
                <DownloadIcon className={styles.downloadIconSty} />
                <span className={`font-medium text-[#999999] dark:text-[#999999] ${styles.chartDesc}`}>{t("statistic.download_data")}</span>
              </a>
            </PixelBorderBlock>}
          </div>
        </div>
        <div className="bg-[#F5F9FB] dark:bg-[#303030] rounded-[16px] p-3 sm:p-5">
          <div className="bg-white rounded-[4px] py-5 sm:py-10 dark:bg-[#363839]">
            {queryNode}
            {children}
          </div>
        </div>
      </div>
    </Content>
  );
};

export interface SmartChartPageProps<T> {
  title: string;
  description?: string;
  note?: string;
  isThumbnail?: boolean;
  chartProps?: Partial<ComponentProps<typeof ReactChartCore>>;
  fetchData: () => Promise<T[]>;
  onFetched?: (dataList: T[]) => void;
  getEChartOption: (
    dataList: T[],
    chartColor: ChartColorConfig,
    isMobile: boolean,
    isThumbnail?: boolean,
  ) => EChartsOption;
  toCSV?: (dataList: T[]) => (string | number)[][];
  queryKey?: string;
  style?: CSSProperties;
  queryNode?: ReactNode;
  isNoDefaultStyle?: boolean;
  typeKey?: string;
}

const isNonNullPlainObject = (val: unknown): val is Record<string | number | symbol, unknown> => {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
};

const processData = <T,>(data: unknown, typeKey?: string | number | symbol): T[] => {
  if (!data) return [] as T[];

  if (typeKey !== undefined && isNonNullPlainObject(data) && typeKey in data) {
    const extractedData = data[typeKey];
    return Array.isArray(extractedData) ? (extractedData as T[]) : ([extractedData] as T[]);
  }

  return Array.isArray(data) ? (data as T[]) : ([data] as T[]);
};

export function SmartChartPage<T>({
  title,
  description,
  note,
  isThumbnail = false,
  chartProps,
  fetchData,
  onFetched,
  getEChartOption,
  toCSV,
  queryKey,
  style,
  queryNode,
  isNoDefaultStyle,
  typeKey
}: SmartChartPageProps<T>): ReactElement {
  const isMobile = useIsMobile();

  const query = useQuery({
    queryKey: ["SmartChartPage", queryKey],
    refetchOnWindowFocus: false,
    queryFn: () => fetchData(),
  });

  const dataList = useMemo(() => {
    return processData<T>(query.data, typeKey);
  }, [query.data, typeKey]);

  useEffect(() => {
    if (onFetched && query.data) {
      const fetchedData = processData<T>(query.data, typeKey);
      onFetched(fetchedData);
    }
  }, [onFetched, query.data, typeKey]);

  const option = getEChartOption(dataList, ChartColor, isMobile, isThumbnail);
  const finalOption = {
    ...option,
    tooltip: isThumbnail
      ? option.tooltip
      : {
        backgroundColor: "rgba(50, 50, 50, 0.7)",
        borderWidth: 0,
        textStyle: {
          color: "#fff",
        },
        ...option.tooltip,
      },
  };

  const content = query.isLoading ? (
    <ChartLoading show isThumbnail={isThumbnail} />
  ) : (
    <ReactChartCore
      option={finalOption}
      isThumbnail={isThumbnail}
      {...chartProps}
      style={style}
    />
  );

  return isThumbnail ? (
    content
  ) : (
    <ChartPage
      title={title}
      description={description}
      data={toCSV?.(dataList)}
      style={style}
      queryNode={queryNode}
      isNoDefaultStyle={isNoDefaultStyle}
    >
      {content}
      {note != null && <div className={styles.chartNotePanel}>{note}</div>}
    </ChartPage>
  );
}

const tooltipColor = (color: string) =>
  `<span style="display:inline-block;margin-right:8px;margin-left:5px;margin-bottom:2px;border-radius:10px;width:6px;height:6px;background-color:${color}"></span>`;

const tooltipWidth = (value: string, width: number) =>
  `<span style="width:${width}px;display:inline-block;">${value}:</span>`;

export type SeriesItem = {
  seriesName?: string;
  name: string;
  color: string;
  dataIndex: number;
};

export { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth };


import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { shannonToCkb } from "@/utils/util";
import CardPanel from "@/components/Card/CardPanel";
import TextEllipsis from "@/components/TextEllipsis";
import OutLink from "@/components/OutLink";
import TwoSizeAmount from "@/components/TwoSizeAmount";
import { CellStatus, CellStatusBadge } from "../CellStatus";
// import { cn } from '@/lib/utils'
import SwitchIcon from "@/assets/icons/switch.svg?component";
import DownloadIcon from "@/assets/icons/download.svg?component";
import Link from "next/link";
import server from "@/server";
import { QueryResult } from "@/components/QueryResult";
import parseData, { parseType } from "../dataDecoder";
import SimpleJsonViewer from "@/components/JsonViewer/SimpleJsonViewer";
import classNames from "classnames";
import ScriptTag from "@/components/ScriptTag";
import download from "@/utils/download";
import { toast } from "sonner";



export default function CellInfo({ cellId, suffix }: { cellId: APIExplorer.CellOutputResponse['id'], suffix?: ReactNode }) {
  const { t } = useTranslation("cell");

  const cellInfoQuery = useQuery({
    queryKey: ['cell_info', cellId],
    queryFn: async () => {
      const cellInfoRes = await server.explorer("GET /cell_output/{id}", { id: cellId });
      if (!cellInfoRes) {
        throw new Error("Cell not found");
      }
      const cellType = parseType(cellInfoRes)
      if (!!cellType && (cellInfoRes.data.length < 3)) {
        const wholeCellData = await server.explorer("GET /cell_output_data/{id}", { id: cellId });
        if (wholeCellData) {
          cellInfoRes.data = wholeCellData.data;
        }
      }
      return cellInfoRes;
    }
  });


  return (
    <>
      <div className="relative">
        <div className="absolute top-[5px] right-[0]">
          {suffix}
        </div>
        <div className="flex flex-row items-center gap-4">
          <div className="font-medium text-black dark:text-white text-lg md:text-[20px] leading-[28px]">
            {t("modal-title")}
          </div>
          {cellInfoQuery.data
            ? <CellStatusBadge status={cellInfoQuery.data.status} />
            : null}
        </div>

        <QueryResult query={cellInfoQuery}>
          {(cellInfo) => {
            const decodeCellData = parseData(cellInfo, cellInfo.data);
            return (
              <div className="mt-[16px] max-h-[70vh] overflow-auto">
                <CardPanel className="p-3 sm:p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 leading-[22px] gap-4">
                    <InfoField label={t("field.outpoint")} >
                      <OutLink
                        target="_blank"
                        href={`/transaction/${cellInfo.generatedTxHash}#${cellInfo.cellIndex}`}
                      >
                        <TextEllipsis
                          className="underline"
                          text={`${cellInfo.generatedTxHash}:${cellInfo.cellIndex}`}
                          ellipsis="transaction"
                        />
                      </OutLink>
                    </InfoField>
                    {
                      cellInfo.status === CellStatus.COMSUMED && (
                        <InfoField label={t("field.consumed_tx")}>
                          <OutLink
                            href={`/transaction/${cellInfo.consumedTxHash}`}
                          >
                            <TextEllipsis
                              className="underline"
                              text={cellInfo.consumedTxHash}
                              ellipsis="transaction"
                            />
                          </OutLink>
                        </InfoField>
                      )
                    }
                    {/* <InfoField label={t("cell.state")}>
                    <CellStatusBadge status={cellInfo.status} />
                  </InfoField> */}
                    {
                      !cellInfo.consumedTxHash && (<div className="hidden sm:block" />)
                    }
                    <InfoField label={t("field.capacity")}>
                      <TwoSizeAmount
                        decimalClassName="text-xs"
                        amount={shannonToCkb(cellInfo.capacity)}
                        unit={<span className="font-medium ml-[4px]">CKBytes</span>}
                      />
                    </InfoField>
                    <InfoField label={t("field.occupied")}>
                      <TwoSizeAmount
                        decimalClassName="text-xs"
                        amount={shannonToCkb(cellInfo.occupiedCapacity)}
                        unit={<span className="font-medium ml-[4px]">CKBytes</span>}
                      />
                    </InfoField>
                  </div>
                </CardPanel>

                <ParsableContent
                  label={t("field.lock")}
                  source={
                    <div className="p-2 sm:p-3" >
                      <SimpleJsonViewer
                        propertyClassName="min-w-[90px]"
                        source={
                          cellInfo.lockScript ? {
                            [t("field.script.code_hash")]: cellInfo.lockScript.codeHash,
                            [t("field.script.hash_type")]: cellInfo.lockScript.hashType,
                            [t("field.script.args")]: cellInfo.lockScript.args,
                          } : null
                        }
                        onRenderValue={(path, value) => {
                          if (path === "root.codeHash" || path === "root.args") {
                            return <span className="font-hash min-w-0">{value}</span>
                          }
                          return `${value}`;
                        }}
                        onRenderTags={(path, value) => {
                          if (path === "root.codeHash") {
                            return <ScriptTag category="lock" script={cellInfo.lockScript} />
                          }
                          return null
                        }}
                      />
                    </div>
                  }
                  parsed={
                    <div className="p-2 sm:p-5 w-full grid">
                      <Link className="underline break-words min-w-0 max-w-full hover:text-primary" href={`/address/${cellInfo.address}`}>
                        {cellInfo.address}
                      </Link>
                    </div>
                  }
                />

                <ParsableContent
                  label={t("field.type")}
                  source={
                    <div className={classNames("p-2 ", cellInfo.typeScript ? "sm:p-3" : "sm:p-5")} >
                      <SimpleJsonViewer
                        propertyClassName={cellInfo.typeScript ? "min-w-[90px]" : ""}
                        source={
                          cellInfo.typeScript ? {
                            [t("field.script.code_hash")]: cellInfo?.typeScript.codeHash,
                            [t("field.script.hash_type")]: cellInfo?.typeScript.hashType,
                            [t("field.script.args")]: cellInfo?.typeScript.args,
                          } : null
                        }
                        onRenderValue={(path, value) => {
                          if (path === "root.codeHash" || path === "root.args") {
                            return <span className="font-hash min-w-0">{value}</span>
                          }
                          return `${value}`;
                        }}
                        onRenderTags={(path, value) => {
                          if (path === "root.codeHash") {
                            return <ScriptTag category="type" script={cellInfo.typeScript} />
                          }
                          return null
                        }}
                      />
                    </div>
                    // <SourceDataRender
                    //   content={cellInfo?.typeScript}
                    // />
                  }
                // parsed={
                //   <div className="p-[20px]">
                //     <Link className="underline" href={`/address/${cell.addressHash}`}>
                //       {cell.addressHash}
                //     </Link>
                //   </div>
                // }
                />

                <ParsableContent
                  label={t("field.data")}
                  onDownload={cellInfo.dataSize < 1024 ? undefined : async () => {
                    let cellWholeData = cellInfo.data.length < 3 ? undefined : cellInfo.data;
                    if (!cellWholeData) {
                      const cellDataRes = await server.explorer("GET /cell_output_data/{id}", { id: cellId })
                      cellWholeData = cellDataRes?.data
                    }

                    if (!cellWholeData || (cellWholeData?.length < 3)) {
                      toast.error(t("message.get_cell_data_failed"));
                      return;
                    }

                    download(`cell_data_${cellInfo.generatedTxHash}_${cellInfo.cellIndex}`, cellWholeData);
                  }}
                  source={
                    <div className="p-2 sm:p-5 w-full grid">
                      <div className="break-words font-hash min-w-0 max-w-full">
                        {cellInfo.dataSize > 1024 && (cellInfo.data.length < 3) ? `<${t("message.data_too_large")}>` : cellInfo.data}
                      </div>
                    </div>
                  }
                  parsed={
                    decodeCellData
                      ?
                      <div className="p-2 sm:p-3" >
                        <SimpleJsonViewer
                          source={decodeCellData?.content}
                        />
                      </div>
                      : null
                  }
                />

              </div>
            )
          }}
        </QueryResult>


      </div>
    </>
  );
};


function InfoField({ label, children }: { label: ReactNode; children?: ReactNode }) {

  return (
    <div className="flex flex-row justify-between sm:flex-col sm:justify-start">
      <div className="text-[#909399] mb-[4px]">{label}:</div>
      {children}
    </div>
  )
}

function ParsableContent({ label, source, parsed, onDownload }: { label: ReactNode; source: ReactNode; parsed?: ReactNode, onDownload?: () => void }) {
  const [showParsed, setShowParsed] = useState(!!parsed);
  const { t } = useTranslation("cell");
  return (
    <CardPanel className="relative mt-[16px] pt-3 pb-5 px-3 sm:px-5">
      <div className="absolute top-[12px] right-[20px] flex flex-row gap-6">
        {
          !!onDownload && (
            <div className="flex flex-row items-center gap-[8px] text-primary cursor-pointer" onClick={onDownload}>
              <DownloadIcon width={16} height={16} />
              {t("action.download_source")}
            </div>
          )
        }
        {
          !!parsed && (
            <div
              className="flex flex-row items-center gap-[8px] text-primary cursor-pointer"
              onClick={() => setShowParsed(!showParsed)}
            >
              <SwitchIcon />
              {showParsed ? t("action.source") : t("action.parsed")}
            </div>
          )
        }
      </div>

      <div className="text-[#909399] mb-[4px]">{label}:</div>
      <div className="bg-white dark:bg-[#232323e6] border border-[#eee] dark:border-[#4c4c4c] rounded-[4px] mt-[8px]">{showParsed ? parsed : source}</div>
    </CardPanel>
  )
}

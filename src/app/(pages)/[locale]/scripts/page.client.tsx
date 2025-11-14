"use client"
import Card from "@/components/Card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/shadcn/accordion";
import Tooltip from "@/components/Tooltip";
import clientDB from "@/database";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import { cloneElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import VerifiedIcon from "./assets/verified.svg?component";
// import OwnerlessIcon from "./assets/ownerless.svg?component";
import RFCIcon from "./assets/rfc.svg?component";
import SourceCodeIcon from "./assets/source-code.svg?component";
import WebsiteIcon from "./assets/website.svg?component";
import TextEllipsis from "@/components/TextEllipsis";
import DescItem from "@/components/Card/DescItem";
import type { KnownScriptInfo } from "@/database/known-scripts/tool";

const borderClass = "border-[#d9d9d9] dark:border-[#4c4c4c]"
const getHash = () =>
  typeof window !== "undefined"
    ? decodeURIComponent(window.location.hash).slice(1)
    : "";
function useUrlAnchor() {

  const [hash, setHash] = useState(getHash());

  useEffect(() => {
    const onHashChange = () => { setHash(getHash()); };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return hash;
}
export default function ScriptsList() {
  const { t } = useTranslation("script");
  const defaultOpenKey = useUrlAnchor();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const { data: scriptInfos } = useQuery({
    queryKey: ["scripts"],
    queryFn: async () => {
      const list = await clientDB.knownScript.get();
      return list;
    },
  })

  useEffect(() => {
    if (typeof window !== undefined && scriptInfos?.length) {
      (async () => {
        const scriptCodeHash = defaultOpenKey;
        const scriptInfo = await clientDB.knownScript.get(scriptCodeHash);
        const openKey = scriptInfo?.name ?? "";
        const targetElement = document.getElementById(`script-${openKey}`);
        if (!targetElement) return;
        const rootStyle = window.getComputedStyle(document.documentElement);
        const appHeaderHeight = parseInt(rootStyle.getPropertyValue("--navbar-height"), 10);
        const offsetY = targetElement.offsetTop - appHeaderHeight - 20;
        window.scrollTo({ top: offsetY, behavior: "smooth" });
        setOpenKeys(openKey ? [openKey] : []);
      })()
    }
  }, [defaultOpenKey, scriptInfos?.length]);

  return (
    <div className="container min-h-page-height py-5">
      <Card className="p-5">
        <div className="text-xl font-bold">{t("title")}</div>
        <Accordion
          type="multiple"
          value={openKeys}
          onValueChange={(value) => setOpenKeys(value)}
          // collapsible
          className={classNames(
            "w-full border mt-5 rounded-[8px] overflow-hidden",
            borderClass
          )}
        >
          {
            scriptInfos?.map(script => (
              <AccordionItem id={`script-${script.name}`} value={script.name} className={borderClass}>
                <AccordionTrigger className={classNames("bg-[#FAFAFA] dark:bg-[#303030] [&[data-state=open]]:border-b px-1 sm:px-3 py-3 cursor-pointer items-center", borderClass)}>
                  <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <div>
                      <div>{script.name}</div>
                      {/* <TextEllipsis
                        className="text-[#999]"
                        text={script.codeHash}
                        ellipsis={{ head: 8, tail: -8 }}
                      /> */}
                    </div>
                    <div className="hidden sm:flex flex-row items-center gap-2 md:pr-9">
                      <Verified script={script} />
                      {/* <Ownerless script={script} /> */}
                      <RFC script={script} />
                      <SourceCode script={script} />
                      <Website script={script} />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-5 grid grid-cols-1 gap-3 break-all">
                  {
                    !!script.description && (
                      <DescItem
                        layout="flex-col items-start gap-3"
                        label={<div className="w-20">{t("fields.description")}</div>}
                        flex={{ label: 'none', content: 1 }}
                      >
                        {script.description}
                      </DescItem>
                    )
                  }
                  {/* <DescItem
                    layout="flex-row items-start gap-3"
                    label={<div className="w-20">{t("fields.code_hash")}</div>}
                    flex={{ label: 'none', content: 1 }}
                  >
                    <span className="font-hash">{script.codeHash}</span>
                  </DescItem>
                  <DescItem
                    layout="flex-row items-start gap-3"
                    label={<div className="w-20">{t("fields.type")}</div>}
                    flex={{ label: 'none', content: 1 }}
                  >
                    {[script.isLockScript ? t("desc.lock_script") : "", script.isTypeScript ? t("desc.type_script") : ""].filter(Boolean).join("、")}
                  </DescItem>
                  <DescItem
                    layout="flex-row items-start gap-3"
                    label={<div className="w-20">{script.hashType === "type" ? t("fields.data_hash") : t("fields.type_hash")}</div>}
                    flex={{ label: 'none', content: 1 }}
                  >
                    <span className="font-hash">{script.hashType === "type" ? script.dataHash : script.typeHash}</span>
                  </DescItem> */}

                  <DescItem
                    layout="flex-col items-start gap-3"
                    label="Deployments"
                    contentClassName="self-stretch"
                    flex={{ label: 'none', content: 1 }}
                  >
                    {/* <span className="font-hash">{script.hashType === "type" ? script.dataHash : script.typeHash}</span> */}
                    <div className="flex flex-col gap-2">
                      {
                        script.deployments.map((deployment, index) => (
                          <div key={index} className="flex flex-col gap-2 bg-[#f5f5f5] dark:bg-[#303030] p-3 rounded-sm text-xs sm:text-sm">
                            {(deployment.tag || deployment.deprecated) && (
                              <div className="mb-2">{deployment.tag} {deployment.deprecated ? "deprecated" : ""}</div>
                            )}
                            <div>
                              <span className="font-hash">{t("fields.code_hash")}:</span>
                              <span className="font-hash ml-2">{deployment.codeHash}</span>
                            </div>
                            <div>
                              <span className="font-hash">{deployment.hashType === 'type' ? t("fields.data_hash") : t("fields.type_hash")}:</span>
                              <span className="font-hash ml-2">{(deployment.hashType === 'type' ? deployment.dataHash : deployment.typeHash) || "0x"}</span>
                            </div>
                            <div>
                              <span className="font-hash">Hash Type:</span>
                              <span className="font-hash ml-2">{deployment.hashType}</span>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </DescItem>


                </AccordionContent>
              </AccordionItem>
            ))
          }
        </Accordion>
      </Card>
    </div>
  )
}


function IconTemplate({ icon, url, description }: { icon: React.ReactNode; url?: string; description: string }) {

  const triggerEle = url ? <Link target="_blank" href={url} /> : <div />;

  return (
    <Tooltip
      asChild
      trigger={
        cloneElement(triggerEle, {
          className: classNames(
            "size-5 sm:size-7 flex items-center justify-center rounded-sm hover:bg-[#EDF2F2] dark:hover:bg-[rgb(from_var(--color-primary)_r_g_b_/_10%)] hover:text-primary",
            url ? "cursor-pointer" : "cursor-default"
          ),
          children: icon,
          onClick: e => {
            e?.stopPropagation();
          }
        })
        // <div className="size-7 flex items-center justify-center rounded-sm hover:bg-[#EDF2F2] hover:text-primary">
        //   {icon}
        // </div>
      }
    >
      {description}
    </Tooltip>
  )
}

function Verified({ script }: { script: KnownScriptInfo }) {
  const { t } = useTranslation("script");
  if (!script.verified) return null;
  return (
    <IconTemplate
      icon={<VerifiedIcon />}
      description={t("icon.verified")}
    />
  )
}


// function Ownerless({ script }: { script: KnownScriptInfo }) {
//   const { t } = useTranslation("script");
//   if (!script.isZeroLock) return null;
//   return (
//     <IconTemplate
//       icon={<OwnerlessIcon />}
//       description={t("icon.ownerless_cell")}
//     />
//   )
// }

function RFC({ script }: { script: KnownScriptInfo }) {
  const { t } = useTranslation("script");
  if (!script.rfc) return null;
  return (
    <IconTemplate
      icon={<RFCIcon />}
      description={t("icon.rfc")}
    />
  )
}

function SourceCode({ script }: { script: KnownScriptInfo }) {
  const { t } = useTranslation("script");
  if (!script.sourceUrl) return null;
  return (
    <IconTemplate
      url={script.sourceUrl}
      icon={<SourceCodeIcon />}
      description={t("icon.code")}
    />
  )
}

function Website({ script }: { script: KnownScriptInfo }) {
  const { t } = useTranslation("script");
  if (!script.website) return null;
  return (
    <IconTemplate
      url={script.website}
      icon={<WebsiteIcon />}
      description={t("icon.website")}
    />
  )
}

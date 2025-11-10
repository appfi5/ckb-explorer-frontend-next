"use client"

import Card from "@/components/Card";
import { useTranslation } from "react-i18next";
import Transaction from "./Transaction";



export default function SnakeCamelCaseSwitch() {
  const { t } = useTranslation("tools");

  return (
    <Card className="py-5 px-10 h-full">
      <div className="text-lg mb-5 font-medium">{t("snake_case_and_camel_case.title")}</div>
      <Transaction />
    </Card>
  )
}
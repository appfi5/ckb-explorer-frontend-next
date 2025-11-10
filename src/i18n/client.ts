"use client";

import { type i18n as I18nInstance } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import resources from "./locales";
import { DEFAULT_LANGUAGE, DEFAULT_NAMESPACE } from "@/i18n/index";

export default function initClientTranslations(
  i18n: I18nInstance,
  locale: string,
) {
  i18n.use(initReactI18next).init({
    lng: locale,
    resources,
    defaultNS: DEFAULT_NAMESPACE,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
  });

  return i18n;
}

"use server";

import { join } from "node:path";
import { createInstance } from "i18next";
import type { DefaultNamespace, Namespace } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import Backend, { type FsBackendOptions } from "i18next-fs-backend";
import { DEFAULT_LANGUAGE, DEFAULT_NAMESPACE, LANGUAGES } from "@/i18n/index";
import resources from "./locales";

const localesPath = join(process.cwd(), "src/i18n/locales");

export default async function initServerTranslations(locale: string) {
  const i18n = createInstance();

  await i18n
    .use(initReactI18next)
    .use(Backend)
    .init<FsBackendOptions>({
      resources,
      lng: locale,
      fallbackLng: DEFAULT_LANGUAGE,
      supportedLngs: LANGUAGES,
      defaultNS: DEFAULT_NAMESPACE,
      preload: LANGUAGES,
      backend: {
        loadPath: join(localesPath, "{{lng}}/{{ns}}.json"),
      },
    });

  return i18n;
}

export async function useServerTranslation<
  Ns extends Namespace | null = DefaultNamespace,
>(locale: string, namespace?: Ns) {
  const i18n = await initServerTranslations(locale);

  for (const ns of [namespace].flat()) {
    if (!ns) continue;
    if (i18n.hasResourceBundle(locale, ns)) continue;
    await i18n.loadNamespaces(ns);
  }

  return {
    t: i18n.getFixedT<Ns>(locale, namespace),
    i18n,
  };
}

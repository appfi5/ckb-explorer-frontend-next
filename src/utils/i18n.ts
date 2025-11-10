"use client"
import i18n from "i18next";
// import { useHistory, useLocation } from 'react-router-dom'
import { initReactI18next, useTranslation } from "react-i18next";
// import en from '../locales/en.json'
// import zh from '../locales/zh.json'
import { includes } from "./array";
import { DEFAULT_LANGUAGE, LANGUAGES } from "@/i18n";
import { usePathname, useRouter } from "next/navigation";

// export const SupportedLngs = ['en', 'zh'] as const
// export type SupportedLng = (typeof SupportedLngs)[number]
export const isSupportedLng = (value: unknown): value is App.Language =>
  includes(LANGUAGES, value);

// export this method for testing
// export const initI18n = async () => {
//   i18n.use(initReactI18next).init({
//     resources: {
//       en,
//       zh,
//     },
//     supportedLngs: LANGUAGES,
//     fallbackLng: 'en',
//     interpolation: {
//       escapeValue: false,
//     },
//   })
// }

// initI18n()

export const useCurrentLanguage = (): App.Language => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language as App.Language;
  if (!LANGUAGES.find(v => v === currentLanguage)) {
    throw new Error(`Not supported language: ${currentLanguage}`);
  }
  return currentLanguage;
};

export const useLanguageText = (payload?: { reverse: boolean }) => {
  const currentLanguage = useCurrentLanguage();
  const { t } = useTranslation();
  if (payload?.reverse) {
    return currentLanguage === "zh"
      ? t("navbar.language_en")
      : t("navbar.language_zh");
  }
  return currentLanguage === "en"
    ? t("navbar.language_en")
    : t("navbar.language_zh");
};

export const useChangeLanguage = () => {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const currentPathname = usePathname();
  const router = useRouter();
  // const { pathname, search } = useLocation()
  // const history = useHistory()

  const changeLanguage = (newLocale: string) => {
    // set cookie for next-i18n-router
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${date.toUTCString()};path=/`;

    // redirect to the new locale path
    if (
      currentLocale === DEFAULT_LANGUAGE // && !i18nConfig.prefixDefault
    ) {
      router.push("/" + newLocale + currentPathname);
    } else {
      router.push(
        currentPathname.replace(`/${currentLocale}`, `/${newLocale}`),
      );
    }

    router.refresh();
  };

  return {
    changeLanguage,
  };
};

export function addI18nPrefix(url: string, lng?: string) {
  if (lng == null || !url.startsWith("/")) return url;

  return `/${lng}${url}`;
}

export function removeI18nPrefix(url: string) {
  const prefix = LANGUAGES.find((lng) => url.startsWith(`/${lng}`));
  if (prefix == null) return url;

  return url.slice(prefix.length + 1);
}

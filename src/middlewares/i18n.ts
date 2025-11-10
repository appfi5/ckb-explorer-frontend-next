import type { Config } from "next-i18n-router/dist/types";

import { i18nRouter } from "next-i18n-router";
import { DEFAULT_LANGUAGE, LANGUAGES } from "@/i18n";

const config: Config = {
  locales: LANGUAGES,
  defaultLocale: DEFAULT_LANGUAGE,
  prefixDefault: false,
  localeDetector: false
};

export const i18nMiddleware: App.Middleware = (request) => {
  return i18nRouter(request, config);
};

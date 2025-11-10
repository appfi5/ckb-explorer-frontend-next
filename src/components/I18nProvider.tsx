"use client";

import type { FC, ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import initTranslations from "@/i18n/client";
import i18n from "i18next";

type TranslationsProviderProps = {
  children: ReactNode;
  locale: string;
};

const TranslationsProvider: FC<TranslationsProviderProps> = (props) => {
  const { children, locale } = props;

  initTranslations(i18n, locale);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default TranslationsProvider;

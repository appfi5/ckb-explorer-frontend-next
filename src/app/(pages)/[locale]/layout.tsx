import "@/styles/global.css";

import { type Metadata, type Viewport } from "next";
import { LANGUAGES } from "@/i18n";
import TranslationsProvider from "@/components/I18nProvider";
import { env } from "@/env";
import { Suspense } from "react";
import KBar from "@/components/KBar";
import { isMainnet } from "@/utils/chain";
import Page from "@/components/Page";
import TanstackClientProvider from "@/components/tanstackProvider";
import Toast from "@/components/Toast";
import { getThemeFromCookie } from "@/utils/tool.server";
import { ThemeProvider, type Theme } from "@/components/Theme";
import fonts from "@/styles/fonts";
import ClientRoot from "./root.client";
import ClientKBarProvider from "@/components/KBar/Provider";
import { Toaster } from "@/components/shadcn/sonner";

export const metadata: Metadata = {
  title: "CKB Explorer",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const viewport: Viewport = {
  width: "device-width, shrink-to-fit=no",
  initialScale: 1,
  maximumScale: 1,
}

export function generateStaticParams() {
  return LANGUAGES.map((locale) => ({ locale }));
}


type LayoutParallels = "header" | "footer";

const fontClasses = Object.values(fonts).map((font) => font.variable).join(" ");

const appStyle = {
  width: "100vw",
  height: "100vh",
  maxWidth: "100%",
};

const RootLayout: App.LayoutWithParallel<LayoutParallels> = async (props) => {
  const { header, footer } = props;
  const { locale } = await props.params;
  const theme = await getThemeFromCookie();
  return (
    <html lang={locale} className={fontClasses} data-theme={theme} data-chain-type={env.NEXT_PUBLIC_CHAIN_TYPE} translate="no">
      <body data-chain-type={env.NEXT_PUBLIC_CHAIN_TYPE} >
        <ClientRoot />
        <ThemeProvider initTheme={theme as Theme}>
          <ClientKBarProvider>
            <div id="root" style={appStyle} data-net={isMainnet() ? 'mainnet' : 'testnet'}>
              {/* <QueryClientProvider client={queryClient}> */}
              <Page>
                <Suspense>
                  <TranslationsProvider locale={locale}>
                    <TanstackClientProvider>
                      {header}
                      {props.children}
                      {footer}
                      <KBar />
                      <Toast />
                      <Toaster />
                    </TanstackClientProvider>
                  </TranslationsProvider>
                </Suspense>
              </Page>
            </div>
          </ClientKBarProvider>
        </ThemeProvider>
        {/* </QueryClientProvider> */}
      </body>
    </html>
  );
};

export default RootLayout;

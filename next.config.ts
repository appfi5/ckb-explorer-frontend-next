/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import type { NextConfig } from "next";
import "./src/env";
import I18nResourcePlugin from "./plugins/i18n-resource";

const dataUrlEndpoints = [
  process.env.NEXT_PUBLIC_UTILITY_ENDPOINT || "https://ckb-utilities.random-walk.co.jp",
  process.env.NEXT_PUBLIC_DOB_DECODER_MAINNET_URL || "https://dob-decoder.rgbpp.io",
  process.env.NEXT_PUBLIC_DOB_DECODER_TESTNET_URL || "https://dob0-decoder-dev.omiga.io",
  process.env.NEXT_PUBLIC_API_OMIGA_URL || "https://api.omiga.io",
  process.env.NEXT_PUBLIC_TEST_API_OMIGA_URL || "https://test-api.omiga.io",
  process.env.NEXT_PUBLIC_CKBFS_URL || "https://ckbfs.nvap.app",
  process.env.NEXT_PUBLIC_TEST_BESCARD_URL || "https://bescard.com,https://test.bescard.com",
];
const explorerUrl = `${process.env.NEXT_PUBLIC_EXPLORER_SERVICE_URL} ${process.env.NEXT_PUBLIC_CHAIN_NODE} ${process.env.NEXT_PUBLIC_PROB_NODE} ${dataUrlEndpoints.join(" ")}`.replaceAll(",", ' ');


/** @type {import("next").NextConfig} */
const config: NextConfig = {
  output: "standalone",
  typescript: {
    // TODO: Fix all TypeScript errors before uncommenting ignoreBuildErrors
    // ignoreBuildErrors: true,
  },
  sassOptions: {
    additionalData: `@use "~@/styles/theme.scss";`,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline' ${process.env.NODE_ENV === "development" ? "'unsafe-eval'" : ""} https://vercel.live`,
              "style-src 'self' 'unsafe-inline'",
              `img-src ${process.env.NODE_ENV === "development" ? "*" : "https:"} data:`,
              `connect-src 'self' ${explorerUrl}`,
              "font-src 'self'",
              "frame-src https://vercel.live",
              "object-src 'none'",
            ].join("; "),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          { key: "X-Powered-By", value: "" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
  webpack(config, { nextRuntime, isServer }) {
    if (!isServer) {
      config.output.filename = (pathData: any) => {
        // 替换 chunk 文件名中的 @ 为 _
        const name = String(pathData.chunk.name || pathData.chunk.id);
        return `static/chunks/${name.replace(/@/g, "_")}-[chunkhash].js`;
      };
    }

    if (nextRuntime === "nodejs") {
      config.plugins.push(
        new I18nResourcePlugin({
          entry: "./src/i18n/locales",
        }),
      );
    }

    // 自动驼峰, .aa-bb => .aa-bb/.aaBb
    config.module.rules
      .find((rule: any) => rule.oneOf)
      .oneOf.filter((ruleSet: any) => JSON.stringify(ruleSet.use)?.includes("css-loader"))
      .reduce((allLoaders: any[], ruleSet: any) => allLoaders.concat(ruleSet.use), [])
      .forEach((loader: any) => {
        if (loader.options && loader.options.modules) {
          loader.options.modules.exportLocalsConvention = "camelCase";
        }
      });
    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.(".svg"),
    );
    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        // resourceQuery: /url/, // *.svg?url
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /component/] },
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        // resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        resourceQuery: /component/, // *.svg?component
        use: [{
          loader: "@svgr/webpack",
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false,
                    },
                  },
                },
                "prefixIds"
              ],
            }
          }
        }],
      },
    );
    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;
    return config;
  },
  // rewrites: process.env.NODE_ENV === "development" ? async function () {
  //   return [
  //     {
  //       source: "/api/:path*",
  //       destination: `${process.env.NEXT_PUBLIC_EXPLORER_SERVICE_URL}/api/:path*`,
  //     },
  //   ];
  // } : undefined,
  // compiler: {
  //   removeConsole: IS_PROD ? { exclude: ["error"] } : false,
  // }
};

export default config;

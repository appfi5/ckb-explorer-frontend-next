/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import type { NextConfig } from "next";
import "./src/env";
import I18nResourcePlugin from "./plugins/i18n-resource";

/** @type {import("next").NextConfig} */
const config: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  sassOptions: {
    additionalData: `@use "~@/styles/theme.scss";`,
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
      .find(({ oneOf }) => !!oneOf)
      .oneOf.filter(({ use }) => JSON.stringify(use)?.includes("css-loader"))
      .reduce((allLoaders, { use }) => allLoaders.concat(use), [])
      .forEach((loader) => {
        if (loader.options && loader.options.modules) {
          loader.options.modules.exportLocalsConvention = "camelCase";
        }
      });
    const fileLoaderRule = config.module.rules.find((rule) =>
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

  // compiler: {
  //   removeConsole: IS_PROD ? { exclude: ["error"] } : false,
  // }
};

export default config;

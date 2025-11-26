import { type MetadataRoute } from 'next';
import { disallowPaths, getSiteUrl } from '~/sitemap-robots.config.js';
import { env } from "@/env";

const isProductionOrTestnet = env.NEXT_PUBLIC_CHAIN_TYPE === 'mainnet' || env.NEXT_PUBLIC_CHAIN_TYPE === 'testnet';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: isProductionOrTestnet ? ['/'] : [],
        disallow: isProductionOrTestnet ? disallowPaths : ['/'],
      },
    ],
    sitemap: isProductionOrTestnet ? `${siteUrl}/sitemap.xml` : undefined,
  };
}
import { type MetadataRoute } from 'next';
import { disallowPaths, getSiteUrl } from '~/sitemap-robots.config.js';
import { env } from "@/env";

const isProduction = env.NEXT_PUBLIC_CHAIN_TYPE === 'mainnet' || env.NEXT_PUBLIC_CHAIN_TYPE === 'testnet';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: isProduction ? ['/'] : [],
        disallow: isProduction ? disallowPaths : ['/'],
      },
    ],
    sitemap: isProduction ? `${siteUrl}/sitemap.xml` : undefined,
  };
}
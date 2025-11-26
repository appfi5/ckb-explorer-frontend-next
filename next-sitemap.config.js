import { disallowPaths, getSiteUrl } from './sitemap-robots.config.js';

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: getSiteUrl(), // 调用导入的 getSiteUrl 函数（动态域名）
  exclude: disallowPaths, // 复用统一配置的禁止路径
  sitemapSize: 5000,
  outDir: 'public', // 输出到 public 目录（Vercel 自动部署）
  generateRobotsTxt: false, // 禁用插件生成 robots（用动态 robots.ts）
  trailingSlash: false, // 按需调整：是否给 URL 加末尾斜杠
};

export default config;

// 禁止路径
export const disallowPaths = [
    '/_next/*',
    '/api/*',  
    '/404',
    '/500',
    '/robots.txt',
    '/sitemap.xml',
    '/sitemap-*.xml',
    '/sitemap-index.xml',
    '/sitemap-*.xml.gz',
    '/sitemap-*.xml.br',
    '/sitemap-*.xml.zip',
    '/sitemap-*.xml.7z',
    '/sitemap-*.xml.tar',
];

export function getSiteUrl() {
    const chainType = process.env.NEXT_PUBLIC_CHAIN_TYPE;
    if (chainType === 'testnet') {
        return process.env.NEXT_PUBLIC_TESTNET_URL || 'https://testnet.explorer.app5.org';
    }
    if (chainType === 'mainnet') {
        return process.env.NEXT_PUBLIC_MAINNET_URL || 'https://explorer.app5.org';
    }
    return 'http://localhost:3000';
}
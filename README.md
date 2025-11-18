<h1 align="center">CKB Explorer</h1>


[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/appfi5/ckb-explorer-frontend-next/blob/develop/COPYING)


CKB Explorer is a blockchain explorer for [Nervos CKB](https://github.com/nervosnetwork/ckb), built with modern web technologies. It consists of two parts:

- [CKB Explorer Frontend](https://github.com/appfi5/ckb-explorer-frontend-next) (This repository)
- [CKB Explorer Server](https://github.com/appfi5/ckb-explorer-web)

Visit the live explorer at [explorer.nervos.org](https://explorer.nervos.org).

## Features

- **Blockchain Exploration**

  - Browse blocks, transactions, addresses and lock hashes
  - Track transaction lifecycle and UTXO details
  - Advanced search functionality for various blockchain entities
  - Real-time updates and data synchronization

- **Bitcoin Interoperability**

  - Support for Bitcoin addresses and corresponding RGB++ transactions
  - Cross-chain transaction tracking
  - BTC-CKB leap monitoring

- **Fiber Network Integration**

  - Network statistics and metrics
  - Channel management and monitoring
  - Liquidity tracking and analysis

- **User Experience**
  - Responsive design for all devices
  - Multi-language support (English, Chinese)
  - Distinct themes for Mainnet and Testnet
  - Intuitive navigation and data visualization

## Getting Started

### Prerequisites

- Node.js v20.10.0 or later
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/appfi5/ckb-explorer-frontend-next.git

# Navigate to project directory
cd ckb-explorer-frontend

# Install dependencies
npm install
```

### Configuration

Create or modify the environment files:

- `.env.development` for development

```env
# Required environment variables
NEXT_PUBLIC_API_URL='http://your-api-url'        # API endpoint
NEXT_PUBLIC_CHAIN_TYPE=testnet              # 'mainnet' or 'testnet'
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build
```

## Community

<!-- - Join our [Discord](https://discord.gg/UYcWCzK9) for discussions -->
- Follow us on [Twitter](https://twitter.com/NervosNetwork)
- Read our [Documentation](https://docs.nervos.org)

## License

CKB Explorer Frontend is released under the MIT License. See [COPYING](COPYING) for more information or see [https://opensource.org/licenses/MIT](https://opensource.org/licenses/MIT).

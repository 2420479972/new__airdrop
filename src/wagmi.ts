import { http, createConfig, createStorage } from '@wagmi/vue'
import { bsc,bscTestnet,localhost } from '@wagmi/vue/chains'
import { coinbaseWallet, walletConnect } from '@wagmi/vue/connectors'

import { type Chain } from 'viem'
export const ZMnet = {
  id: 7156778,
  name: 'ZHAOMEI',
  nativeCurrency: { name: 'ZHAOMEI', symbol: 'ZM', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://jpchain.egoistmusic.top'] },
  },
  blockExplorers: {
    default: { name: 'ZHAOMEIscan', url: 'https://jpexplorer.egoistmusic.top' },
  }
} as const satisfies Chain

export const DEVnet = {
  id: 31337,
  name: 'ZHAOMEI',
  nativeCurrency: { name: 'ZHAOMEI', symbol: 'ZM', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
  }
} as const satisfies Chain

export const config = createConfig({
  chains: [
    // ZMnet,
    // bsc,
    bscTestnet
    // ,localhost,DEVnet
  ],
  connectors: [
    coinbaseWallet({ appName: 'Vite Vue Playground', darkMode: true }),
  ],
  storage: createStorage({ storage: localStorage, key: 'vite-vue' }),
  transports: {
    // [ZMnet.id]: http(),
    // [bsc.id]: http(),
    [bscTestnet.id]: http(),
    // [DEVnet.id]: http(),
  },
})


declare module '@wagmi/vue' {
  interface Register {
    config: typeof config
  }
}

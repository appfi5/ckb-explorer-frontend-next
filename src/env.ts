import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_EXPLORER_SERVICE_URL: z.string().url(),
    NEXT_PUBLIC_CHAIN_TYPE: z.enum(["testnet", "mainnet"]),
    // NEXT_PUBLIC_NODE_ENV: z.enum(["development", "test", "production"]).default('development'),
    NEXT_PUBLIC_BASE_URL: z.string().optional(),
    NEXT_PUBLIC_TESTNET_URL: z.string(),
    NEXT_PUBLIC_MAINNET_URL: z.string(),
    NEXT_PUBLIC_CHAIN_NODE: z.string(),
    NEXT_PUBLIC_PROB_NODE: z.string(),
    // todo confirm
    // NEXT_PUBLIC_BTC_TESTNET_IDENTIFIER: z.string().optional(),
    NEXT_PUBLIC_BITCOIN_EXPLORER: z.string().optional(),
    NEXT_PUBLIC_DID_INDEXER_URL: z.string().optional(),
    // todo remove
    NEXT_PUBLIC_API_URL: z.string().url().optional(),
    // NEXT_PUBLIC_METRICS_API_URL: z.string().optional(),
    NEXT_PUBLIC_SSRI_RPC_URL: z.string().optional(),
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    // NEXT_PUBLIC_BACKUP_NODES: z.string().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_EXPLORER_SERVICE_URL: process.env.NEXT_PUBLIC_EXPLORER_SERVICE_URL,
    NEXT_PUBLIC_CHAIN_TYPE: process.env.NEXT_PUBLIC_CHAIN_TYPE,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_TESTNET_URL: process.env.NEXT_PUBLIC_TESTNET_URL,
    NEXT_PUBLIC_MAINNET_URL: process.env.NEXT_PUBLIC_MAINNET_URL,
    NEXT_PUBLIC_CHAIN_NODE: process.env.NEXT_PUBLIC_CHAIN_NODE,
    NEXT_PUBLIC_PROB_NODE: process.env.NEXT_PUBLIC_PROB_NODE,
    // todo confirm
    // NEXT_PUBLIC_BTC_TESTNET_IDENTIFIER: process.env.NEXT_PUBLIC_BTC_TESTNET_IDENTIFIER!,
    NEXT_PUBLIC_BITCOIN_EXPLORER: process.env.NEXT_PUBLIC_BITCOIN_EXPLORER,
    NEXT_PUBLIC_DID_INDEXER_URL: process.env.NEXT_PUBLIC_DID_INDEXER_URL,
    // todo remove
    NEXT_PUBLIC_API_URL: "",
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
    // NEXT_PUBLIC_METRICS_API_URL: process.env.NEXT_PUBLIC_METRICS_API_URL,
    NEXT_PUBLIC_SSRI_RPC_URL: "", // process.env.NEXT_PUBLIC_SSRI_RPC_URL,
    // NEXT_PUBLIC_BACKUP_NODES: process.env.NEXT_PUBLIC_BACKUP_NODES,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});

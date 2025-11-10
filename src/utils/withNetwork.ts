import { env } from "@/env";



export function withNetwork<T>(config: Record<typeof env.NEXT_PUBLIC_CHAIN_TYPE, T>, defaultValue: T) {
  return config[env.NEXT_PUBLIC_CHAIN_TYPE] || defaultValue;
}

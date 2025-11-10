




export const isTxHash = (hash: string) =>
  /^(0x)?[0-9a-fA-F]{64}$/.test(hash);

import { useQuery } from "@tanstack/react-query";
import { getDasAccount } from "@/services/DidService";
import { isMainnet } from "@/utils/chain";

export default function useDASAccount(address: string) { 
  const { data: dasAccount } = useQuery({
    queryKey: ['ckb_das_account', address],
    queryFn: async () => {
      if(!isMainnet()) return null
      const dasAccount = await getDasAccount(address)
      return dasAccount
    },
  })
  return dasAccount
}
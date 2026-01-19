
import { useQuery } from "@tanstack/react-query";
import { getDasAccount } from "@/services/DidService";

export default function useDASAccount(address: string) { 
  const { data: dasAccount } = useQuery({
    queryKey: ['ckb_das_account', address],
    queryFn: async () => {
      const dasAccount = await getDasAccount(address)
      return dasAccount
    },
  })
  return dasAccount
}
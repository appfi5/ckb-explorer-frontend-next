import { useSearchParams } from "@/hooks"
import { LayoutLiteProfessional } from '@/constants/common'
const { Professional, Lite } = LayoutLiteProfessional


export function useTxLaytout() {
  const searchParams = useSearchParams('layout')
  const layout = searchParams.layout === Lite ? Lite : Professional
  return layout;
}
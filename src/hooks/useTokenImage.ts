import { useQuery } from "@tanstack/react-query";
import { getSporeImg, resolveImageUrl, SPORE_PlACEHOLDER_IMG } from "@/utils/spore";


type Config = {
  type: string; // 
  data?: string;
  /** collection type hash */
  clusterId?: string | number,
  tokenId?: string;
}

export default function useTokenImage({ type, data: dataOrUrl, clusterId, tokenId }: Config) {

  const { data: imageDataOrUrl, isLoading } = useQuery({
    queryKey: ['token_image', type, clusterId, tokenId],
    queryFn: async () => {
      if (type === "spore") {
        return getSporeImg({ id: tokenId!, data: dataOrUrl });
      }
      const resImg = await resolveImageUrl(dataOrUrl)
      return resImg;
    },
    enabled: !!dataOrUrl,
  })
  return {
    data: imageDataOrUrl || SPORE_PlACEHOLDER_IMG,
    isLoading
  }
}
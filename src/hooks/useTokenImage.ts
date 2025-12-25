import { useQuery } from "@tanstack/react-query";
import { getSporeImg } from "@/utils/spore";


type Config = {
  type: string; // 
  data?: string;
  /** collection type hash */
  clusterId?: string | number,
  tokenId?: string;
}
const SPORE_PlACEHOLDER_IMG = "/images/spore_placeholder.svg";
const LOAD_FAILED_IMG = "/images/image_failed.svg"

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

const resolveImageUrl = (url?: string) => new Promise<string>((r) => {
  if (!url) {
    r(LOAD_FAILED_IMG);
    return;
  }
  const img = new Image();
  img.onload = () => r(url);
  img.onerror = () => r(LOAD_FAILED_IMG);
  img.src = url;
})
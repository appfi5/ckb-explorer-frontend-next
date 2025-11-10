import Image, { type StaticImageData } from "next/image";
import type { ComponentProps } from "react";


type InteImageProp = Omit<ComponentProps<typeof Image>, "alt" | "src"> & {
  src: string | StaticImageData | undefined
  alt?: string
}


export default function InteImage(props: InteImageProp) {
  const { src, alt = "", ...restProps } = props;
  if (!src) return null;
  if (typeof src === 'string') {
    return <img src={src} alt={alt} {...restProps} />
  }

  return <Image src={src} alt={alt} {...restProps} />
}
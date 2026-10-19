import type { ImgHTMLAttributes } from "react";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  asset: string;
  sizes: string;
  widths?: number[];
};

export default function ResponsiveImage({ asset, sizes, widths = [256, 512, 768], ...image }: Props) {
  return <picture>
    <source type="image/avif" srcSet={widths.map(width => `/images/optimized/${asset}-${width}.avif ${width}w`).join(", ")} sizes={sizes} />
    <source type="image/webp" srcSet={widths.map(width => `/images/optimized/${asset}-${width}.webp ${width}w`).join(", ")} sizes={sizes} />
    <img {...image} sizes={sizes} decoding="async" />
  </picture>;
}

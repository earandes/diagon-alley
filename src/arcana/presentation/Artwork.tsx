import { useState } from 'react';
import type { Language } from '../domain/collection/wizards';
import { visualAsset } from './content-packs/art';
export function Artwork({
  asset,
  language,
  className = '',
  decorative = false,
  eager = false,
  fallbackAsset,
}: {
  asset: string;
  language: Language;
  className?: string;
  decorative?: boolean;
  eager?: boolean;
  fallbackAsset?: string;
}) {
  const primary = visualAsset(asset);
  const fallback = fallbackAsset ? visualAsset(fallbackAsset) : null;
  const [failedUrls, setFailedUrls] = useState<readonly string[]>([]);
  const image =
    primary && !failedUrls.includes(primary.url)
      ? primary
      : fallback && !failedUrls.includes(fallback.url)
        ? fallback
        : null;
  if (!image) return null;
  return (
    <img
      src={image.url}
      width={image.width}
      height={image.height}
      alt={decorative ? '' : image.alt[language]}
      aria-hidden={decorative || undefined}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() =>
        setFailedUrls((urls) => (urls.includes(image.url) ? urls : [...urls, image.url]))
      }
      data-art={image === primary ? asset : fallbackAsset}
    />
  );
}

import { useState } from 'react';
import type { Language } from '../domain/collection/wizards';
import { visualAsset } from './content-packs/art';
export function Artwork({
  asset,
  language,
  className = '',
  decorative = false,
  eager = false,
}: {
  asset: string;
  language: Language;
  className?: string;
  decorative?: boolean;
  eager?: boolean;
}) {
  const image = visualAsset(asset);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  if (!image || failedUrl === image.url) return null;
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
      onError={() => setFailedUrl(image.url)}
      data-art={asset}
    />
  );
}

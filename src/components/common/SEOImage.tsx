/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface SEOImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  title?: string;
  storeName?: string;
  location?: string;
  aspectRatio?: 'square' | 'video' | 'banner' | 'auto';
  className?: string;
  fallbackSrc?: string;
}

export default function SEOImage({
  src,
  alt,
  title,
  storeName,
  location,
  aspectRatio = 'auto',
  className = '',
  fallbackSrc = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=80',
  ...rest
}: SEOImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Build rich descriptive alt text for Search Engines and AI Vision models
  let dynamicAlt = alt;
  if (storeName && !alt.includes(storeName)) {
    dynamicAlt += ` - ${storeName}`;
  }
  if (location && !dynamicAlt.includes(location)) {
    dynamicAlt += ` (${location})`;
  }
  if (!dynamicAlt.includes('TamPazar')) {
    dynamicAlt += ' | TamPazar %0 Komisyon';
  }

  // Aspect Ratio CLS prevention class
  let aspectClass = '';
  if (aspectRatio === 'square') aspectClass = 'aspect-square object-cover';
  else if (aspectRatio === 'video') aspectClass = 'aspect-video object-cover';
  else if (aspectRatio === 'banner') aspectClass = 'aspect-[3/1] object-cover';

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={dynamicAlt}
      title={title || dynamicAlt}
      loading="lazy"
      decoding="async"
      onError={handleError}
      className={`${aspectClass} ${className}`}
      {...rest}
    />
  );
}

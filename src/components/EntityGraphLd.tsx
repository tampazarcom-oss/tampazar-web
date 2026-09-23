/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface EntityGraphProps {
  product: {
    slug: string;
    title: string;
    description: string;
    image: string;
    price: number;
    isService?: boolean;
  };
  store: {
    slug: string;
    name: string;
    legalTitle?: string;
    phone: string;
    address: string;
    district: string;
    city: string;
    lat?: number;
    lng?: number;
  };
}

// Google Botu için tam düğüm (Node-based) Varlık Grafiği
export function generateEntityGraphLd({ product, store }: EntityGraphProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      // 1. DÜKKÂN / YEREL ESNAF (LocalBusiness)
      {
        '@type': 'LocalBusiness',
        '@id': `https://tampazar.com/magaza/${store.slug}#entity`,
        name: store.name,
        legalName: store.legalTitle || store.name,
        telephone: store.phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: store.address,
          addressLocality: store.district,
          addressRegion: store.city,
          addressCountry: 'TR',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: store.lat || 40.9833,
          longitude: store.lng || 37.8833,
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: `${store.name} Ürün ve Hizmetleri`,
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@id': `https://tampazar.com/urun/${product.slug}#product`,
              }
            }
          ]
        }
      },

      // 2. ÜRÜN / HİZMET (Product / Service)
      {
        '@type': product.isService ? 'Service' : 'Product',
        '@id': `https://tampazar.com/urun/${product.slug}#product`,
        name: product.title,
        description: product.description,
        image: product.image,
        provider: {
          '@id': `https://tampazar.com/magaza/${store.slug}#entity`,
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'TRY',
          price: product.price,
          availability: 'https://schema.org/InStock',
          seller: {
            '@id': `https://tampazar.com/magaza/${store.slug}#entity`,
          }
        }
      },

      // 3. E-E-A-T GÜVENİLİRLİK VE KOMİSYONSUZ ŞEFFAFLIK ŞEMASI
      {
        '@type': 'WebSite',
        '@id': 'https://tampazar.com/#website',
        url: 'https://tampazar.com',
        name: 'tampazar.com',
        description: 'Komisyonsuz Açık Dijital AVM ve Ticaret Platformu',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://tampazar.com/ara?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

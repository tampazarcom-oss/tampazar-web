/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ProductSeoProps {
  product: {
    id: string;
    slug?: string;
    title: string;
    description: string;
    price: number;
    currency?: string;
    vatRate?: number;
    stock?: number;
    images: { url: string; alt: string }[] | string[];
    type?: 'PHYSICAL' | 'SERVICE' | 'WHOLESALE';
    category: string;
    sku?: string;
  };
  store: {
    name: string;
    slug?: string;
    phone: string;
    address?: string;
    city: string;
    district?: string;
    websiteUrl?: string;
    paymentProvider?: string;
  };
}

export default function SemanticSeoHead({ product, store }: ProductSeoProps) {
  const slug = product.slug || product.id;
  const storeSlug = store.slug || store.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const canonicalUrl = `https://tampazar.com/urun/${slug}`;
  const storeUrl = `https://tampazar.com/magaza/${storeSlug}`;

  const formattedImages = product.images.map(img => typeof img === 'string' ? { url: img, alt: product.title } : img);

  // 1. Google & AI İçin Genişletilmiş Schema.org Yapısı
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      // Ürün/Hizmet Şeması
      {
        '@type': product.type === 'SERVICE' ? 'Service' : 'Product',
        '@id': `${canonicalUrl}#object`,
        name: product.title,
        description: product.description,
        image: formattedImages.map((img) => img.url),
        sku: product.sku || product.id,
        category: product.category,
        brand: {
          '@type': 'Brand',
          name: store.name,
        },
        offers: {
          '@type': 'Offer',
          url: canonicalUrl,
          priceCurrency: product.currency || 'TRY',
          price: product.price,
          priceValidUntil: '2027-12-31',
          availability: (product.stock ?? 10) > 0 
            ? 'https://schema.org/InStock' 
            : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: {
            '@id': `${storeUrl}#seller`,
          },
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: 'TR',
            returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
            merchantReturnDays: 14,
            returnMethod: 'https://schema.org/ReturnByMail',
          }
        },
      },
      // Satıcı / Açık Esnaf Yerel İşletme Şeması
      {
        '@type': 'LocalBusiness',
        '@id': `${storeUrl}#seller`,
        name: store.name,
        telephone: store.phone,
        url: storeUrl,
        address: {
          '@type': 'PostalAddress',
          streetAddress: store.address || store.city,
          addressLocality: store.district || store.city,
          addressRegion: store.city,
          addressCountry: 'TR',
        },
        paymentAccepted: `Doğrudan Kendi Sanal POS'u (${store.paymentProvider || 'Kurumsal Banka'}), Kredi Kartı, Havale`,
        currenciesAccepted: 'TRY',
      },
    ],
  };

  return (
    <>
      {/* Standart Meta & OpenGraph */}
      <title>{`${product.title} - ${store.name} | tampazar.com`}</title>
      <meta name="description" content={`${product.title}. ${store.city} ${store.name} güvencesiyle doğrudan üreticisinden komisyonsuz satış.`} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Yapay Zeka Botları (Perplexity, GPTBot, Google-Extended) İçin İzinler */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      
      {/* OpenGraph & Twitter Cards */}
      <meta property="og:title" content={product.title} />
      <meta property="og:description" content={product.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="tampazar.com" />
      <meta property="og:type" content="product" />
      {formattedImages[0] && <meta property="og:image" content={formattedImages[0].url} />}

      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MerchantProduct {
  id: string;
  title: string;
  description: string;
  link: string;
  image: string;
  price: string;
  availability: string;
  brand: string;
  condition: string;
  city: string;
  shippingCountry: string;
  shippingPrice: string;
}

/**
 * Google Merchant Center için canlı XML akışı üretici
 */
export function generateGoogleMerchantXml(products?: MerchantProduct[]): string {
  const host = 'https://tampazar.com';
  
  const sampleProducts: MerchantProduct[] = products && products.length > 0 ? products : [
    {
      id: 'TPZ-1001',
      title: 'Kuzey Teknik Termal Kameralı Su Kaçağı Tespiti Hizmeti',
      description: 'Ordu ve Karadeniz genelinde kırmadan termal cihazla noktasal kaçak tespiti.',
      link: `${host}/urun/termal-su-kacagi-tespiti`,
      image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800',
      price: '1200.00 TRY',
      availability: 'in_stock',
      brand: 'Kuzey Teknik',
      condition: 'new',
      city: 'Ordu',
      shippingCountry: 'TR',
      shippingPrice: '0.00 TRY'
    }
  ];

  const xmlItems = sampleProducts.map((p) => `
    <item>
      <g:id>${p.id}</g:id>
      <g:title><![CDATA[${p.title}]]></g:title>
      <g:description><![CDATA[${p.description}]]></g:description>
      <g:link>${p.link}</g:link>
      <g:image_link>${p.image}</g:image_link>
      <g:price>${p.price}</g:price>
      <g:availability>${p.availability}</g:availability>
      <g:brand><![CDATA[${p.brand}]]></g:brand>
      <g:condition>${p.condition}</g:condition>
      <g:shipping>
        <g:country>${p.shippingCountry}</g:country>
        <g:price>${p.shippingPrice}</g:price>
      </g:shipping>
    </item>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
    <channel>
      <title>tampazar.com Google Shopping & Merchant Graph</title>
      <link>${host}</link>
      <description>Komisyonsuz doğrudan esnaf ve üretici ürünleri</description>
      ${xmlItems}
    </channel>
  </rss>`;
}

import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { initialProducts, initialTenants, Product } from './src/data/mockData.js';
import { staticBlogPosts } from './src/data/blogData.js';
import { encryptSecret } from './src/utils/cryptoSecurity.js';

const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

async function startServer() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // =========================================================================
  // 1. GÜVENLİK VE BAŞLIK MİDDEWARE'LERİ (Security Headers)
  // =========================================================================
  app.use((req: Request, res: Response, next: NextFunction) => {
    // HTTP -> HTTPS Redirect (Üretim Ortamında)
    if (isProd && req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }

    // Güvenlik Başlıkları
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    if (req.headers['x-forwarded-proto'] === 'https' || isProd) {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }

    next();
  });

  // =========================================================================
  // 2. KESİN XML SITEMAP & TXT ENDPOINT'LERİ (Valid XML / UTF-8 Text)
  // =========================================================================
  const publicDir = path.resolve(process.cwd(), 'public');

  app.get('/sitemap*.xml', (req: Request, res: Response) => {
    const filename = req.path.replace('/', '');
    const filePath = path.join(publicDir, filename);

    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      return res.status(200).sendFile(filePath);
    }

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    return res.status(404).send(`<?xml version="1.0" encoding="UTF-8"?><error>Sitemap ${filename} bulunamadı.</error>`);
  });

  app.get(['/robots.txt', '/llms.txt', '/llms-full.txt'], (req: Request, res: Response) => {
    const filename = req.path.replace('/', '');
    const filePath = path.join(publicDir, filename);

    if (fs.existsSync(filePath)) {
      const contentType = filename.endsWith('.txt') ? 'text/plain; charset=utf-8' : 'text/markdown; charset=utf-8';
      res.setHeader('Content-Type', contentType);
      return res.status(200).sendFile(filePath);
    }

    return res.status(404).send('Dosya bulunamadı.');
  });

  // =========================================================================
  // 3. SUNUCU TARAFLI HESAPLAMA & GÜVENLİ API ENDPOINT'LERİ
  // =========================================================================

  /**
   * Sunucuda Yeniden Fiyat, KDV ve Kargo Hesaplama API
   * İstemciden gelen fiyatlar asla güvenilir kabul edilmez!
   */
  app.post('/api/orders/calculate', (req: Request, res: Response) => {
    try {
      const { items, deliveryType } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Geçersiz sipariş kalemi.' });
      }

      let subtotalClean = 0;
      let totalVatAmount = 0;
      const verifiedItems = [];

      for (const item of items) {
        // Sunucu veritabanındaki (mockData) orijinal ürünü bul
        const product = initialProducts.find(p => p.id === item.productId || p.slug === item.productSlug);
        if (!product) {
          return res.status(404).json({ error: `Ürün bulunamadı: ${item.productId || item.productSlug}` });
        }

        const qty = Math.max(1, parseInt(item.qty, 10) || 1);

        // Kademeli toptan fiyatlama kontrolü
        let unitPrice = product.price;
        if (product.type === 'wholesale' && product.tieredPrices && product.tieredPrices.length > 0) {
          const matchedTier = product.tieredPrices.find(t => qty >= t.minQty && (t.maxQty === null || qty <= t.maxQty));
          if (matchedTier) unitPrice = matchedTier.pricePerUnit;
        }

        const lineTotal = unitPrice * qty;
        const vatRate = product.vatRate || 20;
        const lineVat = parseFloat(((lineTotal * vatRate) / (100 + vatRate)).toFixed(2));
        const lineClean = parseFloat((lineTotal - lineVat).toFixed(2));

        subtotalClean += lineClean;
        totalVatAmount += lineVat;

        verifiedItems.push({
          productId: product.id,
          title: product.title,
          sku: product.sku,
          unitPrice,
          qty,
          vatRate,
          lineVat,
          lineTotal
        });
      }

      // Kargo / Teslimat Ücreti Hesaplama
      let deliveryFee = 0;
      if (deliveryType === 'LOCAL_EXPRESS') {
        deliveryFee = 49.90; // Sabit kurye ücreti
      } else if (deliveryType === 'CARGO' && subtotalClean < 1000) {
        deliveryFee = 39.90; // 1000 TL altı kargo ücreti
      }

      const totalPayable = parseFloat((subtotalClean + totalVatAmount + deliveryFee).toFixed(2));

      return res.status(200).json({
        success: true,
        summary: {
          subtotalClean: parseFloat(subtotalClean.toFixed(2)),
          totalVatAmount: parseFloat(totalVatAmount.toFixed(2)),
          deliveryFee,
          totalPayable,
          currency: 'TRY'
        },
        items: verifiedItems,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Hesaplama hatası: ' + err.message });
    }
  });

  /**
   * Sanal POS Anahtarlarını AES-256-GCM ile Şifreleme API
   */
  app.post('/api/stores/:storeId/pos/connect', async (req: Request, res: Response) => {
    try {
      const { storeId } = req.params;
      const { provider, apiKey, secretKey } = req.body;

      if (!storeId || !provider || !apiKey || !secretKey) {
        return res.status(400).json({ error: 'Eksik POS parametreleri.' });
      }

      const encryptedApiKey = await encryptSecret(apiKey);
      const encryptedSecretKey = await encryptSecret(secretKey);

      return res.status(200).json({
        success: true,
        message: `${provider.toUpperCase()} Sanal POS altyapınız başarıyla bağlandı. Müşteri ödemeleri doğrudan hesabınıza aktarılacaktır.`,
        data: {
          storeId,
          provider,
          encryptedApiKey,
          encryptedSecretKey,
          connectedAt: new Date().toISOString()
        }
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'POS kaydı hatası: ' + err.message });
    }
  });

  // =========================================================================
  // 4. VITE MIDDLEWARE VE SSR / PRERENDER / 404 ORKESTRASYONU
  // =========================================================================
  let vite: any;
  if (!isProd) {
    vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'custom'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist'), { index: false }));
  }

  /**
   * Public Route Doğrulayıcı ve SEO Meta / Fallback HTML Oluşturucu
   */
  app.use('*', async (req: Request, res: Response) => {
    const url = req.originalUrl.split('?')[0];

    // Bilinen Route Tanımları
    const isKnownRoute = 
      url === '/' ||
      url === '/pazaryeri' ||
      url === '/sehir-avm' ||
      url === '/toptan' ||
      url === '/kuryeler' ||
      url === '/blog' ||
      url === '/blog/sitemap' ||
      url === '/saticipaneli' ||
      url.startsWith('/saas-konsol') ||
      url.startsWith('/hesabim') ||
      url.startsWith('/yonetim') ||
      ['/mesafeli-satis', '/gizlilik', '/kvkk', '/cerez-politikasi', '/iade-ve-degisim'].includes(url);

    // Dinamik Parametrik Route Kontrolleri
    const isProductRoute = url.startsWith('/urun/');
    const isStoreRoute = url.startsWith('/dukkan/') || url.startsWith('/magaza/');
    const isBlogArticleRoute = url.startsWith('/blog/') && url !== '/blog/sitemap';

    let productData: Product | undefined;
    let storeData: any;
    let blogData: any;

    if (isProductRoute) {
      const slug = url.replace('/urun/', '');
      productData = initialProducts.find(p => p.slug === slug || p.id === slug);
    } else if (isStoreRoute) {
      const slug = url.replace('/dukkan/', '').replace('/magaza/', '');
      storeData = initialTenants.find(t => t.id === slug || t.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === slug);
    } else if (isBlogArticleRoute) {
      const slug = url.replace('/blog/', '');
      blogData = staticBlogPosts.find(b => b.slug === slug);
    }

    const isValidRoute = isKnownRoute || Boolean(productData) || Boolean(storeData) || Boolean(blogData);

    // -----------------------------------------------------------------------
    // BİLİNMEYEN ROUTE -> GERÇEK HTTP 404 NOT FOUND
    // -----------------------------------------------------------------------
    if (!isValidRoute) {
      res.status(404);
      let html = `<!doctype html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>404 - Sayfa Bulunamadı | TamPazar</title>
    <meta name="robots" content="noindex, nofollow" />
    <style>
      body { font-family: system-ui, sans-serif; background: #0B132B; color: white; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; }
      .card { background: #111B38; padding: 2.5rem; border-radius: 1.5rem; border: 1px solid #1f2d5a; max-width: 480px; }
      h1 { color: #F59E0B; margin-top: 0; font-size: 2rem; }
      a { display: inline-block; margin-top: 1.5rem; background: #0F4C3A; color: white; padding: 0.75rem 1.5rem; border-radius: 0.75rem; text-decoration: none; font-weight: bold; }
      a:hover { background: #0B382B; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>404 Sayfa Bulunamadı</h1>
      <p>Aradığınız sayfa veya ürün kaldırılmış veya adresi değişmiş olabilir.</p>
      <a href="/">TamPazar Ana Sayfaya Dön →</a>
    </div>
  </body>
</html>`;
      return res.send(html);
    }

    // -----------------------------------------------------------------------
    // GEÇERLİ ROUTE -> SERVER-SIDE METADATA VE PRERENDER ENJEKSİYONU (HTTP 200)
    // -----------------------------------------------------------------------
    try {
      let template = fs.readFileSync(
        path.resolve(process.cwd(), isProd ? 'dist/index.html' : 'index.html'),
        'utf-8'
      );

      if (!isProd && vite) {
        template = await vite.transformIndexHtml(url, template);
      }

      // Dinamik Başlık ve Açıklama Çözümleyici
      let pageTitle = 'TamPazar | Komisyonsuz Hibrit Pazaryeri & Açık Dijital AVM';
      let pageDesc = 'tampazar.com hibrit pazaryeri: %0 komisyon, BYO POS, GİB e-Fatura ve yerel esnaf ağı.';
      let jsonLdScript = '';
      let semanticPrerenderHtml = '';

      if (productData) {
        pageTitle = `${productData.title} - ₺${productData.price} | TamPazar`;
        pageDesc = productData.description || `${productData.title} en avantajlı esnaf fiyatıyla TamPazar'da.`;
        jsonLdScript = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": ${JSON.stringify(productData.title)},
  "description": ${JSON.stringify(pageDesc)},
  "offers": {
    "@type": "Offer",
    "priceCurrency": "TRY",
    "price": ${productData.price},
    "availability": "https://schema.org/InStock"
  }
}
</script>`;
        semanticPrerenderHtml = `<article><h1>${productData.title}</h1><p>${pageDesc}</p><div>Fiyat: ₺${productData.price}</div><div>Kategori: ${productData.category}</div></article>`;
      } else if (storeData) {
        pageTitle = `${storeData.name} - Dijital Dükkanı | TamPazar`;
        pageDesc = `${storeData.name} (${storeData.city}) doğrudan esnaf dükkanı. %0 komisyonlu alışveriş.`;
        jsonLdScript = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": ${JSON.stringify(storeData.name)},
  "description": ${JSON.stringify(pageDesc)}
}
</script>`;
        semanticPrerenderHtml = `<section><h1>${storeData.name}</h1><p>${pageDesc}</p></section>`;
      } else if (blogData) {
        pageTitle = `${blogData.title} | TamPazar Rehber`;
        pageDesc = blogData.excerpt;
        semanticPrerenderHtml = `<article><h1>${blogData.title}</h1><p>${blogData.excerpt}</p></article>`;
      }

      // Meta etiketlerini HTML şablonuna yerleştir
      let renderedHtml = template
        .replace(/<title>.*?<\/title>/, `<title>${pageTitle}</title>`)
        .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${pageDesc}" />`);

      if (jsonLdScript) {
        renderedHtml = renderedHtml.replace('</head>', `${jsonLdScript}\n</head>`);
      }

      if (semanticPrerenderHtml) {
        renderedHtml = renderedHtml.replace('<div id="root"></div>', `<div id="root">${semanticPrerenderHtml}</div>`);
      }

      res.status(200).setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(renderedHtml);
    } catch (err: any) {
      if (!isProd && vite) vite.ssrFixStacktrace(err);
      return res.status(500).send('Sunucu hatası: ' + err.message);
    }
  });

  app.listen(PORT, () => {
    console.log(`🚀 TamPazar Express Sunucusu http://localhost:${PORT} portunda çalışıyor.`);
  });
}

startServer();

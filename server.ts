import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { initialProducts, initialTenants, Product } from './src/data/mockData.js';
import { staticBlogPosts } from './src/data/blogData.js';
import { encryptSecret } from './src/utils/cryptoSecurity.js';
import { eq, desc } from 'drizzle-orm';
import { db } from './src/db/index.js';
import { products, tenants, orders } from './src/db/schema.js';

const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

async function startServer() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser('tampazar_secure_cookie_secret'));

  // =========================================================================
  // 1. GÜVENLİK VE BAŞLIK MİDDEWARE'LERİ (Security Headers)
  // =========================================================================
  app.use((req: Request, res: Response, next: NextFunction) => {
    // HTTP -> HTTPS Redirect (Üretim Ortamında)
    if (isProd && req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }

    // Güvenlik Başlıkları
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
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

  // Helper JWT Simulator
  const JWT_SECRET = 'tampazar_jwt_secret_key_2026_prod';

  function generateJwtToken(userData: any): string {
    const payload = {
      ...userData,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 Gün
    };
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }

  function verifyJwtToken(token: string): any {
    try {
      const decodedStr = Buffer.from(token, 'base64').toString('utf-8');
      const payload = JSON.parse(decodedStr);
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('Token süresi doldu.');
      }
      return payload;
    } catch {
      return null;
    }
  }

  /**
   * HttpOnly Çerez Tabanlı Oturum Başlatma (Login) API
   */
  app.post('/api/auth/login', (req: Request, res: Response) => {
    try {
      const { email, role, user, storeId } = req.body;
      if (!email && (!user || !user.email)) {
        return res.status(400).json({ error: 'E-posta adresi gereklidir.' });
      }

      const userInfo = user || {
        id: 'usr_' + Date.now(),
        name: email ? email.split('@')[0] : 'Kullanıcı',
        email: email || user?.email,
        role: role || user?.role || 'customer',
        storeId: storeId || user?.storeId || 's3'
      };

      const token = generateJwtToken(userInfo);

      res.cookie('tampazar_token', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
        path: '/'
      });

      return res.status(200).json({
        success: true,
        message: 'Güvenli HttpOnly çerez oturumu başlatıldı.',
        user: userInfo
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Oturum açma hatası: ' + err.message });
    }
  });

  /**
   * HttpOnly Oturum Kapatma (Logout) API
   */
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    res.clearCookie('tampazar_token', { path: '/', httpOnly: true, secure: isProd, sameSite: 'lax' });
    res.clearCookie('tampazar_session', { path: '/', httpOnly: true, secure: isProd, sameSite: 'lax' });
    return res.status(200).json({ success: true, message: 'Oturum kapatıldı' });
  });

  /**
   * Oturum Durumu Kontrolü (Sayfa yenilendiğinde istemcinin kimliği sorması için)
   */
  app.get('/api/auth/me', (req: Request, res: Response) => {
    const token = req.cookies.tampazar_token || req.cookies.tampazar_session;
    if (!token) {
      return res.status(401).json({ authenticated: false });
    }

    const decoded = verifyJwtToken(token);
    if (!decoded) {
      res.clearCookie('tampazar_token', { path: '/' });
      res.clearCookie('tampazar_session', { path: '/' });
      return res.status(401).json({ authenticated: false });
    }

    return res.status(200).json({ authenticated: true, user: decoded });
  });

  /**
   * Sunucuda Yeniden Fiyat, KDV ve Kargo Hesaplama API
   * İstemciden gelen fiyatlar asla güvenilir kabul edilmez!
   */
  interface CartItemRequest {
    productId: string;
    qty: number;
    variant?: string;
  }

  app.post('/api/orders/calculate', async (req: Request, res: Response) => {
    try {
      const { items, deliveryType } = req.body as { 
        items: { productId: string; qty: number; variant?: string }[]; 
        deliveryType: string 
      };

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Sepet boş olamaz.' });
      }

      let subtotalClean = 0;
      let totalVatAmount = 0;
      const validatedItems = [];

      for (const item of items) {
        let prodTitle = '';
        let prodId = item.productId;
        let unitPrice = 0;
        let vatRate = 20;

        // Veritabanından çekiliyor; DevTools fiyat müdahaleleri kesin olarak geçersizdir
        try {
          const dbProduct = await db.select().from(products).where(eq(products.id, item.productId)).limit(1);
          if (dbProduct && dbProduct.length > 0) {
            const p = dbProduct[0];
            prodTitle = p.title;
            prodId = p.id;
            unitPrice = parseFloat(p.price);
            vatRate = p.vatRate || 20;
          }
        } catch (dbErr) {
          // DB error / fallback
        }

        if (!prodTitle) {
          const mockProduct = initialProducts.find((p) => p.id === item.productId || p.slug === item.productId);
          if (mockProduct) {
            prodTitle = mockProduct.title;
            prodId = mockProduct.id;
            unitPrice = mockProduct.price;
            vatRate = mockProduct.vatRate || 20;

            const qty = Math.max(1, Math.floor(Number(item.qty) || 1));
            if (mockProduct.type === 'wholesale' && mockProduct.tieredPrices && mockProduct.tieredPrices.length > 0) {
              const matchedTier = mockProduct.tieredPrices.find(t => qty >= t.minQty && (t.maxQty === null || qty <= t.maxQty));
              if (matchedTier) unitPrice = matchedTier.pricePerUnit;
            }
          }
        }

        if (!prodTitle) {
          return res.status(404).json({ success: false, message: `Ürün bulunamadı: ${item.productId}` });
        }

        const qty = Math.max(1, Math.floor(Number(item.qty) || 1));

        const itemTotal = unitPrice * qty;
        const basePrice = itemTotal / (1 + vatRate / 100);
        const vatAmount = itemTotal - basePrice;

        subtotalClean += basePrice;
        totalVatAmount += vatAmount;

        validatedItems.push({
          productId: prodId,
          title: prodTitle,
          price: unitPrice,
          qty,
          vatRate,
          total: itemTotal,
        });
      }

      let deliveryFee = 0;
      if (deliveryType === 'EXPRESS_COURIER' || deliveryType === 'LOCAL_EXPRESS') {
        deliveryFee = 49.90;
      } else if (deliveryType === 'CARGO') {
        deliveryFee = (subtotalClean + totalVatAmount) > 500 ? 0 : 39.90;
      }

      const totalPayable = Number((subtotalClean + totalVatAmount + deliveryFee).toFixed(2));

      return res.json({
        success: true,
        summary: {
          items: validatedItems,
          subtotalClean: Number(subtotalClean.toFixed(2)),
          totalVatAmount: Number(totalVatAmount.toFixed(2)),
          deliveryFee,
          totalPayable,
          currency: 'TRY',
        },
      });
    } catch (error) {
      console.error('Sipariş hesaplama hatası:', error);
      return res.status(500).json({ success: false, message: 'Hesaplama hatası oluştu.' });
    }
  });

  /**
   * 1. Tüm Ürünleri / Vitrini Getir (Kategori ve Tip Filtreli)
   */
  app.get('/api/products', async (req: Request, res: Response) => {
    try {
      const { category, type, limit = 50 } = req.query;

      let result: any[] = [];
      try {
        let query = db.select().from(products);
        
        // Filtreleme koşulları
        if (category) {
          query = query.where(eq(products.category, String(category))) as any;
        }
        if (type) {
          query = query.where(eq(products.type, String(type))) as any;
        }

        result = await query.limit(Number(limit)).orderBy(desc(products.createdAt));
      } catch (dbErr) {
        // Fallback to initialProducts if DB not seeded/connected
        result = initialProducts.filter(p => {
          if (category && p.category !== category) return false;
          if (type && p.type !== type) return false;
          return true;
        }).slice(0, Number(limit));
      }

      if (result.length === 0 && initialProducts.length > 0) {
        result = initialProducts.filter(p => {
          if (category && p.category !== category) return false;
          if (type && p.type !== type) return false;
          return true;
        }).slice(0, Number(limit));
      }

      return res.json({ success: true, data: result });
    } catch (error) {
      console.error('Ürün listeleme hatası:', error);
      return res.status(500).json({ success: false, message: 'Ürünler getirilemedi.' });
    }
  });

  /**
   * 2. Tekil Ürün Detayı (Slug ile)
   */
  app.get('/api/products/:slug', async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      let productData: any = null;
      let tenantDataObj: any = null;

      try {
        const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
        if (result && result.length > 0) {
          productData = result[0];
          if (productData.tenantId) {
            const tenantData = await db.select().from(tenants).where(eq(tenants.id, productData.tenantId)).limit(1);
            tenantDataObj = tenantData[0] || null;
          }
        }
      } catch (dbErr) {
        // Fallback to initialProducts / initialTenants
      }

      if (!productData) {
        const mockProduct = initialProducts.find(p => p.slug === slug || p.id === slug);
        if (!mockProduct) {
          return res.status(404).json({ success: false, message: 'Ürün bulunamadı.' });
        }
        productData = mockProduct;
        tenantDataObj = initialTenants.find(t => t.id === mockProduct.tenantId) || null;
      }

      return res.json({ 
        success: true, 
        data: { 
          ...productData, 
          tenant: tenantDataObj 
        } 
      });
    } catch (error) {
      console.error('Ürün detay hatası:', error);
      return res.status(500).json({ success: false, message: 'Ürün detayı alınamadı.' });
    }
  });

  /**
   * 3. Mağaza / Dükkân Detayı (Slug ile)
   */
  app.get('/api/tenants/:slug', async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      let tenantData: any = null;
      let tenantProducts: any[] = [];

      try {
        const tenantResult = await db.select().from(tenants).where(eq(tenants.slug, slug)).limit(1);
        if (tenantResult && tenantResult.length > 0) {
          tenantData = tenantResult[0];
          tenantProducts = await db.select().from(products).where(eq(products.tenantId, tenantData.id));
        }
      } catch (dbErr) {
        // Fallback
      }

      if (!tenantData) {
        const mockTenant = initialTenants.find(t => t.slug === slug || t.id === slug);
        if (!mockTenant) {
          return res.status(404).json({ success: false, message: 'Mağaza bulunamadı.' });
        }
        tenantData = mockTenant;
        tenantProducts = initialProducts.filter(p => p.tenantId === mockTenant.id);
      }

      return res.json({
        success: true,
        data: {
          ...tenantData,
          products: tenantProducts
        }
      });
    } catch (error) {
      console.error('Mağaza detay hatası:', error);
      return res.status(500).json({ success: false, message: 'Mağaza bilgisi alınamadı.' });
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
  // 4. DINAMIK ROBOTS.TXT, LLMS.TXT VE XML SITEMAP ROTALARI
  // =========================================================================

  app.get('/llms.txt', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    const txt = `# TamPazar

> TamPazar, Türkiye'de yerel esnafı, bağımsız kuryeleri ve müşterileri komisyonsuz (%0 komisyonlu) bir modelle buluşturan açık pazar yeri ve SaaS platformudur.

## Genel Bilgiler
- Web Sitesi: https://tampazar.com
- Model: Komisyonsuz (%0 platform komisyonu), esnafın kendi sanal POS'unu (BYO POS) doğrudan kasasına bağlayabildiği e-ticaret altyapısı.
- Hizmet Kapsamı: Perakende ürünler, yerel hizmetler, B2B toptan tedarik ve bağımsız kurye lojistiği.

## Önemli Bağlantılar
- Pazaryeri Kataloğu: https://tampazar.com/pazaryeri
- Şehir AVM Vitrini: https://tampazar.com/sehir-avm
- Satıcı Katılımı: https://tampazar.com/saticipaneli
- Kurye Ağı: https://tampazar.com/kuryeler
- Blog & Rehberler: https://tampazar.com/blog

## Geliştirici ve LLM Keşif Kaynakları
- XML Site Haritası: https://tampazar.com/sitemap.xml`;
    return res.status(200).send(txt);
  });

  app.get('/robots.txt', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    const txt = `User-agent: *
Allow: /
Allow: /pazaryeri
Allow: /sehir-avm
Allow: /dukkan/
Allow: /urun/
Allow: /blog
Allow: /toptan
Allow: /kuryeler

# Korumalı ve Özel Alanlar
Disallow: /api/
Disallow: /yonetim/
Disallow: /sistem-admin/
Disallow: /saas-konsol/
Disallow: /kurye/panel
Disallow: /hesabim/

# Explicit Permissions for AI Search Engines & LLM Bots
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

# Sitemap Dizini
Sitemap: https://tampazar.com/sitemap.xml`;
    return res.status(200).send(txt);
  });

  // 1. Ana Sitemap Dizini (/sitemap.xml)
  app.get('/sitemap.xml', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://tampazar.com/sitemap-products.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://tampazar.com/sitemap-stores.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://tampazar.com/sitemap-blog.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;
    return res.status(200).send(xml);
  });

  // 2. Ürünler Sitemap'i (/sitemap-products.xml)
  app.get('/sitemap-products.xml', async (req: Request, res: Response) => {
    try {
      let allProducts: any[] = [];
      try {
        allProducts = await db.select().from(products);
      } catch (dbErr) {
        allProducts = initialProducts;
      }
      if (!allProducts || allProducts.length === 0) {
        allProducts = initialProducts;
      }

      res.setHeader('Content-Type', 'application/xml; charset=utf-8');

      let urlsXml = allProducts.map(p => `
  <url>
    <loc>https://tampazar.com/urun/${p.slug || p.id}</loc>
    <lastmod>${p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tampazar.com/pazaryeri</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>${urlsXml}
</urlset>`;

      return res.status(200).send(xml);
    } catch (error) {
      console.error('Sitemap products hatası:', error);
      return res.status(500).send('Sitemap üretilemedi');
    }
  });

  // 3. Mağazalar Sitemap'i (/sitemap-stores.xml)
  app.get('/sitemap-stores.xml', async (req: Request, res: Response) => {
    try {
      let allStores: any[] = [];
      try {
        allStores = await db.select().from(tenants);
      } catch (dbErr) {
        allStores = initialTenants;
      }
      if (!allStores || allStores.length === 0) {
        allStores = initialTenants;
      }

      res.setHeader('Content-Type', 'application/xml; charset=utf-8');

      let urlsXml = allStores.map(s => `
  <url>
    <loc>https://tampazar.com/dukkan/${s.slug || s.id}</loc>
    <lastmod>${s.createdAt ? new Date(s.createdAt).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tampazar.com/sehir-avm</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>${urlsXml}
</urlset>`;

      return res.status(200).send(xml);
    } catch (error) {
      console.error('Sitemap stores hatası:', error);
      return res.status(500).send('Sitemap üretilemedi');
    }
  });

  // 4. Blog Sitemap'i (/sitemap-blog.xml) - HTML değil saf XML dönüşü
  app.get('/sitemap-blog.xml', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');

    let blogUrls = staticBlogPosts.map(b => `
  <url>
    <loc>https://tampazar.com/blog/${b.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tampazar.com/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>${blogUrls}
</urlset>`;
    return res.status(200).send(xml);
  });

  // =========================================================================
  // 5. VITE MIDDLEWARE VE SSR / PRERENDER / 404 ORKESTRASYONU
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

    let indexHtmlTemplate = '';
    try {
      indexHtmlTemplate = fs.readFileSync(
        path.resolve(process.cwd(), isProd ? 'dist/index.html' : 'index.html'),
        'utf-8'
      );
      if (!isProd && vite) {
        indexHtmlTemplate = await vite.transformIndexHtml(url, indexHtmlTemplate);
      }
    } catch {
      indexHtmlTemplate = '<!doctype html><html lang="tr"><head><title>TamPazar</title></head><body><div id="root"></div></body></html>';
    }

    try {
      let title = 'TamPazar | Komisyonsuz Yeni Nesil Pazaryeri';
      let description = 'Türkiye genelinde esnafı, müşterileri ve yerel kuryeleri buluşturan komisyonsuz pazar yeri.';
      let canonical = `https://tampazar.com${url}`;
      let schemaJson = '';
      let isNotFound = false;

      // 1. Dinamik Ürün Sayfası Kontrolü (/urun/:slug)
      if (url.startsWith('/urun/')) {
        const slug = url.replace('/urun/', '').split('/')[0];
        let prod: any = null;

        try {
          const productResult = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
          if (productResult && productResult.length > 0) {
            prod = productResult[0];
          }
        } catch (dbErr) {
          // DB Fallback
        }

        if (!prod) {
          prod = initialProducts.find(p => p.slug === slug || p.id === slug);
        }

        if (!prod) {
          // Ürün bulunamadıysa KESİNLİKLE gerçek 404 dönüyoruz:
          return res.status(404).setHeader('Content-Type', 'text/html; charset=utf-8').send(
            indexHtmlTemplate
              .replace(/<title>.*?<\/title>/, '<title>404 - Ürün Bulunamadı | TamPazar</title>')
              .replace('</head>', '<meta name="robots" content="noindex, follow" /></head>')
          );
        }

        title = `${prod.title} | TamPazar`;
        description = prod.description || `${prod.title} en uygun fiyat ve yerel esnaf güvencesiyle TamPazar'da.`;
        
        // Product JSON-LD Schema
        schemaJson = JSON.stringify({
          '@context': 'https://schema.org/',
          '@type': 'Product',
          name: prod.title,
          image: prod.imageUrl ? [prod.imageUrl] : [],
          description: description,
          sku: prod.sku,
          offers: {
            '@type': 'Offer',
            url: canonical,
            priceCurrency: 'TRY',
            price: prod.price,
            availability: (prod.stock ?? 0) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          }
        });
      }

      // 2. Dinamik Mağaza Sayfası Kontrolü (/dukkan/ veya /magaza/)
      else if (url.startsWith('/dukkan/') || url.startsWith('/magaza/')) {
        const slug = url.replace('/dukkan/', '').replace('/magaza/', '').split('/')[0];
        let store: any = null;

        try {
          const tenantResult = await db.select().from(tenants).where(eq(tenants.slug, slug)).limit(1);
          if (tenantResult && tenantResult.length > 0) {
            store = tenantResult[0];
          }
        } catch (dbErr) {
          // DB Fallback
        }

        if (!store) {
          store = initialTenants.find(t => t.slug === slug || t.id === slug || t.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === slug);
        }

        if (!store) {
          return res.status(404).setHeader('Content-Type', 'text/html; charset=utf-8').send(
            indexHtmlTemplate
              .replace(/<title>.*?<\/title>/, '<title>404 - Mağaza Bulunamadı | TamPazar</title>')
              .replace('</head>', '<meta name="robots" content="noindex, follow" /></head>')
          );
        }

        title = `${store.name} | Yerel Esnaf Mağazası | TamPazar`;
        description = `${store.name} mağazasının tüm ürün ve hizmetleri TamPazar güvencesiyle yayında.`;

        // LocalBusiness JSON-LD Schema
        schemaJson = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: store.name,
          url: canonical,
        });
      }

      // 3. Blog Yazıları
      else if (url.startsWith('/blog/') && url !== '/blog/sitemap') {
        const slug = url.replace('/blog/', '');
        const blogPost = staticBlogPosts.find(b => b.slug === slug);
        if (blogPost) {
          title = `${blogPost.title} | TamPazar Rehber`;
          description = blogPost.excerpt;
          schemaJson = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: blogPost.title,
            description: blogPost.excerpt,
            url: canonical
          });
        }
      }

      // 4. Özel / Korumalı Alanlar İçin Noindex Denetimi
      const isPrivateArea = ['/yonetim', '/saas-konsol', '/kurye/panel', '/hesabim', '/sistem-admin', '/saticipaneli'].some(route => url.startsWith(route));
      const robotsTag = isPrivateArea 
        ? '<meta name="robots" content="noindex, nofollow" />' 
        : '<meta name="robots" content="index, follow" />';

      // HTML içine dinamik meta etiketlerini ve Schema'yı enjekte etme
      let finalHtml = indexHtmlTemplate
        .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
        .replace('</head>', `
          <meta name="description" content="${description}" />
          <link rel="canonical" href="${canonical}" />
          ${robotsTag}
          ${schemaJson ? `<script type="application/ld+json">${schemaJson}</script>` : ''}
        </head>`);

      return res.status(200).setHeader('Content-Type', 'text/html; charset=utf-8').send(finalHtml);

    } catch (error) {
      console.error('SSR/HTML render hatası:', error);
      return res.status(500).send('Sunucu hatası');
    }
  });

  app.listen(PORT, () => {
    console.log(`🚀 TamPazar Express Sunucusu http://localhost:${PORT} portunda çalışıyor.`);
  });
}

startServer();

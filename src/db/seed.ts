import { db } from './index';
import { tenants, products } from './schema';
import { initialTenants, initialProducts } from '../data/mockData';

/**
 * Otomatik Veritabanı Tohumlama (Auto-Seed / Migration)
 * Sunucu her başlatıldığında zorunlu test ve varsayılan verilerin veritabanında var olduğunu garanti eder.
 */
export async function autoSeedDatabase() {
  try {
    console.log('[SEED] Otomatik veritabanı kontrolü ve tohumlama başlatılıyor...');

    // 1. Mağaza (Tenant) Kontrolü: 'atolye-zanaat'
    await db.insert(tenants).values({
      id: 'atolye-zanaat',
      name: 'Atölye Zanaat',
      legalTitle: 'Atölye Zanaat Tasarım Ltd. Şti.',
      taxOffice: 'Ordu',
      taxId: '1234567890',
      slug: 'atolye-zanaat',
      plan: 'Starter',
      subscriptionStatus: 'active',
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    }).onConflictDoNothing();

    // Mock kiracıları aktar
    for (const t of initialTenants) {
      await db.insert(tenants).values({
        id: t.id,
        name: t.name,
        legalTitle: t.legalTitle,
        taxOffice: t.taxOffice,
        taxId: t.taxId,
        slug: t.slug || t.id,
        plan: 'Starter',
        subscriptionStatus: 'trial',
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      }).onConflictDoNothing();
    }

    // 2. Ürün Kontrolü: 'el-yapimi-ahsap-tablo'
    await db.insert(products).values({
      id: 'prod_test_001',
      tenantId: 'atolye-zanaat',
      title: 'El Yapımı Ahşap Tablo',
      slug: 'el-yapimi-ahsap-tablo',
      type: 'retail',
      price: '450.00',
      vatRate: 20,
      sku: 'TABLO-001',
      stock: 15,
      category: 'Ev & Yaşam',
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
      salesCount: 0,
      rating: '0.00'
    }).onConflictDoNothing();

    // Mock ürünleri aktar
    for (const p of initialProducts) {
      await db.insert(products).values({
        id: p.id,
        tenantId: p.tenantId || 'atolye-zanaat',
        title: p.title,
        slug: p.slug || p.id,
        type: p.type || 'retail',
        price: p.price.toString(),
        vatRate: p.vatRate || 20,
        sku: p.sku || `SKU-${p.id}`,
        stock: p.stockCount || 50,
        imageUrl: p.image,
        category: p.category || 'Genel',
        salesCount: 0,
        rating: '0.00'
      }).onConflictDoNothing();
    }

    console.log('[SEED] Otomatik veritabanı tohumlama başarıyla tamamlandı!');
  } catch (err) {
    console.warn('[SEED] Tohumlama uyarısı (İsteğe bağlı DB bağlantısı olmadan çalışıyorsa atlanabilir):', err);
  }
}

// Doğrudan CLI ile çalıştırıldığında (node/ts-node)
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  autoSeedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Tohumlama hatası:', err);
      process.exit(1);
    });
}

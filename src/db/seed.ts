import { db } from './index';
import { tenants, products } from './schema';
import { initialTenants, initialProducts } from '../data/mockData';

async function seed() {
  console.log('Tohumlama başlıyor...');

  // Kiracıları (Mağazaları) Aktar
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
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 günlük deneme
    }).onConflictDoNothing();
  }

  // Ürünleri Aktar
  for (const p of initialProducts) {
    await db.insert(products).values({
      id: p.id,
      tenantId: p.tenantId || initialTenants[0].id,
      title: p.title,
      slug: p.slug || p.id,
      type: p.type || 'retail',
      price: p.price.toString(),
      vatRate: p.vatRate || 20,
      sku: p.sku || `SKU-${p.id}`,
      stock: 50,
      imageUrl: p.image,
      category: p.category || 'Genel',
      salesCount: 0, // Analiz raporu kuralı: Gerçek satış olana kadar 0!
      rating: '0.00'
    }).onConflictDoNothing();
  }

  console.log('Tohumlama başarıyla tamamlandı!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Tohumlama hatası:', err);
  process.exit(1);
});

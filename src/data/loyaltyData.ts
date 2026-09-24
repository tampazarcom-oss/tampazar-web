/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MerchantLoyaltyRule {
  storeId: string;
  storeName: string;
  rewardTitle: string; // Örn: "Fırından 1 Adet Sıcak Taş Fırın Ekmeği"
  rewardCategory: 'FOOD' | 'GROCERY' | 'SERVICE' | 'BEVERAGE' | 'GENERAL';
  requiredStamps: number; // Örn: 5 siparişte 1
  isActive: boolean;
  rewardDescription: string;
  iconEmoji: string;
  minOrderAmount?: number;
}

export interface CustomerLoyaltyCard {
  storeId: string;
  storeName: string;
  currentStamps: number;
  requiredStamps: number;
  rewardTitle: string;
  iconEmoji: string;
  isRewardReady: boolean;
  totalRewardsEarned: number;
  lastStampDate: string;
  history: {
    orderNumber: string;
    date: string;
    action: 'STAMP_EARNED' | 'REWARD_REDEEMED';
    note: string;
  }[];
}

const DEFAULT_LOYALTY_RULES: Record<string, MerchantLoyaltyRule> = {
  'store-karadeniz-doner': {
    storeId: 'store-karadeniz-doner',
    storeName: 'Tarihi Karadeniz Dönercisi',
    rewardTitle: 'Geleneksel Fırın Sütlaç & Çay İkramı',
    rewardCategory: 'FOOD',
    requiredStamps: 4,
    isActive: true,
    rewardDescription: 'Her 4 döner menüsü siparişinizde tatlı ve çayımız işletmemizin ikramıdır.',
    iconEmoji: '🍮',
    minOrderAmount: 150
  },
  'store-mert-kundura': {
    storeId: 'store-mert-kundura',
    storeName: 'Mert Kundura Ltd.',
    rewardTitle: 'Profesyonel Deri Bakım & Cila Süngeri Hediyesi',
    rewardCategory: 'SERVICE',
    requiredStamps: 3,
    isActive: true,
    rewardDescription: '3. ayakkabı veya çanta alışverişinizde hakiki deri bakım seti hediyemiz.',
    iconEmoji: '👞',
    minOrderAmount: 500
  },
  'store-kuzey-firini': {
    storeId: 'store-kuzey-firini',
    storeName: 'Kuzey Taş Fırını & Unlu Mamulleri',
    rewardTitle: 'Taş Fırından 1 Adet Sıcak Trabzon Ekmeği',
    rewardCategory: 'FOOD',
    requiredStamps: 5,
    isActive: true,
    rewardDescription: '5 fırın siparişinizde 1 adet sıcak somun ekmek dükkanımızdan ikram!',
    iconEmoji: '🍞',
    minOrderAmount: 80
  },
  'store-yesil-manav': {
    storeId: 'store-yesil-manav',
    storeName: 'Akyazı Doğal Manav & Şarküteri',
    rewardTitle: 'Taze Köy Yeşilliği & Nane Demeti Hediyesi',
    rewardCategory: 'GROCERY',
    requiredStamps: 3,
    isActive: true,
    rewardDescription: '3. manav siparişinizde taze bahçe yeşillik buketi sepete eklenir.',
    iconEmoji: '🥗',
    minOrderAmount: 120
  },
  'store-kuzey-ahsap': {
    storeId: 'store-kuzey-ahsap',
    storeName: 'Kuzey Ahşap Tasarım & Marangozluk',
    rewardTitle: 'Masif Ahşap Özel Bardak Altlığı Seti (4\'lü)',
    rewardCategory: 'GENERAL',
    requiredStamps: 2,
    isActive: true,
    rewardDescription: '2. mobilya veya dekorasyon siparişinizde el yapımı masif bardak altlığı seti.',
    iconEmoji: '🪵',
    minOrderAmount: 1000
  }
};

const DEFAULT_CUSTOMER_LOYALTY_CARDS: CustomerLoyaltyCard[] = [
  {
    storeId: 'store-kuzey-firini',
    storeName: 'Kuzey Taş Fırını & Unlu Mamulleri',
    currentStamps: 4,
    requiredStamps: 5,
    rewardTitle: 'Taş Fırından 1 Adet Sıcak Trabzon Ekmeği',
    iconEmoji: '🍞',
    isRewardReady: false,
    totalRewardsEarned: 2,
    lastStampDate: '22 Eylül 2026',
    history: [
      { orderNumber: 'TPZ-FIRIN-901', date: '10 Eylül 2026', action: 'STAMP_EARNED', note: '1 Damga eklendi' },
      { orderNumber: 'TPZ-FIRIN-914', date: '14 Eylül 2026', action: 'STAMP_EARNED', note: '1 Damga eklendi' },
      { orderNumber: 'TPZ-FIRIN-930', date: '18 Eylül 2026', action: 'STAMP_EARNED', note: '1 Damga eklendi' },
      { orderNumber: 'TPZ-FIRIN-955', date: '22 Eylül 2026', action: 'STAMP_EARNED', note: '1 Damga eklendi' }
    ]
  },
  {
    storeId: 'store-karadeniz-doner',
    storeName: 'Tarihi Karadeniz Dönercisi',
    currentStamps: 4,
    requiredStamps: 4,
    rewardTitle: 'Geleneksel Fırın Sütlaç & Çay İkramı',
    iconEmoji: '🍮',
    isRewardReady: true,
    totalRewardsEarned: 1,
    lastStampDate: '18 Eylül 2026',
    history: [
      { orderNumber: 'TPZ-DONER-101', date: '01 Eylül 2026', action: 'STAMP_EARNED', note: '1 Damga eklendi' },
      { orderNumber: 'TPZ-DONER-109', date: '08 Eylül 2026', action: 'STAMP_EARNED', note: '1 Damga eklendi' },
      { orderNumber: 'TPZ-DONER-125', date: '14 Eylül 2026', action: 'STAMP_EARNED', note: '1 Damga eklendi' },
      { orderNumber: 'TPZ-DONER-140', date: '18 Eylül 2026', action: 'STAMP_EARNED', note: '4. Damga! İkram hak edildi 🎁' }
    ]
  },
  {
    storeId: 'store-yesil-manav',
    storeName: 'Akyazı Doğal Manav & Şarküteri',
    currentStamps: 2,
    requiredStamps: 3,
    rewardTitle: 'Taze Köy Yeşilliği & Nane Demeti Hediyesi',
    iconEmoji: '🥗',
    isRewardReady: false,
    totalRewardsEarned: 0,
    lastStampDate: '20 Eylül 2026',
    history: [
      { orderNumber: 'TPZ-MNV-441', date: '12 Eylül 2026', action: 'STAMP_EARNED', note: '1 Damga eklendi' },
      { orderNumber: 'TPZ-MNV-480', date: '20 Eylül 2026', action: 'STAMP_EARNED', note: '1 Damga eklendi' }
    ]
  }
];

export const getStoredLoyaltyRules = (): Record<string, MerchantLoyaltyRule> => {
  try {
    const data = localStorage.getItem('tampazar_loyalty_rules');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_LOYALTY_RULES;
};

export const saveStoredLoyaltyRules = (rules: Record<string, MerchantLoyaltyRule>) => {
  try {
    localStorage.setItem('tampazar_loyalty_rules', JSON.stringify(rules));
    window.dispatchEvent(new Event('tampazar_loyalty_rules_updated'));
  } catch (e) {
    console.error(e);
  }
};

export const getStoredCustomerLoyaltyCards = (): CustomerLoyaltyCard[] => {
  try {
    const data = localStorage.getItem('tampazar_customer_loyalty_cards');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_CUSTOMER_LOYALTY_CARDS;
};

export const saveStoredCustomerLoyaltyCards = (cards: CustomerLoyaltyCard[]) => {
  try {
    localStorage.setItem('tampazar_customer_loyalty_cards', JSON.stringify(cards));
    window.dispatchEvent(new Event('tampazar_customer_loyalty_updated'));
  } catch (e) {
    console.error(e);
  }
};

export const addStampToCustomerCard = (storeId: string, storeName: string, orderNumber: string): { rewardReady: boolean; card: CustomerLoyaltyCard } => {
  const rules = getStoredLoyaltyRules();
  const rule = rules[storeId] || {
    storeId,
    storeName,
    rewardTitle: 'Mahalle İkramı & Tatlı Jest Hediyesi',
    rewardCategory: 'GENERAL',
    requiredStamps: 5,
    isActive: true,
    rewardDescription: '5 sipariş tamamlandığında esnafımızdan özel ikram.',
    iconEmoji: '🎁'
  };

  const cards = getStoredCustomerLoyaltyCards();
  let card = cards.find(c => c.storeId === storeId);

  if (!card) {
    card = {
      storeId,
      storeName,
      currentStamps: 0,
      requiredStamps: rule.requiredStamps,
      rewardTitle: rule.rewardTitle,
      iconEmoji: rule.iconEmoji,
      isRewardReady: false,
      totalRewardsEarned: 0,
      lastStampDate: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
      history: []
    };
    cards.push(card);
  }

  card.currentStamps += 1;
  card.lastStampDate = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  
  let rewardReady = false;
  if (card.currentStamps >= card.requiredStamps) {
    card.isRewardReady = true;
    rewardReady = true;
    card.history.push({
      orderNumber,
      date: card.lastStampDate,
      action: 'STAMP_EARNED',
      note: `${card.currentStamps}. Damga! 🎉 Tebrikler, ${card.rewardTitle} ikramını kazandınız!`
    });
  } else {
    card.history.push({
      orderNumber,
      date: card.lastStampDate,
      action: 'STAMP_EARNED',
      note: `1 Damga eklendi (${card.currentStamps}/${card.requiredStamps})`
    });
  }

  saveStoredCustomerLoyaltyCards(cards);
  return { rewardReady, card };
};

export const redeemCustomerReward = (storeId: string): boolean => {
  const cards = getStoredCustomerLoyaltyCards();
  const card = cards.find(c => c.storeId === storeId);
  if (!card || !card.isRewardReady) return false;

  card.isRewardReady = false;
  card.currentStamps = 0;
  card.totalRewardsEarned += 1;
  card.history.push({
    orderNumber: 'IKRAM-' + Date.now().toString().slice(-4),
    date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
    action: 'REWARD_REDEEMED',
    note: `🎁 "${card.rewardTitle}" ikramı teslim alındı / siparişte kullanıldı.`
  });

  saveStoredCustomerLoyaltyCards(cards);
  return true;
};

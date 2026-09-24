/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Shirt, Home, Wrench, 
  FileCode, Package, Bike, Utensils,
  LayoutGrid, ChevronRight, ArrowRight, Sparkles, Store, ShieldCheck
} from 'lucide-react';

export interface MegaSubGroup {
  title: string;
  items: { name: string; route: string; badge?: string }[];
}

export interface MegaCategoryDetail {
  id: string;
  name: string;
  badge: string;
  badgeBg: string;
  badgeTextColor: string;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  route: string;
  description: string;
  subGroups: MegaSubGroup[];
  banner: {
    title: string;
    description: string;
    btnText: string;
    route: string;
  };
}

export const RICH_MEGA_CATEGORIES: MegaCategoryDetail[] = [
  {
    id: 'tum-kategoriler',
    name: 'Tüm Kategoriler',
    badge: "A'DAN Z'YE",
    badgeBg: 'bg-[#F59E0B]',
    badgeTextColor: 'text-[#0B132B]',
    icon: LayoutGrid,
    iconColor: '#F59E0B',
    bgColor: '#0B132B',
    route: '/pazaryeri',
    description: 'TamPazar Açık Dijital AVM ve %0 komisyonlu tüm ticaret reyonları.',
    subGroups: [
      {
        title: 'HIZLI MAHALLE',
        items: [
          { name: 'Kasap & Şarküteri', route: '/pazaryeri?kategori=mahalle-hizli-tuketim&sub=kasap', badge: '30 Dk' },
          { name: 'Manav & Taze Sebze', route: '/pazaryeri?kategori=mahalle-hizli-tuketim&sub=manav' },
          { name: 'Sıcak Fırın & Ekmek', route: '/pazaryeri?kategori=mahalle-hizli-tuketim&sub=firin' },
          { name: 'Damacana Su & İçecek', route: '/pazaryeri?kategori=mahalle-hizli-tuketim&sub=su' }
        ]
      },
      {
        title: 'BUTİK & ZANAAT',
        items: [
          { name: 'Kadın Butik Giyim', route: '/pazaryeri?kategori=moda-giyim-zanaat&sub=kadin', badge: 'Butik' },
          { name: 'Erkek Giyim & Ceket', route: '/pazaryeri?kategori=moda-giyim-zanaat&sub=erkek' },
          { name: 'El Emeği & Atölye', route: '/pazaryeri?kategori=moda-giyim-zanaat&sub=zanaat' },
          { name: 'Hakiki Deri & Ayakkabı', route: '/pazaryeri?kategori=moda-giyim-zanaat&sub=ayakkabi' }
        ]
      },
      {
        title: 'EV & YAPI MARKET',
        items: [
          { name: 'Mutfak & Züccaciye', route: '/pazaryeri?kategori=ev-yasam-yapi-market&sub=mutfak' },
          { name: 'Elektrikli El Aletleri', route: '/pazaryeri?kategori=ev-yasam-yapi-market&sub=aletler' },
          { name: 'Ev Tekstili & Perde', route: '/pazaryeri?kategori=ev-yasam-yapi-market&sub=tekstil' },
          { name: 'Hırdavat & Nalburiye', route: '/pazaryeri?kategori=ev-yasam-yapi-market&sub=hirdavat' }
        ]
      },
      {
        title: 'HİZMET & USTA',
        items: [
          { name: 'Acil Sıhhi Tesisat', route: '/pazaryeri?kategori=hizmet-ustalik-bakim&sub=tesisat', badge: 'Acil' },
          { name: 'Kombi & Klima Bakımı', route: '/pazaryeri?kategori=hizmet-ustalik-bakim&sub=klima' },
          { name: 'Elektrik & Aydınlatma', route: '/pazaryeri?kategori=hizmet-ustalik-bakim&sub=elektrik' },
          { name: 'Ev & Koltuk Temizliği', route: '/pazaryeri?kategori=hizmet-ustalik-bakim&sub=temizlik' }
        ]
      }
    ],
    banner: {
      title: '🏛️ Şehrin Açık Dijital AVM’si',
      description: 'Aracı komisyonu olmadan doğrudan esnaf kasasından güvenli alışveriş yapın.',
      btnText: 'Tüm Reyonları ve Mağazaları Keşfet',
      route: '/pazaryeri'
    }
  },
  {
    id: 'mahalle-hizli',
    name: 'Mahalle & Hızlı Tüketim',
    badge: '30 DK TESLİMAT',
    badgeBg: 'bg-[#0F4C3A]',
    badgeTextColor: 'text-white',
    icon: Utensils,
    iconColor: '#0F4C3A',
    bgColor: '#E8F5E9',
    route: '/pazaryeri?kategori=mahalle-hizli-tuketim',
    description: 'Mahallenizin kasabı, manavı, fırını ve şarküterisinden kapınıza 30 dakikada teslimat.',
    subGroups: [
      {
        title: 'KASAP & ŞARKÜTERİ',
        items: [
          { name: 'Dana Kıyma & Kuşbaşı', route: '/pazaryeri?kategori=mahalle-hizli-tuketim&sub=kasap', badge: 'Taze' },
          { name: 'Antrikot & Biftek', route: '/pazaryeri?kategori=mahalle-hizli-tuketim&sub=kasap' },
          { name: 'Kasap Sucuk & Pastırma', route: '/pazaryeri?kategori=mahalle-hizli-tuketim&sub=kasap' },
          { name: 'Organik Köy Tavuğu', route: '/pazaryeri?kategori=mahalle-hizli-tuketim&sub=kasap' }
        ]
      },
      {
        title: 'TAZE MEYVE & SEBZE',
        items: [
          { name: 'Günlük Mevsim Meyveleri', route: '/pazaryeri?kategori=mahalle-hizli-tuketim&sub=manav' },
          { name: 'Çıtır Taze Yeşillik', route: '/pazaryeri?kategori=mahalle-hizli-tuketim&sub=manav', badge: 'Yerel' },
          { name: 'Organik Tarla Sebzeleri', route: '/pazaryeri?kategori=mahalle-hizli-tuketim&sub=manav' },
          { name: 'Amasya & Niğde Elması', route: '/pazaryeri?kategori=mahalle-hizli-tuketim&sub=manav' }
        ]
      },
      {
        title: 'FIRIN & UNLU MAMULLER',
        items: [
          { name: 'Odun Ateşi Taş Fırın Ekmek', route: '/pazaryeri?kategori=mahalle-hizli-tuketim&sub=firin' },
          { name: 'Kıymalı & Kaşarlı Sıcak Pide', route: '/pazaryeri?kategori=mahalle-hizli-tuketim&sub=firin' },
          { name: 'Geleneksel Çıtır Simit', route: '/pazaryeri?kategori=mahalle-hizli-tuketim&sub=firin' },
          { name: 'Su Böreği & Çörek', route: '/pazaryeri?kategori=mahalle-hizli-tuketim&sub=firin' }
        ]
      },
      {
        title: 'DAMACANA SU & İÇECEK',
        items: [
          { name: '19L Damacana Kaynak Suyu', route: '/pazaryeri?kategori=mahalle-hizli-tuketim&sub=su' },
          { name: 'Taze Sıkılmış Portakal Suyu', route: '/pazaryeri?kategori=mahalle-hizli-tuketim&sub=su' },
          { name: 'Maden Suyu & Soda', route: '/pazaryeri?kategori=mahalle-hizli-tuketim&sub=su' },
          { name: 'Yerel Harman Çay & Kahve', route: '/pazaryeri?kategori=mahalle-hizli-tuketim&sub=su' }
        ]
      }
    ],
    banner: {
      title: '⚡ 30 Dakikada Kapında! (TamHızlı)',
      description: 'Aracı şirket komisyonu ödemeden mahallenizin fırın ve kasabından doğrudan sipariş verin.',
      btnText: 'TamHızlı Esnafları Gör',
      route: '/pazaryeri?kategori=mahalle-hizli-tuketim'
    }
  },
  {
    id: 'moda-giyim-zanaat',
    name: 'Moda & Giyim & Zanaat',
    badge: 'BUTİK ESNAF',
    badgeBg: 'bg-[#C2185B]',
    badgeTextColor: 'text-white',
    icon: Shirt,
    iconColor: '#C2185B',
    bgColor: '#FCE4EC',
    route: '/pazaryeri?kategori=moda-giyim-zanaat',
    description: 'Yerel üreticilerden ve zanaatkarlardan özgün giyim, hakiki deri ve el emeği tasarımlar.',
    subGroups: [
      {
        title: 'KADIN BUTİK GİYİM',
        items: [
          { name: 'Elbise & Abiye Modelleri', route: '/pazaryeri?kategori=moda-giyim-zanaat&sub=kadin' },
          { name: 'Butik Bluz & Gömlek', route: '/pazaryeri?kategori=moda-giyim-zanaat&sub=kadin' },
          { name: 'Oversize Ceket & Kaban', route: '/pazaryeri?kategori=moda-giyim-zanaat&sub=kadin' },
          { name: 'Triko & Hırka', route: '/pazaryeri?kategori=moda-giyim-zanaat&sub=kadin' }
        ]
      },
      {
        title: 'ERKEK GİYİM',
        items: [
          { name: 'Zanaatkar Takım Elbise', route: '/pazaryeri?kategori=moda-giyim-zanaat&sub=erkek' },
          { name: 'Pamuklu Gömlek & T-Shirt', route: '/pazaryeri?kategori=moda-giyim-zanaat&sub=erkek' },
          { name: 'Hakiki Deri Mont & Ceket', route: '/pazaryeri?kategori=moda-giyim-zanaat&sub=erkek' },
          { name: 'Kumaş & Kot Pantolon', route: '/pazaryeri?kategori=moda-giyim-zanaat&sub=erkek' }
        ]
      },
      {
        title: 'ATÖLYE & ZANAAT',
        items: [
          { name: 'El Yapımı Seramik Fincan', route: '/pazaryeri?kategori=moda-giyim-zanaat&sub=zanaat', badge: 'Atölye' },
          { name: 'Ahşap Oyma Dekorasyon', route: '/pazaryeri?kategori=moda-giyim-zanaat&sub=zanaat' },
          { name: 'Geleneksel Örgü & Nakış', route: '/pazaryeri?kategori=moda-giyim-zanaat&sub=zanaat' },
          { name: 'Tasarım Takı & Aksesuar', route: '/pazaryeri?kategori=moda-giyim-zanaat&sub=zanaat' }
        ]
      },
      {
        title: 'HAKİKİ DERİ & AYAKKABI',
        items: [
          { name: 'Hakiki Deri Oxford Ayakkabı', route: '/pazaryeri?kategori=moda-giyim-zanaat&sub=ayakkabi' },
          { name: 'Erkek & Kadın Sneaker', route: '/pazaryeri?kategori=moda-giyim-zanaat&sub=ayakkabi' },
          { name: 'Handmade Deri Çanta', route: '/pazaryeri?kategori=moda-giyim-zanaat&sub=ayakkabi' },
          { name: 'Kışlık Deri Bot & Çizme', route: '/pazaryeri?kategori=moda-giyim-zanaat&sub=ayakkabi' }
        ]
      }
    ],
    banner: {
      title: '✨ Zanaatkâr Butikleri Keşfet',
      description: 'El emeği deri, seramik ve özgün tekstil ürünlerini doğrudan üreticinin raf fiyatıyla satın alın.',
      btnText: 'Atölye Vitrinine Geç',
      route: '/pazaryeri?kategori=moda-giyim-zanaat'
    }
  },
  {
    id: 'ev-yasam-yapi',
    name: 'Ev, Yaşam & Yapı Market',
    badge: 'USTA RAFI',
    badgeBg: 'bg-[#00796B]',
    badgeTextColor: 'text-white',
    icon: Home,
    iconColor: '#00796B',
    bgColor: '#E0F2F1',
    route: '/pazaryeri?kategori=ev-yasam-yapi-market',
    description: 'Eviniz ve dükkanınız için dayanıklı mutfak eşyaları, hırdavat, boya ve bahçe ürünleri.',
    subGroups: [
      {
        title: 'MUTFAK & ZÜCCACİYE',
        items: [
          { name: 'Döküm Tencere & Tava Seti', route: '/pazaryeri?kategori=ev-yasam-yapi-market&sub=mutfak' },
          { name: 'Porselen Yemek Takımı', route: '/pazaryeri?kategori=ev-yasam-yapi-market&sub=mutfak' },
          { name: 'Sürmene Şef Bıçak Takımı', route: '/pazaryeri?kategori=ev-yasam-yapi-market&sub=mutfak', badge: 'Zanaat' },
          { name: 'Cam Saklama & Baharatlık', route: '/pazaryeri?kategori=ev-yasam-yapi-market&sub=mutfak' }
        ]
      },
      {
        title: 'EV TEKSTİLİ',
        items: [
          { name: '%100 Pamuk Nevresim Takımı', route: '/pazaryeri?kategori=ev-yasam-yapi-market&sub=tekstil' },
          { name: 'Denizli Dokuma Havlu & Bornoz', route: '/pazaryeri?kategori=ev-yasam-yapi-market&sub=tekstil' },
          { name: 'Etnik Dokuma Halı & Kilim', route: '/pazaryeri?kategori=ev-yasam-yapi-market&sub=tekstil' },
          { name: 'Özel Ölçü Perde & Tül', route: '/pazaryeri?kategori=ev-yasam-yapi-market&sub=tekstil' }
        ]
      },
      {
        title: 'HIRDAVAT & NALBURİYE',
        items: [
          { name: 'Şarjlı Matkap & El Aletleri', route: '/pazaryeri?kategori=ev-yasam-yapi-market&sub=hirdavat' },
          { name: 'Silinebilir İç Cephe Boyası', route: '/pazaryeri?kategori=ev-yasam-yapi-market&sub=hirdavat' },
          { name: 'Akıllı Kilit & Kapı Kolları', route: '/pazaryeri?kategori=ev-yasam-yapi-market&sub=hirdavat' },
          { name: 'LED Aydınlatma & Avize', route: '/pazaryeri?kategori=ev-yasam-yapi-market&sub=hirdavat' }
        ]
      },
      {
        title: 'BAHÇE & ÇİÇEK',
        items: [
          { name: 'Canlı Saksı Bitkileri', route: '/pazaryeri?kategori=ev-yasam-yapi-market&sub=bahce' },
          { name: 'Balkon & Bahçe Mobilyası', route: '/pazaryeri?kategori=ev-yasam-yapi-market&sub=bahce' },
          { name: 'Çim Biçme & Budama Makinesi', route: '/pazaryeri?kategori=ev-yasam-yapi-market&sub=bahce' },
          { name: 'Organik Sebze Fidesi & Tohum', route: '/pazaryeri?kategori=ev-yasam-yapi-market&sub=bahce' }
        ]
      }
    ],
    banner: {
      title: '🛠️ Nalburiye ve Yapı Market',
      description: 'Evinizin ihtiyacı olan usta aletlerini ve yapı malzemelerini mahalle nalburunuzdan temin edin.',
      btnText: 'Tüm Ev & Yapı Reyonunu Gör',
      route: '/pazaryeri?kategori=ev-yasam-yapi-market'
    }
  },
  {
    id: 'hizmet-ustalik-bakim',
    name: 'Hizmet & Ustalık & Bakım',
    badge: 'TAMTEKLİF',
    badgeBg: 'bg-[#512DA8]',
    badgeTextColor: 'text-white',
    icon: Wrench,
    iconColor: '#512DA8',
    bgColor: '#EDE7F6',
    route: '/pazaryeri?kategori=hizmet-ustalik-bakim',
    description: 'Harita konumlu acil ustalar, kapalı devre fiyat teklifleri ve yerel saha servisleri.',
    subGroups: [
      {
        title: 'EV TADİLAT & TESİSAT',
        items: [
          { name: '7/24 Nöbetçi Su Tesisatçısı', route: '/pazaryeri?kategori=hizmet-ustalik-bakim&sub=tesisat', badge: 'Acil' },
          { name: 'Elektrik Arıza & Panosu', route: '/pazaryeri?kategori=hizmet-ustalik-bakim&sub=elektrik' },
          { name: 'Boya Badana & Mutfak Tadilatı', route: '/pazaryeri?kategori=hizmet-ustalik-bakim&sub=boyama' },
          { name: '7/24 Çilingir Servisi', route: '/pazaryeri?kategori=hizmet-ustalik-bakim' }
        ]
      },
      {
        title: 'BEYAZ EŞYA & İKLİMLENDİRME',
        items: [
          { name: 'Klima Montaj & Gaz Dolumu', route: '/pazaryeri?kategori=hizmet-ustalik-bakim&sub=klima' },
          { name: 'Kombi Bakımı & Petek Temizliği', route: '/pazaryeri?kategori=hizmet-ustalik-bakim&sub=klima' },
          { name: 'Çamaşır & Bulaşık Makinesi Arıza', route: '/pazaryeri?kategori=hizmet-ustalik-bakim' },
          { name: 'Buzdolabı Motor Değişimi', route: '/pazaryeri?kategori=hizmet-ustalik-bakim' }
        ]
      },
      {
        title: 'TEMİZLİK & BAKIM',
        items: [
          { name: 'Gündelik Ev & Ofis Temizliği', route: '/pazaryeri?kategori=hizmet-ustalik-bakim&sub=temizlik' },
          { name: 'Koltuk & Halı Yıkama Servisi', route: '/pazaryeri?kategori=hizmet-ustalik-bakim&sub=temizlik' },
          { name: 'Böcek & Haşere İlaçlama', route: '/pazaryeri?kategori=hizmet-ustalik-bakim' },
          { name: 'İnşaat Sonrası Temizlik', route: '/pazaryeri?kategori=hizmet-ustalik-bakim' }
        ]
      },
      {
        title: 'MEDYA & DİJİTAL',
        items: [
          { name: 'Düğün & Çekim Fotoğrafçısı', route: '/pazaryeri?kategori=hizmet-ustalik-bakim&sub=fotograf' },
          { name: 'Kurumsal Tanıtım Filmi', route: '/pazaryeri?kategori=hizmet-ustalik-bakim&sub=fotograf' },
          { name: 'E-Ticaret Ürün Çekimi', route: '/pazaryeri?kategori=hizmet-ustalik-bakim&sub=fotograf' },
          { name: 'Drone Hava Çekimi', route: '/pazaryeri?kategori=hizmet-ustalik-bakim&sub=fotograf' }
        ]
      }
    ],
    banner: {
      title: '👨‍🔧 TamTeklif ile Anında Fiyat Al',
      description: 'İhtiyacınızı yazın, fotoğraf yükleyin, şehrinizdeki kayıtlı ustalar size kapalı zarf teklifi sunsun.',
      btnText: 'Tüm Hizmet Tekliflerini Gör',
      route: '/pazaryeri?kategori=hizmet-ustalik-bakim'
    }
  },
  {
    id: 'dijital-varliklar',
    name: 'Dijital Varlıklar & Şablonlar',
    badge: 'ANINDA İNDİR',
    badgeBg: 'bg-[#1976D2]',
    badgeTextColor: 'text-white',
    icon: FileCode,
    iconColor: '#1976D2',
    bgColor: '#E3F2FD',
    route: '/pazaryeri?kategori=tamdijital',
    description: 'Anında lisanslı indirme: ZIP, DST, DXF, STL ve sosyal şablonlar.',
    subGroups: [
      {
        title: 'GRAFİK & LAZER KESİM',
        items: [
          { name: 'Lazer Kesim CNC Ahşap DXF/SVG', route: '/pazaryeri?kategori=tamdijital&sub=cnc', badge: 'DXF' },
          { name: '3D Yazıcı STL Heykel Modelleri', route: '/pazaryeri?kategori=tamdijital&sub=cnc' },
          { name: 'Maraş İşi Nakış Desenleri (PES/DST)', route: '/pazaryeri?kategori=tamdijital' },
          { name: 'Sosyal Medya Canva & PSD Kit', route: '/pazaryeri?kategori=tamdijital&sub=sosyal' }
        ]
      },
      {
        title: 'E-KİTAP & REHBERLER',
        items: [
          { name: 'Esnaf İçin E-Ticaret Kılavuzu', route: '/pazaryeri?kategori=tamdijital&sub=ekitap' },
          { name: 'Sanal POS Entegrasyon Rehberi', route: '/pazaryeri?kategori=tamdijital&sub=ekitap' },
          { name: 'Organik Tarım & Ahşap İşçiliği Kitabı', route: '/pazaryeri?kategori=tamdijital&sub=ekitap' },
          { name: 'GİB e-Fatura Muhasebe Kılavuzu', route: '/pazaryeri?kategori=tamdijital&sub=ekitap' }
        ]
      },
      {
        title: 'YAZILIM & ŞABLONLAR',
        items: [
          { name: 'Vite & React E-Ticaret UI Kit', route: '/pazaryeri?kategori=tamdijital&sub=vektor' },
          { name: 'WordPress Woocommerce Entegrasyonu', route: '/pazaryeri?kategori=tamdijital' },
          { name: 'Excel Ön Muhasebe & Stok Şablonu', route: '/pazaryeri?kategori=tamdijital' },
          { name: 'Otomatik Barkod Etiket Yazılımı', route: '/pazaryeri?kategori=tamdijital' }
        ]
      }
    ],
    banner: {
      title: '💻 Anında Güvenli İndirme (TamDijital)',
      description: 'Satın aldığınız an üreticinin lisanslı dijital dosyasını kargo beklemeden saniyesinde indirin.',
      btnText: 'Tüm Dijital Varlıkları Gör',
      route: '/pazaryeri?kategori=tamdijital'
    }
  },
  {
    id: 'b2b-toptan',
    name: 'B2B Kapalı Devre Toptan',
    badge: '%0 KOMİSYON',
    badgeBg: 'bg-[#0B132B]',
    badgeTextColor: 'text-amber-300',
    icon: Package,
    iconColor: '#F59E0B',
    bgColor: '#FFF8E1',
    route: '/toptan',
    description: 'Kademeli iskonto, çuvallı gıda, ambalaj ve koli satışı ile B2B toptan tedarik.',
    subGroups: [
      {
        title: 'KOLİ & AMBALAJ',
        items: [
          { name: 'Oluklu Mukavva Taşıma Kolisi', route: '/toptan?sub=ambalaj', badge: 'Koli' },
          { name: 'Kraft Pencereli Kese Kağıdı', route: '/toptan?sub=ambalaj' },
          { name: 'Palet Streç Film & Koli Bandı', route: '/toptan?sub=ambalaj' },
          { name: 'Özel Logolu Baskılı Kutu', route: '/toptan?sub=ambalaj' }
        ]
      },
      {
        title: 'TOPTAN GIDA & BAKLİYAT',
        items: [
          { name: '50kg Çuval Osmancık Pirinç', route: '/toptan?sub=bakliyat', badge: 'Çuval' },
          { name: '18L Teneke Sızma Zeytinyağı', route: '/toptan?sub=bakliyat' },
          { name: 'Dökme Kavrulmuş İç Fındık', route: '/toptan?sub=bakliyat' },
          { name: 'Toptan Şarküteri & Blok Peynir', route: '/toptan?sub=bakliyat' }
        ]
      },
      {
        title: 'HORECA & TEMİZLİK',
        items: [
          { name: 'Baskılı Restoran Peçete & Islak Mendil', route: '/toptan?sub=temizlik' },
          { name: 'Kullan-At Sızdırmaz Çorba Kabı', route: '/toptan?sub=temizlik' },
          { name: 'Endüstriyel Bulaşık Deterjanı', route: '/toptan?sub=temizlik' },
          { name: 'Kurye Termo Taşıma Çantaları', route: '/toptan?sub=temizlik' }
        ]
      }
    ],
    banner: {
      title: '🏢 B2B Kapalı Devre Toptan Depo',
      description: 'Üreticiden doğrudan palet bazlı indirimli satın alın. GİB e-irsaliye güvencesiyle sevk edin.',
      btnText: 'Tüm Toptan Fırsatlarını Gör',
      route: '/toptan'
    }
  },
  {
    id: 'tamkurye',
    name: 'TamKurye: Bağımsız Kuryeler',
    badge: 'MAHALLE AĞI',
    badgeBg: 'bg-[#00838F]',
    badgeTextColor: 'text-white',
    icon: Bike,
    iconColor: '#00838F',
    bgColor: '#E0F7FA',
    route: '/kuryeler',
    description: 'Mahallenizde anında moto kurye çağırın veya kurye başvurusu yapın.',
    subGroups: [
      {
        title: 'MÜSAİT KURYELER',
        items: [
          { name: 'Şehir İçi Moto-Kurye (30 Dk)', route: '/kuryeler?action=cagir', badge: 'Anlık' },
          { name: 'Bisikletli & E-Bike Dağıtım', route: '/kuryeler?action=cagir' },
          { name: 'Yaya & Kampüs Teslimatçısı', route: '/kuryeler?action=cagir' },
          { name: 'Nöbetçi Gece Kuryeleri', route: '/kuryeler?action=cagir' }
        ]
      },
      {
        title: 'SAATLİK TAHSİS',
        items: [
          { name: 'Tam Gün Kurye Tahsisi (8 Saat)', route: '/kuryeler?action=fiyat' },
          { name: 'Yoğun Saat Mutfak Ekip Desteği', route: '/kuryeler?action=fiyat' },
          { name: 'Etkinlik & Toplu Evrak Dağıtımı', route: '/kuryeler?action=fiyat' },
          { name: 'Haftalık Sözleşmeli Kurye Hizmeti', route: '/kuryeler?action=fiyat' }
        ]
      },
      {
        title: 'SÜRÜCÜ BAŞVURUSU',
        items: [
          { name: 'Kurye Olarak Başvur', route: '/kuryeler?action=basvur' },
          { name: 'Sürücü Paneline Giriş Yap', route: '/kurye/giris' }
        ]
      }
    ],
    banner: {
      title: '🛵 TamKurye Bağımsız Lojistik Ağı',
      description: 'Dükkanınıza en yakın kuryeyi haritada görün, aracı komisyonu olmadan direkt çağırın.',
      btnText: 'Tüm Kurye Hizmetlerini Gör',
      route: '/kuryeler'
    }
  }
];

interface QuickCategoryBarProps {
  onOpenTamTeklif?: () => void;
}

export default function QuickCategoryBar({ onOpenTamTeklif }: QuickCategoryBarProps) {
  const navigate = useNavigate();
  const [activeCategoryId, setActiveCategoryId] = useState<string>('tum-kategoriler');

  const activeCategory = RICH_MEGA_CATEGORIES.find(c => c.id === activeCategoryId) || RICH_MEGA_CATEGORIES[0];

  const handleSubClick = (e: React.MouseEvent, route: string) => {
    e.stopPropagation();
    navigate(route);
  };

  return (
    <nav 
      aria-label="Hızlı Ticaret ve Keşif Kategorileri"
      className="bg-white border-b border-slate-200/80 py-3 shadow-2xs relative z-30"
    >
      <div className="max-w-7xl mx-auto px-4">
        
        {/* HORIZONTAL CATEGORY BUTTONS BAR */}
        <div className="flex items-start justify-start md:justify-center gap-3 sm:gap-5 overflow-x-auto md:overflow-visible scrollbar-none pb-2 pt-1 group/bar">
          {RICH_MEGA_CATEGORIES.map((cat, idx) => {
            const IconComponent = cat.icon;
            const isFirst = idx === 0;

            return (
              <div 
                key={cat.id} 
                className="relative shrink-0"
                onMouseEnter={() => setActiveCategoryId(cat.id)}
              >
                {/* Main Category Button */}
                <button
                  onClick={() => navigate(cat.route)}
                  className="flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 w-[95px] sm:w-[110px]"
                >
                  {/* Rounded Icon Box */}
                  <div 
                    className={`w-15 h-15 sm:w-17 sm:h-17 rounded-2xl flex items-center justify-center relative shadow-sm group-hover/bar:shadow-md transition-all duration-300 border ${
                      isFirst ? 'border-amber-400/60 ring-2 ring-amber-400/30' : 'border-black/5'
                    } ${activeCategoryId === cat.id ? 'ring-2 ring-[#0F4C3A] -translate-y-1 shadow-md' : ''}`}
                    style={{ backgroundColor: cat.bgColor }}
                  >
                    <IconComponent 
                      className="w-7 h-7 sm:w-8 sm:h-8 transition-transform" 
                      style={{ color: isFirst ? '#F59E0B' : cat.iconColor }}
                    />

                    {/* Badge Label Pill */}
                    <span 
                      className={`absolute -bottom-2 text-[9px] font-black uppercase tracking-tight px-2 py-0.5 rounded-full shadow-2xs whitespace-nowrap border border-white ${cat.badgeBg} ${cat.badgeTextColor}`}
                    >
                      {cat.badge}
                    </span>
                  </div>

                  {/* Category Title */}
                  <span className={`text-[11px] sm:text-xs font-bold text-center leading-tight line-clamp-2 mt-1 transition-colors ${
                    activeCategoryId === cat.id ? 'text-[#0F4C3A] font-black' : (isFirst ? 'text-[#0B132B] font-extrabold' : 'text-slate-800')
                  }`}>
                    {cat.name}
                  </span>
                </button>
              </div>
            );
          })}

          {/* TWO-COLUMN RICH MEGA MENU FLYOUT (OPENED ON HOVER OVER CATEGORY BAR) */}
          <div 
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[880px] max-w-[94vw] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-50 opacity-0 pointer-events-none group-hover/bar:opacity-100 group-hover/bar:pointer-events-auto transition-all duration-200 ease-out transform translate-y-2 group-hover/bar:translate-y-0 flex flex-col md:flex-row text-left"
          >
            
            {/* LEFT COLUMN: PAZARYERİ KATEGORİLERİ (~260px) */}
            <div className="w-full md:w-[280px] bg-slate-50/90 border-r border-slate-200 p-3 space-y-1 shrink-0">
              <div className="px-3 py-2 border-b border-slate-200/80 mb-2 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Pazaryeri Kategorileri
                </span>
                <span className="text-[9px] font-mono font-black text-amber-900 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded">
                  %0 Komisyon
                </span>
              </div>

              {RICH_MEGA_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = activeCategoryId === cat.id;

                return (
                  <button
                    key={cat.id}
                    onMouseEnter={() => setActiveCategoryId(cat.id)}
                    onClick={() => navigate(cat.route)}
                    className={`w-full text-left p-2.5 rounded-2xl transition-all flex items-center justify-between group cursor-pointer ${
                      isSelected 
                        ? 'bg-white text-[#0F4C3A] font-extrabold shadow-sm border border-slate-200' 
                        : 'text-slate-700 hover:bg-slate-200/60 font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div 
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#0B132B] text-amber-400' : 'bg-slate-200 text-slate-700'
                        }`}
                        style={!isSelected ? { backgroundColor: cat.bgColor, color: cat.iconColor } : {}}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate text-xs">
                        <div className="truncate">{cat.name}</div>
                        <span className={`text-[8.5px] font-black px-1.5 py-0.2 rounded uppercase ${cat.badgeBg} ${cat.badgeTextColor}`}>
                          {cat.badge}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                      isSelected ? 'text-[#0F4C3A] translate-x-1' : 'text-slate-300'
                    }`} />
                  </button>
                );
              })}
            </div>

            {/* RIGHT COLUMN: DYNAMIC ACTIVE CATEGORY CONTENT (~600px) */}
            <div className="flex-1 p-5 md:p-6 bg-white flex flex-col justify-between space-y-5">
              
              {/* Top Header & Description */}
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-black text-[#0B132B]">
                      {activeCategory.name}
                    </h3>
                    <span className={`text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full ${activeCategory.badgeBg} ${activeCategory.badgeTextColor}`}>
                      {activeCategory.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {activeCategory.description}
                  </p>
                </div>

                <button
                  onClick={() => navigate(activeCategory.route)}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#0F4C3A] border border-emerald-200 rounded-xl text-xs font-black transition cursor-pointer shrink-0 flex items-center gap-1"
                >
                  <span>Tümünü Gör</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 3 OR 4 COLUMN SUB-HEADINGS GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                {activeCategory.subGroups.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-2">
                    <h4 className="text-[11px] font-black text-[#0B132B] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
                      <span className="truncate">{group.title}</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs">
                      {group.items.map((item, iIdx) => (
                        <li key={iIdx}>
                          <button
                            onClick={(e) => handleSubClick(e, item.route)}
                            className="w-full text-left text-[11px] sm:text-xs font-semibold text-slate-600 hover:text-[#0F4C3A] hover:translate-x-0.5 transition-all flex items-center justify-between group/link cursor-pointer"
                          >
                            <span className="truncate group-hover/link:font-bold">{item.name}</span>
                            {item.badge && (
                              <span className="text-[8px] font-black uppercase px-1 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-200 shrink-0 ml-1">
                                {item.badge}
                              </span>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* BOTTOM DARK FEATURED BANNER */}
              <div className="bg-gradient-to-r from-[#0B132B] via-[#0F4C3A] to-[#0B132B] text-white p-4 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-xs font-black text-amber-400">
                    {activeCategory.banner.title}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    {activeCategory.banner.description}
                  </p>
                </div>

                <button
                  onClick={() => navigate(activeCategory.banner.route)}
                  className="px-3.5 py-2 bg-[#F59E0B] hover:bg-amber-400 text-[#0B132B] font-black text-xs rounded-xl shadow-md transition cursor-pointer shrink-0 flex items-center gap-1"
                >
                  <span>{activeCategory.banner.btnText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </nav>
  );
}

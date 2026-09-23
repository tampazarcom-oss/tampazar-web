/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Database, Server, Cpu, Search, Layers, Shield, Key, Shuffle } from 'lucide-react';

export default function SystemArchitecture() {
  const [activeSchemaTab, setActiveSchemaTab] = useState<'tables' | 'rls' | 'prisma'>('tables');

  const sqlTables = `-- 1. TENANTS & SUBSCRIPTIONS (CORE SAAS)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    plan_tier VARCHAR(50) DEFAULT 'starter' CHECK (plan_tier IN ('starter', 'pro', 'enterprise')),
    product_limit INT NOT NULL DEFAULT 100,
    byo_pos_connected BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. BYO SANAL POS ENTEGRASYONU (AES-256 ŞİFRELİ)
CREATE TABLE tenant_pos_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL CHECK (provider IN ('paytr', 'iyzico', 'sipay', 'stripe')),
    merchant_id VARCHAR(255) NOT NULL,
    api_key VARCHAR(255) NOT NULL,
    api_secret_encrypted BYTEA NOT NULL, -- AES-256-GCM ciphertext
    encryption_iv BYTEA NOT NULL,
    encryption_tag BYTEA NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_tenant_provider UNIQUE (tenant_id, provider)
);

-- 3. ÇOK YÖNLÜ ÜRÜN KATALOĞU (PERAKENDE, TOPTAN, HİZMET)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('retail', 'wholesale', 'service')),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    vat_rate DECIMAL(5, 2) NOT NULL, -- e.g. 20.00, 10.00, 1.00
    variants JSONB DEFAULT '{}'::jsonb, -- Store retail variants (colors, sizes)
    moq INT DEFAULT 1, -- B2B MOQ
    tiered_prices JSONB DEFAULT '[]'::jsonb, -- B2B Tier pricing ranges
    duration_minutes INT, -- Service duration
    booking_slots TEXT[], -- Service booking calendar slots
    service_radius_km INT, -- Service area boundary
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. YERLEŞİK ÖN MUHASEBE (CARİ HAREKETLER)
CREATE TABLE ledger_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL, -- e.g. 120.01.001 (Unified Accounting Standards)
    type VARCHAR(50) CHECK (type IN ('buyer', 'supplier')),
    balance DECIMAL(15, 2) DEFAULT 0.00,
    email VARCHAR(255),
    tax_id VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_tenant_account_code UNIQUE (tenant_id, code)
);

CREATE TABLE ledger_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES ledger_accounts(id),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT NOT NULL,
    debit DECIMAL(15, 2) NOT NULL DEFAULT 0.00, -- Borç (Receivable)
    credit DECIMAL(15, 2) NOT NULL DEFAULT 0.00, -- Alacak (Payable / Collection)
    balance_after DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. E-FATURA & E-ARŞİV LOĞLARI
CREATE TABLE tenant_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    invoice_number VARCHAR(100) UNIQUE NOT NULL, -- e.g., GIB2026000000213
    order_id VARCHAR(100),
    customer_name VARCHAR(255) NOT NULL,
    customer_tax_id VARCHAR(50) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    vat_amount DECIMAL(12, 2) NOT NULL,
    withholding_amount DECIMAL(12, 2) DEFAULT 0.00, -- Tevkifat Tutarı
    total_payable DECIMAL(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'queued', 'issued', 'failed')),
    xml_payload TEXT, -- GİB UBL-TR XML Document
    integrator_provider VARCHAR(50) NOT NULL, -- gib, uyumsoft, edm, vb.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`;

  const sqlRls = `-- 1. ROW LEVEL SECURITY (RLS) AKTİVASYONU
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_pos_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_invoices ENABLE ROW LEVEL SECURITY;

-- 2. KİRACI GÜVENLİK SÖZLEŞMELERİ (TENANT POLICIES)
-- Postgre uygulamasında session bazlı 'app.current_tenant_id' değişkeni set edilmektedir.

CREATE POLICY product_tenant_isolation ON products
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY pos_config_tenant_isolation ON tenant_pos_configs
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY ledger_accounts_tenant_isolation ON ledger_accounts
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY ledger_transactions_tenant_isolation ON ledger_transactions
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY invoice_tenant_isolation ON tenant_invoices
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);`;

  const prismaSchema = `// Prisma Multi-Tenant Schema Config
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Tenant {
  id               String            @id @default(uuid())
  name             String
  slug             String            @unique
  planTier         String            @default("starter")
  productLimit     Int               @default(100)
  byoPosConnected  Boolean           @default(false)
  posConfigs       TenantPosConfig[]
  products         Product[]
  ledgerAccounts   LedgerAccount[]
  ledgerTransactions LedgerTransaction[]
  invoices         TenantInvoice[]
  createdAt        DateTime          @default(now())
}

model TenantPosConfig {
  id                  String   @id @default(uuid())
  tenantId            String
  tenant              Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  provider            String   // paytr, iyzico, stripe
  merchantId          String
  apiKey              String
  apiSecretEncrypted  Bytes    // AES-256 Encrypted Bytes
  encryptionIv        Bytes
  encryptionTag       Bytes
  isActive            Boolean  @default(true)
  createdAt           DateTime @default(now())

  @@unique([tenantId, provider])
}

model Product {
  id                 String   @id @default(uuid())
  tenantId           String
  tenant             Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  type               String   // retail, wholesale, service
  title              String
  slug               String
  category           String
  description        String?
  price              Float
  sku                String
  vatRate            Float
  variants           Json     @default("{}") // JSONB
  moq                Int      @default(1)
  tieredPrices       Json     @default("[]") // B2B Tier pricing array
  durationMinutes    Int?
  bookingSlots       String[]
  serviceRadiusKm    Int?
  createdAt          DateTime @default(now())
}`;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Editorial Header */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-mono text-amber-600 tracking-wider uppercase font-bold bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
            tampazar.com · Sistem Mimarisi & Temel İş Felsefesi
          </span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 mt-2">
            Açık Dijital AVM ve Entegre Ticaret İşletim Sistemi
          </h2>
          <p className="text-slate-600 text-sm mt-1 max-w-3xl leading-relaxed">
            tampazar.com bir aracı kurum değil, fiziksel bir çarşı ve AVM'nin dijital dünyadaki modern karşılığıdır. Platform işletmelere yer tahsis eder (sabit aidat), satıştan komisyon kesmez (%0 Komisyon), her işletmenin kendi kasasıyla (Sanal POS) doğrudan tahsilat yapmasını ve GİB uyumlu fatura kesmesini sağlar.
          </p>
        </div>

        {/* 5 Temel İş Felsefesi Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-black text-amber-600 block">1. Dijital AVM Modeli</span>
            <p className="text-[11px] text-slate-500 leading-snug">
              Sabit aidat/kira ile yer tahsisi. Satıştan sıfır komisyon (%0).
            </p>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-black text-emerald-600 block">2. Kendi Kasasını Bağlama</span>
            <p className="text-[11px] text-slate-500 leading-snug">
              Esnafın kendi Sanal POS'u ile doğrudan banka hesabına tahsilat.
            </p>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-black text-indigo-600 block">3. Açık ve Şeffaf İletişim</span>
            <p className="text-[11px] text-slate-500 leading-snug">
              Telefon, adres, WhatsApp, web sitesi sansürsüz ve özgürce açık.
            </p>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-black text-sky-600 block">4. Çoklu Sektör Kapsamı</span>
            <p className="text-[11px] text-slate-500 leading-snug">
              Perakende, toptan B2B, sıcak yemek, usta & acil yol yardım.
            </p>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-black text-purple-600 block">5. Yerleşik Ön Muhasebe</span>
            <p className="text-[11px] text-slate-500 leading-snug">
              Satış anında GİB UBL-TR 2.1 e-Fatura ve anlık cari defter takibi.
            </p>
          </div>
        </div>
      </div>

      {/* Visual System Architecture Diagram */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800 mb-6 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-600" />
          Uçtan Uca Veri ve Ödeme Trafiği Akış Diyagramı
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-center">
          {/* Client layer */}
          <div className="border border-slate-100 rounded-lg p-4 bg-slate-50 text-center space-y-3">
            <div className="mx-auto w-10 h-10 bg-slate-200/60 rounded-full flex items-center justify-center text-slate-700 font-semibold text-sm">
              🖥️
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-800">Alıcı Vitrini & Panel</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">SSR Next.js Storefront</p>
            </div>
            <div className="text-[10px] bg-white border border-slate-100 py-1 px-2 rounded text-slate-500 font-mono">
              tampazar.com/magaza/
            </div>
          </div>

          {/* Traffic arrow */}
          <div className="hidden lg:flex flex-col items-center justify-center text-slate-300">
            <Shuffle className="w-5 h-5 text-slate-400 animate-pulse" />
            <span className="text-[9px] font-mono mt-1 text-slate-400">HTTPS / API</span>
          </div>

          {/* Backend Controller & Middleware layer */}
          <div className="border border-emerald-100 rounded-lg p-4 bg-emerald-50/40 text-center space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-600 text-[8px] text-white font-mono px-1.5 py-0.5 rounded-bl">
              JWT Decrypted
            </div>
            <div className="mx-auto w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-emerald-900">Modüler NestJS API</h4>
              <p className="text-[11px] text-emerald-600 mt-0.5">Multi-Tenant Guard</p>
            </div>
            <div className="text-[10px] bg-white border border-emerald-100/50 py-1 px-2 rounded text-emerald-700 font-mono">
              SET app.current_tenant_id
            </div>
          </div>

          {/* Queue & Cache Arrow */}
          <div className="hidden lg:flex flex-col items-center justify-center text-slate-300">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span className="text-[9px] font-mono mt-1 text-indigo-500">BullMQ Redis</span>
          </div>

          {/* Databases layer */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 text-center space-y-3">
            <div className="mx-auto w-10 h-10 bg-slate-200/60 rounded-full flex items-center justify-center text-slate-700">
              <Database className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-800">PostgreSQL RLS</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Multi-Tenant Partitioning</p>
            </div>
            <div className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 py-1 px-2 rounded font-mono">
              AES-256 Secrets Store
            </div>
          </div>
        </div>

        {/* Real-time sync subsystems */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-3 items-start">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-800">Redis & BullMQ Asenkron Kuyruk</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                GİB Portal / Uyumsoft Entegratör API e-fatura çağrıları kuyruğa alınarak asenkron işlenir. Sunucunun yorulmasını engeller ve API hata durumlarında 3 tekrarlı retry mekanizmasını tetikler.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600 shrink-0">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-800">Meilisearch Faceted Search Sync</h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Ürün eklendiğinde veya stok değiştiğinde, tetikleyici asenkron olarak Meilisearch arama dizinlerini günceller. Alıcılar için milisaniyeler seviyesinde akıllı filtreleme sunar.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Code Database Schemas Inspector */}
      <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-xl overflow-hidden shadow-md">
        {/* Top Header Selector */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold tracking-tight">Üretime Hazır Veritabanı Şemaları (TypeScript strict)</h3>
          </div>
          {/* Segmented control buttons */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg">
            <button
              onClick={() => setActiveSchemaTab('tables')}
              className={`px-3 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap ${
                activeSchemaTab === 'tables' ? 'bg-slate-700 text-slate-100' : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              Postgres Tables
            </button>
            <button
              onClick={() => setActiveSchemaTab('rls')}
              className={`px-3 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap ${
                activeSchemaTab === 'rls' ? 'bg-slate-700 text-slate-100' : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              RLS Policies
            </button>
            <button
              onClick={() => setActiveSchemaTab('prisma')}
              className={`px-3 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap ${
                activeSchemaTab === 'prisma' ? 'bg-slate-700 text-slate-100' : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              Prisma Schema
            </button>
          </div>
        </div>

        {/* Schema Viewer panel */}
        <div className="p-6 font-mono text-xs leading-relaxed max-h-[480px] overflow-y-auto bg-slate-950/80 scrollbar-thin scrollbar-thumb-slate-800">
          {activeSchemaTab === 'tables' && (
            <pre className="text-emerald-400">
              <code>{sqlTables}</code>
            </pre>
          )}
          {activeSchemaTab === 'rls' && (
            <pre className="text-indigo-400">
              <code>{sqlRls}</code>
            </pre>
          )}
          {activeSchemaTab === 'prisma' && (
            <pre className="text-cyan-400">
              <code>{prismaSchema}</code>
            </pre>
          )}
        </div>

        {/* Security badge overlay */}
        <div className="px-6 py-3.5 bg-slate-900 border-t border-slate-800/50 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <Key className="w-3.5 h-3.5 text-emerald-500" />
            <span>Şifreli POS verileri veri tabanında asla düz metin (plain text) olarak saklanmaz.</span>
          </div>
          <span className="font-mono text-emerald-500 font-semibold uppercase">AES-256-GCM + IV Verified</span>
        </div>
      </div>
    </div>
  );
}

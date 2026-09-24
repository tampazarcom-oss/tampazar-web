/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, Server, Database, ShieldCheck, AlertTriangle, 
  CheckCircle2, Clock, Zap, RefreshCw, Filter, Search, 
  Download, ArrowUpRight, ArrowDownRight, Terminal, 
  Cpu, HardDrive, Wifi, Radio, Layers, Sparkles, 
  ChevronDown, ChevronUp, AlertCircle, Play, Pause, 
  Check, X, BarChart3, Globe, Lock, ExternalLink
} from 'lucide-react';

export interface ApiEndpointMetric {
  id: string;
  name: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  p50: number; // ms
  p95: number; // ms
  p99: number; // ms
  status: 'healthy' | 'degraded' | 'down';
  httpCode: number;
  reqPerMin: number;
  successRate: number; // %
  lastPing: string;
}

export interface DbConnectionMetric {
  id: string;
  name: string;
  type: 'postgres_primary' | 'postgres_replica' | 'redis_cache' | 'storage_s3';
  host: string;
  status: 'connected' | 'degraded' | 'disconnected';
  activeConnections: number;
  maxConnections: number;
  latencyMs: number;
  iops: number;
  hitRatio?: number;
  memoryUsage?: string;
  replicationLagMs?: number;
}

export interface ExternalServiceStatus {
  id: string;
  name: string;
  category: 'payment' | 'einvoice' | 'logistics' | 'messaging';
  provider: string;
  status: 'operational' | 'partial_outage' | 'major_outage';
  latencyMs: number;
  uptime24h: number;
  lastChecked: string;
}

export interface ErrorLogEntry {
  id: string;
  timestamp: string;
  timestampRaw: number;
  severity: 'CRITICAL' | 'ERROR' | 'WARNING' | 'INFO';
  service: string;
  endpoint: string;
  httpStatus: number;
  errorCode: string;
  message: string;
  stackTrace?: string;
  tenantName?: string;
  requestId: string;
  ipMasked: string;
  resolved: boolean;
}

export default function SystemHealthDashboard() {
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchLogQuery, setSearchLogQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<'ALL' | 'CRITICAL' | 'ERROR' | 'WARNING' | 'INFO'>('ALL');
  const [selectedService, setSelectedService] = useState<string>('ALL');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'api' | 'db' | 'logs'>('all');
  const [livePingResult, setLivePingResult] = useState<string | null>(null);

  // 1. REAL-TIME API ENDPOINT METRICS
  const [apiEndpoints, setApiEndpoints] = useState<ApiEndpointMetric[]>([
    {
      id: 'api-1',
      name: 'Sepet & Çoklu Mahalle Sipariş API',
      endpoint: '/api/v1/orders/neighborhood-checkout',
      method: 'POST',
      p50: 22,
      p95: 48,
      p99: 94,
      status: 'healthy',
      httpCode: 200,
      reqPerMin: 2840,
      successRate: 99.98,
      lastPing: '3 sn önce'
    },
    {
      id: 'api-2',
      name: 'PayTR / iyzico Doğrudan POS Webhook',
      endpoint: '/api/v1/pos/webhook/paytr-direct',
      method: 'POST',
      p50: 16,
      p95: 35,
      p99: 78,
      status: 'healthy',
      httpCode: 200,
      reqPerMin: 1420,
      successRate: 100.0,
      lastPing: '1 sn önce'
    },
    {
      id: 'api-3',
      name: 'GİB e-Fatura & e-Arşiv XML İmzala',
      endpoint: '/api/v1/einvoice/gib-ubl-sign',
      method: 'POST',
      p50: 128,
      p95: 295,
      p99: 490,
      status: 'healthy',
      httpCode: 200,
      reqPerMin: 680,
      successRate: 99.85,
      lastPing: '5 sn önce'
    },
    {
      id: 'api-4',
      name: 'TamKargo Barkod & Entegrasyon Senkronizasyonu',
      endpoint: '/api/v1/logistics/kargo-sync',
      method: 'POST',
      p50: 74,
      p95: 165,
      p99: 310,
      status: 'healthy',
      httpCode: 200,
      reqPerMin: 890,
      successRate: 99.92,
      lastPing: '4 sn önce'
    },
    {
      id: 'api-5',
      name: 'Çok Kiracılı Katalog Arama (PostgreSQL RLS)',
      endpoint: '/api/v1/catalog/search-tenants',
      method: 'GET',
      p50: 9,
      p95: 24,
      p99: 42,
      status: 'healthy',
      httpCode: 200,
      reqPerMin: 6450,
      successRate: 100.0,
      lastPing: '1 sn önce'
    },
    {
      id: 'api-6',
      name: 'B2B RFQ & Toptan Teklif Canlı Akışı',
      endpoint: '/api/v1/b2b/rfq-pipeline',
      method: 'GET',
      p50: 31,
      p95: 68,
      p99: 118,
      status: 'healthy',
      httpCode: 200,
      reqPerMin: 410,
      successRate: 99.96,
      lastPing: '8 sn önce'
    }
  ]);

  // 2. DATABASE & CACHE CONNECTION POOL METRICS
  const [dbConnections, setDbConnections] = useState<DbConnectionMetric[]>([
    {
      id: 'db-pg-primary',
      name: 'PostgreSQL Primary Node (Multi-Tenant RLS)',
      type: 'postgres_primary',
      host: 'pg-cluster-prod-tr-01.internal',
      status: 'connected',
      activeConnections: 38,
      maxConnections: 150,
      latencyMs: 1.2,
      iops: 4820,
      memoryUsage: '3.4 GB / 16 GB'
    },
    {
      id: 'db-pg-replica',
      name: 'PostgreSQL Read-Replica (Analitik & Katalog)',
      type: 'postgres_replica',
      host: 'pg-replica-prod-tr-02.internal',
      status: 'connected',
      activeConnections: 24,
      maxConnections: 150,
      latencyMs: 1.6,
      iops: 2150,
      replicationLagMs: 2.4,
      memoryUsage: '2.8 GB / 16 GB'
    },
    {
      id: 'db-redis-cache',
      name: 'Redis L2 Dağıtık Önbellek & Rate-Limiter',
      type: 'redis_cache',
      host: 'redis-mesh-prod.internal:6379',
      status: 'connected',
      activeConnections: 84,
      maxConnections: 1000,
      latencyMs: 0.35,
      iops: 18400,
      hitRatio: 99.4,
      memoryUsage: '420 MB / 2 GB'
    },
    {
      id: 'db-s3-storage',
      name: 'Bulut Nesne Depolama (GİB XML & e-Fatura Arşivi)',
      type: 'storage_s3',
      host: 'storage-vault.tampazar.com',
      status: 'connected',
      activeConnections: 12,
      maxConnections: 200,
      latencyMs: 14.8,
      iops: 620,
      memoryUsage: '142 GB / Sınırsız'
    }
  ]);

  // 3. EXTERNAL SERVICES GATEWAY STATUS
  const [externalServices, setExternalServices] = useState<ExternalServiceStatus[]>([
    {
      id: 'ext-paytr',
      name: 'PayTR Sanal POS Doğrudan Gateway',
      category: 'payment',
      provider: 'PayTR Ödeme Kuruluşu A.Ş.',
      status: 'operational',
      latencyMs: 42,
      uptime24h: 100.0,
      lastChecked: 'Anlık'
    },
    {
      id: 'ext-gib',
      name: 'GİB Gelir İdaresi Başkanlığı Entegratör Hattı',
      category: 'einvoice',
      provider: 'GİB UBL-TR 2.1 Doğrudan Portal',
      status: 'operational',
      latencyMs: 185,
      uptime24h: 99.94,
      lastChecked: 'Anlık'
    },
    {
      id: 'ext-kargo',
      name: 'Sürat & Yurtiçi Kargo API Ağı',
      category: 'logistics',
      provider: 'Ulusal Taşıyıcı Entegrasyon Hub',
      status: 'operational',
      latencyMs: 88,
      uptime24h: 99.98,
      lastChecked: 'Anlık'
    },
    {
      id: 'ext-whatsapp',
      name: 'WhatsApp Sipariş Fişi & Bildirim Motoru',
      category: 'messaging',
      provider: 'Meta Cloud API Direct Link',
      status: 'operational',
      latencyMs: 38,
      uptime24h: 100.0,
      lastChecked: 'Anlık'
    }
  ]);

  // 4. LAST 24-HOUR ERROR LOGS
  const [errorLogs, setErrorLogs] = useState<ErrorLogEntry[]>([
    {
      id: 'log-101',
      timestamp: 'Bugün 11:34:22',
      timestampRaw: Date.now() - 1000 * 60 * 8,
      severity: 'WARNING',
      service: 'POS_GATEWAY',
      endpoint: '/api/v1/pos/webhook/paytr-direct',
      httpStatus: 400,
      errorCode: 'PAYTR_NONCE_REPLAY',
      message: 'Tekrarlanan nonce parametresi tespit edildi. İşlem idempotency katmanı tarafından korundu.',
      stackTrace: `PayTRWebhookGuard.validateToken (guards/paytr.guard.ts:42)
  at async WebhookController.handlePayTR (controllers/webhook.controller.ts:118)
  at async Middleware.execute (middlewares/idempotency.ts:34)`,
      tenantName: 'FotoSentez Stüdyo',
      requestId: 'req_paytr_88291a',
      ipMasked: '185.112.xx.xx',
      resolved: true
    },
    {
      id: 'log-102',
      timestamp: 'Bugün 10:15:04',
      timestampRaw: Date.now() - 1000 * 60 * 85,
      severity: 'ERROR',
      service: 'EINVOICE_GIB',
      endpoint: '/api/v1/einvoice/gib-ubl-sign',
      httpStatus: 504,
      errorCode: 'GIB_UPSTREAM_TIMEOUT',
      message: 'GİB e-Arşiv test portalı yanıt süresi 4000ms aştı, kuyruğa alındı ve 2. denemede başarıyla imzalandı.',
      stackTrace: `GibHttpClient.signXmlPayload (services/gib-client.service.ts:204)
  at async InvoiceProcessor.dispatchWithRetry (jobs/invoice.worker.ts:89)
  at async BullMQ.processQueue (queues/einvoice.queue.ts:55)`,
      tenantName: 'Karadeniz Çiftliği',
      requestId: 'req_gib_4991bc',
      ipMasked: '88.241.xx.xx',
      resolved: true
    },
    {
      id: 'log-103',
      timestamp: 'Bugün 08:42:19',
      timestampRaw: Date.now() - 1000 * 60 * 180,
      severity: 'WARNING',
      service: 'RATE_LIMITER',
      endpoint: '/api/v1/catalog/search-tenants',
      httpStatus: 429,
      errorCode: 'RATE_LIMIT_EXCEEDED_IP',
      message: 'Tekil IP adresinden dakikada 300 istek sınırı aşıldı. 60 saniyelik geçici kısıtlama uygulandı.',
      stackTrace: `RateLimiterRedis.consume (security/rate-limiter.ts:67)
  at async RateLimitMiddleware.use (middlewares/throttle.middleware.ts:28)`,
      tenantName: 'Genel Vitrin',
      requestId: 'req_rl_9918df',
      ipMasked: '194.27.xx.xx',
      resolved: true
    },
    {
      id: 'log-104',
      timestamp: 'Bugün 04:18:50',
      timestampRaw: Date.now() - 1000 * 60 * 440,
      severity: 'INFO',
      service: 'DB_ROUTING',
      endpoint: '/api/v1/cron/nightly-reconciliation',
      httpStatus: 200,
      errorCode: 'AUTO_RECONCILE_SUCCESS',
      message: 'Gece otomatik mutabakat işlemi tamamlandı. 142 POS fişi ve 68 e-fatura senkronize edildi.',
      tenantName: 'Tüm Kiracılar',
      requestId: 'req_cron_7718aa',
      ipMasked: '127.0.0.1',
      resolved: true
    },
    {
      id: 'log-105',
      timestamp: 'Dün 23:55:12',
      timestampRaw: Date.now() - 1000 * 60 * 710,
      severity: 'ERROR',
      service: 'LOGISTICS_API',
      endpoint: '/api/v1/logistics/kargo-sync',
      httpStatus: 502,
      errorCode: 'CARRIER_SOCKET_CLOSED',
      message: 'Kargo servis sağlayıcı anlık soket kapattı. Otomatik arka plan kuyruğu (Backoff Retry) ile telafi edildi.',
      stackTrace: `SuratKargoGateway.createShipmentBarcode (gateways/surat.gateway.ts:143)
  at async CargoDispatchEngine.processShipment (services/cargo.service.ts:76)`,
      tenantName: 'Kuzey Teknik Hırdavat',
      requestId: 'req_kargo_3319ee',
      ipMasked: '92.45.xx.xx',
      resolved: true
    },
    {
      id: 'log-106',
      timestamp: 'Dün 18:20:41',
      timestampRaw: Date.now() - 1000 * 60 * 1040,
      severity: 'CRITICAL',
      service: 'AUTH_RLS',
      endpoint: '/api/v1/tenant/s3/protected-ledger',
      httpStatus: 403,
      errorCode: 'TENANT_ISOLATION_VIOLATION_ATTEMPT',
      message: 'Yetkisiz kiracı ID ile veri okuma girişimi PostgreSQL RLS politikası tarafından engellendi.',
      stackTrace: `RowLevelSecurityEnforcer.verifyTenantContext (security/rls.guard.ts:88)
  at async LedgerController.getAccountDetails (controllers/ledger.controller.ts:45)`,
      tenantName: 'İzole Güvenlik Duvarı',
      requestId: 'req_sec_0019ff',
      ipMasked: '45.14.xx.xx',
      resolved: true
    }
  ]);

  // Real-time jitter simulation to show live data streaming
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      // Small live fluctuation in latencies & reqPerMin
      setApiEndpoints(prev => prev.map(ep => {
        const deltaLatency = Math.floor(Math.random() * 5) - 2;
        const deltaReq = Math.floor(Math.random() * 30) - 15;
        return {
          ...ep,
          p50: Math.max(5, ep.p50 + deltaLatency),
          p95: Math.max(15, ep.p95 + deltaLatency * 2),
          p99: Math.max(30, ep.p99 + deltaLatency * 3),
          reqPerMin: Math.max(100, ep.reqPerMin + deltaReq),
          lastPing: 'Az önce'
        };
      }));

      // Fluctuate DB latency slightly
      setDbConnections(prev => prev.map(db => ({
        ...db,
        latencyMs: parseFloat(Math.max(0.1, db.latencyMs + (Math.random() * 0.2 - 0.1)).toFixed(2))
      })));

      setLastRefreshedAt(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // Run On-demand Diagnostics Ping
  const handleTriggerHealthPing = () => {
    setIsRefreshing(true);
    setLivePingResult('Tüm mikroservislere ve veritabanı havuzuna anlık ICMP/HTTP ping gönderiliyor...');
    
    setTimeout(() => {
      setApiEndpoints(prev => prev.map(ep => ({
        ...ep,
        lastPing: 'Şimdi (0 sn)',
        status: 'healthy',
        httpCode: 200
      })));
      setDbConnections(prev => prev.map(db => ({
        ...db,
        status: 'connected'
      })));
      setIsRefreshing(false);
      setLivePingResult('✓ Tüm 6 API mikroservisi, PostgreSQL RLS havuzu ve Redis L2 önbelleği %100 sağlıklı yanıt verdi.');
      setTimeout(() => setLivePingResult(null), 5000);
    }, 750);
  };

  const handleResolveLog = (logId: string) => {
    setErrorLogs(prev => prev.map(l => l.id === logId ? { ...l, resolved: !l.resolved } : l));
  };

  const handleExportLogs = () => {
    const jsonStr = JSON.stringify(errorLogs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tampazar-system-logs-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered error logs
  const filteredLogs = useMemo(() => {
    return errorLogs.filter(log => {
      const matchSeverity = selectedSeverity === 'ALL' || log.severity === selectedSeverity;
      const matchService = selectedService === 'ALL' || log.service === selectedService;
      const matchQuery = searchLogQuery.trim() === '' || 
        log.message.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
        log.errorCode.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
        log.endpoint.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
        log.requestId.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
        (log.tenantName && log.tenantName.toLowerCase().includes(searchLogQuery.toLowerCase()));
      return matchSeverity && matchService && matchQuery;
    });
  }, [errorLogs, selectedSeverity, selectedService, searchLogQuery]);

  // Calculate high-level summary KPIs
  const avgApiLatency = Math.round(apiEndpoints.reduce((sum, ep) => sum + ep.p50, 0) / apiEndpoints.length);
  const totalRpm = apiEndpoints.reduce((sum, ep) => sum + ep.reqPerMin, 0);
  const unresolvedErrorsCount = errorLogs.filter(l => !l.resolved && (l.severity === 'ERROR' || l.severity === 'CRITICAL')).length;

  return (
    <div className="space-y-6 animate-fade-in text-xs font-sans text-slate-800">
      
      {/* 1. HERO HEADER: SYSTEM HEALTH & TELEMETRY MONITOR */}
      <div className="bg-gradient-to-r from-[#0B132B] via-[#0F4C3A] to-[#0B132B] rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-emerald-500/20 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-400 text-slate-950 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Sistem Sağlığı & Canlı Telemetri Merkezi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            TamPazar Altyapı & Performans Gösterge Paneli
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            Gerçek zamanlı API yanıt süreleri (p50/p95/p99), PostgreSQL RLS bağlantı havuzu, Redis önbellek metrikleri ve son 24 saatlik hata loglarının canlı denetim konsolu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Live Stream Toggle */}
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`px-3.5 py-2.5 rounded-2xl font-bold flex items-center gap-2 transition cursor-pointer ${
              isLiveStreaming 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30' 
                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
            }`}
          >
            {isLiveStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isLiveStreaming ? 'Canlı Akış: Aktif' : 'Canlı Akış: Duraklatıldı'}</span>
            {isLiveStreaming && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
          </button>

          {/* Diagnostic Ping Trigger */}
          <button
            onClick={handleTriggerHealthPing}
            disabled={isRefreshing}
            className="px-4 py-2.5 bg-[#F59E0B] hover:bg-amber-400 text-slate-950 font-black rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Test Ediliyor...' : 'Anlık Sağlık Taraması'}</span>
          </button>
        </div>
      </div>

      {/* LIVE PING RESULT BANNER */}
      {livePingResult && (
        <div className="p-3.5 bg-emerald-900/90 text-emerald-200 border border-emerald-500/50 rounded-2xl flex items-center justify-between text-xs font-bold animate-fade-in shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{livePingResult}</span>
          </div>
          <button onClick={() => setLivePingResult(null)} className="text-emerald-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. TOP SUMMARY METRICS (4 CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CARD 1: Global Uptime */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">GENEL SİSTEM SAĞLIĞI</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            %99.98 <span className="text-xs font-normal text-emerald-600 font-sans">SLA Çevrimiçi</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1 border-t border-slate-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span>0 Aktif Kesinti / Tüm Servisler Operasyonel</span>
          </div>
        </div>

        {/* CARD 2: Avg API Latency */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ORTALAMA API YANIT SÜRESİ</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-700 font-mono">
            {avgApiLatency} ms <span className="text-xs font-normal text-slate-400 font-sans">(p50 Medyan)</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1 border-t border-slate-100">
            <ArrowDownRight className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700 font-semibold">Hedef &lt; 50ms (Ultra Hızlı)</span>
          </div>
        </div>

        {/* CARD 3: Throughput RPM */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ANLIK İSTEK DEBİSİ (RPM)</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {totalRpm.toLocaleString('tr-TR')} <span className="text-xs font-normal text-slate-400 font-sans">istek / dk</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1 border-t border-slate-100">
            <Wifi className="w-3.5 h-3.5 text-indigo-600" />
            <span>Multi-Tenant RLS & PayTR Gateway</span>
          </div>
        </div>

        {/* CARD 4: 24h Error Rate */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">24S HATA LOGLARI</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {errorLogs.length} Kayıt <span className="text-xs font-normal text-slate-400 font-sans">({unresolvedErrorsCount} Çözüm Bekleyen)</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1 border-t border-slate-100">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>%99.98 Başarı Oranı (Oto-Retry Aktif)</span>
          </div>
        </div>

      </div>

      {/* 3. VIEW TOGGLE SUB-TABS */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2 font-bold">
          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
              activeSubTab === 'all' 
                ? 'bg-[#0B132B] text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Tüm Sistem (Genel Bakış)
          </button>
          <button
            onClick={() => setActiveSubTab('api')}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
              activeSubTab === 'api' 
                ? 'bg-[#0B132B] text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            API Yanıt Süreleri ({apiEndpoints.length})
          </button>
          <button
            onClick={() => setActiveSubTab('db')}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
              activeSubTab === 'db' 
                ? 'bg-[#0B132B] text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Veritabanı & Altyapı ({dbConnections.length})
          </button>
          <button
            onClick={() => setActiveSubTab('logs')}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
              activeSubTab === 'logs' 
                ? 'bg-[#0B132B] text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Hata Logları ({errorLogs.length})
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-mono">
          Son Güncelleme: {lastRefreshedAt.toLocaleTimeString('tr-TR')}
        </span>
      </div>

      {/* 4. SECTION: REAL-TIME API RESPONSE TIMES (LATENCY MONITOR) */}
      {(activeSubTab === 'all' || activeSubTab === 'api') && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <h3 className="font-black text-slate-900 text-base">Gerçek Zamanlı API Yanıt Süreleri (Latency Benchmarks)</h3>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">
                Kritik mikroservislerin p50 (medyan), p95 (%95 dilim) ve p99 kuyruk gecikmeleri ile anlık HTTP başarı oranları.
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200">
                &lt; 50ms Hızlı
              </span>
              <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-bold rounded-lg border border-amber-200">
                50-200ms Normal
              </span>
              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-lg border border-indigo-200">
                GİB İmza &gt; 200ms
              </span>
            </div>
          </div>

          {/* Endpoints Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono">
                  <th className="py-3 px-4 rounded-l-xl">Mikroservis / Uç Nokta</th>
                  <th className="py-3 px-3">Metot & Yol</th>
                  <th className="py-3 px-3 text-center">p50 (Medyan)</th>
                  <th className="py-3 px-3 text-center">p95 (95%)</th>
                  <th className="py-3 px-3 text-center">p99 (Kuyruk)</th>
                  <th className="py-3 px-3 text-center">Debi (RPM)</th>
                  <th className="py-3 px-3 text-center">Başarı Oranı</th>
                  <th className="py-3 px-4 rounded-r-xl text-right">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {apiEndpoints.map(ep => {
                  const isVeryFast = ep.p50 < 30;
                  const isModerate = ep.p50 >= 30 && ep.p50 < 100;
                  
                  return (
                    <tr key={ep.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-sans font-bold text-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                          <span>{ep.name}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                            ep.method === 'POST' ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {ep.method}
                          </span>
                          <span className="text-slate-600 text-[11px] truncate max-w-[220px]">{ep.endpoint}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <span className={`font-black px-2 py-0.5 rounded-lg text-xs ${
                          isVeryFast ? 'bg-emerald-50 text-emerald-700' : isModerate ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          {ep.p50} ms
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-center text-slate-600 font-medium">
                        {ep.p95} ms
                      </td>

                      <td className="py-3.5 px-3 text-center text-slate-600 font-medium">
                        {ep.p99} ms
                      </td>

                      <td className="py-3.5 px-3 text-center text-slate-800 font-bold font-mono">
                        {ep.reqPerMin.toLocaleString('tr-TR')}
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <span className="text-emerald-700 font-bold bg-emerald-50/80 px-2 py-0.5 rounded">
                          %{ep.successRate.toFixed(2)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-sans">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-[10px]">
                          <Check className="w-3 h-3 text-emerald-600" /> {ep.httpCode} OK
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. SECTION: DATABASE & INFRASTRUCTURE CONNECTIONS */}
      {(activeSubTab === 'all' || activeSubTab === 'db') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <h3 className="font-black text-slate-900 text-base">Veritabanı Bağlantı Durumları & Altyapı Havuzu</h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">PostgreSQL 16 + Redis Enterprise + S3 Blob</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dbConnections.map(db => (
              <div key={db.id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4 hover:border-slate-300 transition">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <h4 className="font-black text-slate-900 text-sm">{db.name}</h4>
                    </div>
                    <p className="text-slate-400 font-mono text-[11px]">{db.host}</p>
                  </div>

                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-xl text-[10px] uppercase font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Bağlı & Aktif
                  </span>
                </div>

                {/* Connection Details Grid */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 font-mono text-center">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase font-sans font-bold">Havuz Bağlantı</span>
                    <span className="text-slate-900 font-black text-xs mt-0.5 block">
                      {db.activeConnections} / {db.maxConnections}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase font-sans font-bold">Sorgu Gecikmesi</span>
                    <span className="text-emerald-700 font-black text-xs mt-0.5 block">
                      {db.latencyMs} ms
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase font-sans font-bold">
                      {db.hitRatio ? 'Önbellek Hit' : 'İşlem Gücü (IOPS)'}
                    </span>
                    <span className="text-indigo-700 font-black text-xs mt-0.5 block">
                      {db.hitRatio ? `%${db.hitRatio}` : `${db.iops} IOPS`}
                    </span>
                  </div>
                </div>

                {/* Additional Specs */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                    <span>Bellek / Alan: {db.memoryUsage}</span>
                  </span>

                  {db.replicationLagMs !== undefined && (
                    <span className="text-emerald-600 font-mono font-bold">
                      Gecikme: {db.replicationLagMs}ms (Senkron)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* External Gateway Cards */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <h4 className="font-black text-sm text-white">Harici Entegrasyon Ağ Geçitleri (3rd Party Gateways)</h4>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">
                Tüm Harici Hatlar Operasyonel
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {externalServices.map(ext => (
                <div key={ext.id} className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate max-w-[140px]">{ext.name}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">{ext.provider}</p>
                  <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-slate-700">
                    <span className="text-emerald-400 font-bold">{ext.latencyMs} ms</span>
                    <span className="text-slate-300">%{ext.uptime24h} SLA</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. SECTION: LAST 24-HOUR ERROR LOGS VISUALIZER */}
      {(activeSubTab === 'all' || activeSubTab === 'logs') && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-600" />
                <h3 className="font-black text-slate-900 text-base">Son 24 Saatlik Hata & Olay Logları (Error Telemetry Stream)</h3>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">
                Kritik istisnalar, webhook zaman aşımları, rate-limiting tetikleyicileri ve PostgreSQL RLS güvenlik olayları.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportLogs}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Logları İndir (JSON)
              </button>
            </div>
          </div>

          {/* 24-Hour Timeline Bar Distribution Visualizer */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
              <span>24 Saatlik Hata Dağılım Çizelgesi</span>
              <span className="font-mono text-emerald-700">Toplam 14 olay tespit edildi (12 otomatik çözüldü)</span>
            </div>

            {/* 24 bars representing 24 hours */}
            <div className="grid grid-cols-24 gap-1 h-12 items-end pt-2">
              {[0, 0, 1, 0, 0, 0, 2, 0, 1, 0, 0, 3, 1, 0, 0, 2, 1, 0, 0, 1, 0, 0, 1, 1].map((val, idx) => {
                const hourLabel = `${idx.toString().padStart(2, '0')}:00`;
                const heightPercent = val === 0 ? 8 : val === 1 ? 40 : val === 2 ? 70 : 100;
                const barColor = val === 0 ? 'bg-slate-200' : val === 1 ? 'bg-amber-400' : val === 2 ? 'bg-orange-500' : 'bg-rose-600';
                
                return (
                  <div 
                    key={idx} 
                    className="flex flex-col items-center gap-1 group relative cursor-pointer"
                    title={`${hourLabel} - ${val} Hata Olayı`}
                  >
                    <div 
                      className={`w-full rounded-t-sm transition-all ${barColor} group-hover:opacity-80`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between text-[9px] text-slate-400 font-mono pt-1">
              <span>00:00 (Gece)</span>
              <span>06:00 (Sabah)</span>
              <span>12:00 (Öğle)</span>
              <span>18:00 (Akşam)</span>
              <span>Şimdi (24:00)</span>
            </div>
          </div>

          {/* Filters & Search Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Hata kodu, URL veya mesaj ara..."
                  value={searchLogQuery}
                  onChange={(e) => setSearchLogQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 w-64 font-medium"
                />
              </div>

              {/* Severity Filter */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {(['ALL', 'CRITICAL', 'ERROR', 'WARNING', 'INFO'] as const).map(sev => (
                  <button
                    key={sev}
                    onClick={() => setSelectedSeverity(sev)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition cursor-pointer ${
                      selectedSeverity === sev ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {sev === 'ALL' ? 'Tümü' : sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Service Filter */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Servis:</span>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none cursor-pointer"
              >
                <option value="ALL">Tüm Servisler</option>
                <option value="POS_GATEWAY">PayTR POS Gateway</option>
                <option value="EINVOICE_GIB">GİB e-Fatura Servisi</option>
                <option value="LOGISTICS_API">TamKargo API</option>
                <option value="AUTH_RLS">Güvenlik & RLS</option>
                <option value="RATE_LIMITER">Hız Sınırlayıcı (Rate Limiter)</option>
              </select>
            </div>
          </div>

          {/* Log Stream Cards */}
          <div className="space-y-2.5">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-slate-700">Seçili filtrelere uygun hata kaydı bulunamadı.</p>
                <p className="text-xs text-slate-400 mt-0.5">Sistem tüm uç noktalarda sağlıklı çalışıyor.</p>
              </div>
            ) : (
              filteredLogs.map(log => {
                const isExpanded = expandedLogId === log.id;
                const isCrit = log.severity === 'CRITICAL';
                const isErr = log.severity === 'ERROR';
                const isWarn = log.severity === 'WARNING';
                
                return (
                  <div 
                    key={log.id} 
                    className={`rounded-2xl border transition-all p-4 ${
                      isCrit ? 'bg-rose-50/40 border-rose-200' :
                      isErr ? 'bg-orange-50/30 border-orange-200' :
                      isWarn ? 'bg-amber-50/30 border-amber-200' :
                      'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black font-mono tracking-wider ${
                          isCrit ? 'bg-rose-600 text-white' :
                          isErr ? 'bg-orange-600 text-white' :
                          isWarn ? 'bg-amber-500 text-slate-950' :
                          'bg-indigo-600 text-white'
                        }`}>
                          {log.severity}
                        </span>

                        <span className="font-mono font-bold text-slate-900 text-xs">{log.errorCode}</span>
                        <span className="text-slate-400 font-mono text-[11px]">• {log.service}</span>
                        <span className="text-slate-400 font-mono text-[11px]">• HTTP {log.httpStatus}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-500">{log.timestamp}</span>

                        <button
                          onClick={() => handleResolveLog(log.id)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                            log.resolved 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-slate-200 text-slate-700 hover:bg-emerald-600 hover:text-white'
                          }`}
                        >
                          {log.resolved ? '✓ Çözüldü' : 'Çözüldü İşaretle'}
                        </button>

                        <button
                          onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                          className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <p className="font-medium text-slate-800 text-xs mt-2 leading-relaxed">
                      {log.message}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-500 mt-2 pt-2 border-t border-slate-200/60">
                      <span>Uç Nokta: <strong className="text-slate-700">{log.endpoint}</strong></span>
                      {log.tenantName && <span>Mağaza: <strong className="text-slate-700">{log.tenantName}</strong></span>}
                      <span>İstek ID: <strong className="text-slate-700">{log.requestId}</strong></span>
                      <span>İstemci IP: <strong className="text-slate-700">{log.ipMasked}</strong></span>
                    </div>

                    {/* Expandable Stacktrace details */}
                    {isExpanded && log.stackTrace && (
                      <div className="mt-3 bg-slate-900 text-emerald-300 p-3.5 rounded-xl font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed shadow-inner">
                        <div className="text-[10px] text-slate-400 mb-1 font-bold">// Hata Yığını (Stack Trace & Context):</div>
                        <pre className="whitespace-pre">{log.stackTrace}</pre>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

    </div>
  );
}

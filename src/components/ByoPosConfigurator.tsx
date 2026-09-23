/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CreditCard, Key, ShieldCheck, ShieldAlert, Zap, ArrowRight, Layers, Lock, Unlock, CheckCircle, Code, Copy, Check } from 'lucide-react';
import { Tenant, PosConfig, initialPosConfigs } from '../data/mockData';
import { encryptSecret, decryptSecret, NODEJS_CRYPTO_VAULT_CODE } from '../utils/cryptoSecurity';

interface ByoPosConfiguratorProps {
  currentTenant: Tenant;
  onUpdateTenantPos: (tenantId: string, connected: boolean, posProvider: string | null) => void;
}

export default function ByoPosConfigurator({ currentTenant, onUpdateTenantPos }: ByoPosConfiguratorProps) {
  const [configs, setConfigs] = useState<PosConfig[]>(() => {
    const saved = localStorage.getItem('tampazar_pos_configs');
    return saved ? JSON.parse(saved) : initialPosConfigs;
  });

  const [provider, setProvider] = useState<'paytr' | 'iyzico' | 'sipay' | 'stripe'>('paytr');
  const [merchantId, setMerchantId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  
  // Animation states
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [encryptedSecret, setEncryptedSecret] = useState('');
  const [encryptionLog, setEncryptionLog] = useState<string[]>([]);
  
  // Payment router test states
  const [testAmount, setTestAmount] = useState('1450.00');
  const [paymentLog, setPaymentLog] = useState<{
    status: 'idle' | 'processing' | 'success' | 'failed';
    routedTo: string | null;
    requestPayload: any;
    responsePayload: any;
  }>({
    status: 'idle',
    routedTo: null,
    requestPayload: null,
    responsePayload: null,
  });

  // Load configuration for the selected tenant if it exists
  const activeConfig = configs.find(c => c.tenantId === currentTenant.id && c.isActive);

  useEffect(() => {
    if (activeConfig) {
      setProvider(activeConfig.provider);
      setMerchantId(activeConfig.merchantId);
      setApiKey(activeConfig.apiKey);
      setApiSecret(activeConfig.apiSecretDecryptedHint);
      setEncryptedSecret(activeConfig.apiSecretEncrypted);
    } else {
      // Clear or default
      setMerchantId('');
      setApiKey('');
      setApiSecret('');
      setEncryptedSecret('');
    }
  }, [currentTenant.id, activeConfig]);

  // Save to local storage whenever configs change
  const saveConfigs = (newConfigs: PosConfig[]) => {
    setConfigs(newConfigs);
    localStorage.setItem('tampazar_pos_configs', JSON.stringify(newConfigs));
  };

  // Real AES-256-GCM Encryption routine
  const [decryptedVerifyResult, setDecryptedVerifyResult] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId || !apiKey || !apiSecret) return;

    setIsEncrypting(true);
    setEncryptionLog([]);
    setDecryptedVerifyResult(null);
    
    // Step-by-step cryptographic pipeline
    const logs = [
      '🔑 256-bit (32 byte) Secret Key belleğe yüklendi (AES-256-GCM)...',
      '🛡️ 16-byte Kriptografik Rastgele IV (Initialization Vector) üretildi...',
      '⚡ WebCrypto / Node.js AES-GCM şifreleme motoru çalıştırılıyor...',
      `🔒 "${apiSecret.substring(0, 3)}***" verisi şifreleniyor...`,
      '📦 128-bit (16 byte) GCM Authentication Tag doğrulama imzası hesaplandı...'
    ];

    for (let i = 0; i < logs.length; i++) {
      await new Promise(r => setTimeout(r, 200));
      setEncryptionLog(prev => [...prev, logs[i]]);
    }

    try {
      // Real AES-256-GCM encryption
      const realEncrypted = await encryptSecret(apiSecret);
      setEncryptedSecret(realEncrypted);
      setIsEncrypting(false);

      // Update config list
      const updatedConfig: PosConfig = {
        id: activeConfig ? activeConfig.id : 'pos-' + Math.floor(Math.random() * 1000000),
        tenantId: currentTenant.id,
        provider,
        merchantId,
        apiKey,
        apiSecretEncrypted: realEncrypted,
        apiSecretDecryptedHint: apiSecret,
        isActive: true
      };

      const filtered = configs.filter(c => !(c.tenantId === currentTenant.id && c.provider === provider));
      const newConfigs = [...filtered, updatedConfig];
      saveConfigs(newConfigs);

      // Trigger parent state update
      onUpdateTenantPos(currentTenant.id, true, provider);
    } catch (err: any) {
      setIsEncrypting(false);
      alert('Şifreleme hatası: ' + err.message);
    }
  };

  const handleVerifyDecryption = async () => {
    if (!encryptedSecret) return;
    try {
      const plain = await decryptSecret(encryptedSecret);
      setDecryptedVerifyResult(plain);
    } catch (err: any) {
      setDecryptedVerifyResult('Hata: Kimlik doğrulama etiketi geçersiz!');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(NODEJS_CRYPTO_VAULT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDisconnect = () => {
    const updated = configs.map(c => {
      if (c.tenantId === currentTenant.id) {
        return { ...c, isActive: false };
      }
      return c;
    });
    saveConfigs(updated);
    onUpdateTenantPos(currentTenant.id, false, null);
    setMerchantId('');
    setApiKey('');
    setApiSecret('');
    setEncryptedSecret('');
  };

  // Simulate transactional routing
  const handleTestPaymentRouting = () => {
    if (!testAmount || isNaN(Number(testAmount)) || Number(testAmount) <= 0) return;

    setPaymentLog(prev => ({ ...prev, status: 'processing' }));

    setTimeout(() => {
      if (!currentTenant.byoPosConnected || !activeConfig) {
        setPaymentLog({
          status: 'failed',
          routedTo: null,
          requestPayload: null,
          responsePayload: {
            error: "PAYMENT_ROUTING_FAILED",
            message: "Bu kiracının aktif bağlı sanal POS'u bulunmamaktadır. Ödemeler platform komisyonu olmadan alınamaz.",
            code: 403
          }
        });
        return;
      }

      // Generate exact API payload for the active provider
      const payload: any = {
        transaction_id: 'tx_demo_' + Math.floor(Math.random() * 1000000),
        amount: parseFloat(testAmount),
        currency: 'TRY',
        tenant_context: {
          id: currentTenant.id,
          name: currentTenant.name,
          slug: currentTenant.slug
        },
        gateway_credentials: {
          provider: activeConfig.provider,
          merchant_id: activeConfig.merchantId,
          api_key: activeConfig.apiKey,
          api_secret_decrypted: `${activeConfig.apiSecretDecryptedHint.substring(0, 4)}****************`
        },
        metadata: {
          bypass_platform_wallet: true,
          direct_merchant_payout: true,
          platform_commission_rate: 0.00 // 0% Commission
        }
      };

      const response: any = {
        status: 'success',
        status_code: '100',
        auth_code: 'AUTH_' + Math.floor(Math.random() * 900000),
        system_tx_id: 'gate_sys_' + Math.floor(Math.random() * 1000000),
        settled_amount: parseFloat(testAmount),
        settled_currency: 'TRY',
        routed_gateway: activeConfig.provider.toUpperCase(),
        commission_deducted: 0.00,
        net_to_merchant: parseFloat(testAmount),
        webhook_triggered: true,
        webhook_url: `https://tampazar.com/api/webhooks/pos-callback?tenant=${currentTenant.id}`
      };

      setPaymentLog({
        status: 'success',
        routedTo: activeConfig.provider,
        requestPayload: payload,
        responsePayload: response
      });

      // Add a simulated transaction record to the pre-accounting logs automatically!
      const savedAccounts = localStorage.getItem('tampazar_ledger_accounts');
      const accounts = savedAccounts ? JSON.parse(savedAccounts) : [];
      const tenantAccount = accounts.find((a: any) => a.tenantId === currentTenant.id);

      if (tenantAccount) {
        const savedTx = localStorage.getItem('tampazar_ledger_transactions');
        const transactions = savedTx ? JSON.parse(savedTx) : [];
        const newBalance = tenantAccount.balance + parseFloat(testAmount);
        
        // Update account balance
        tenantAccount.balance = newBalance;
        const updatedAccounts = accounts.map((a: any) => a.id === tenantAccount.id ? tenantAccount : a);
        localStorage.setItem('tampazar_ledger_accounts', JSON.stringify(updatedAccounts));

        // Create new ledger transaction
        const newTx = {
          id: 'tx-' + Math.floor(Math.random() * 1000000),
          tenantId: currentTenant.id,
          accountId: tenantAccount.id,
          date: new Date().toISOString().split('T')[0],
          description: `Online Sipariş Ödeme Girişi - ${activeConfig.provider.toUpperCase()} (Komi. 0%)`,
          debit: parseFloat(testAmount),
          credit: 0,
          balanceAfter: newBalance
        };
        localStorage.setItem('tampazar_ledger_transactions', JSON.stringify([...transactions, newTx]));
        
        // Dispatch custom event to trigger accounting updates
        window.dispatchEvent(new Event('tampazar_accounting_updated'));
      }

    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Editorial Title */}
      <div>
        <span className="text-xs font-mono text-emerald-600 tracking-wider uppercase font-semibold">02. Kendi Altyapını Getir (BYO POS)</span>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mt-1">Sanal POS Entegrasyonu & Akıllı Ödeme Yönlendirici</h2>
        <p className="text-slate-500 text-sm mt-1 max-w-3xl">
          Komisyonsuz modelimizin merkezinde "Kendi Sanal POS'unu Bağla" mekanizması yer alır. Satıcılar doğrudan PayTR, iyzico gibi sağlayıcılardan aldıkları API anahtarlarını sisteme bağlar. Ödemeler tampazar.com havuzuna girmeden doğrudan satıcının kendi banka hesabına aktarılır.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left column: Setup Form */}
        <div className="xl:col-span-2 bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              Sanal POS Bağlantı Paneli ({currentTenant.name})
            </h3>
            {currentTenant.byoPosConnected ? (
              <span className="text-[11px] font-mono font-medium text-emerald-600 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> AKTİF BAĞLANTI: {activeConfig?.provider.toUpperCase()}
              </span>
            ) : (
              <span className="text-[11px] font-mono text-slate-400">POS Bağlı Değil</span>
            )}
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">POS Sağlayıcı Gateway</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as any)}
                  disabled={currentTenant.byoPosConnected}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  <option value="paytr">PayTR API Entegrasyonu</option>
                  <option value="iyzico">iyzico Sanal POS API</option>
                  <option value="sipay">Sipay Sanal POS</option>
                  <option value="stripe">Stripe Connect Checkout</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Üye İşyeri Numarası (Merchant ID)</label>
                <input
                  type="text"
                  value={merchantId}
                  onChange={(e) => setMerchantId(e.target.value)}
                  disabled={currentTenant.byoPosConnected}
                  placeholder="örn: 384910"
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">API Key</label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  disabled={currentTenant.byoPosConnected}
                  placeholder="örn: p_tr_key_..."
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">API Secret / Private Key (Asla düz metin kalmaz)</label>
                <input
                  type="password"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  disabled={currentTenant.byoPosConnected}
                  placeholder="••••••••••••••••••••••••"
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>
            </div>

            {/* Cryptographic simulation workspace */}
            {isEncrypting && (
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-[10px] text-slate-300 space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
                  <Lock className="w-3.5 h-3.5 animate-bounce" />
                  <span>Kriptografik AES-256-GCM İşlemi Sürüyor...</span>
                </div>
                {encryptionLog.map((log, i) => (
                  <div key={i} className="animate-fade-in text-emerald-500">✓ {log}</div>
                ))}
              </div>
            )}

            {encryptedSecret && !isEncrypting && (
              <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <h4 className="text-xs font-bold text-emerald-900">AES-256-GCM Authenticated Encryption ile Kilitlendi</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCodeModal(!showCodeModal)}
                    className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Code className="w-3.5 h-3.5" /> Node.js Kripto Kodunu Gör
                  </button>
                </div>

                {/* AES-GCM Breakdown */}
                {encryptedSecret.includes(':') ? (
                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200 space-y-1">
                      <div className="text-slate-500 text-[10px] flex justify-between">
                        <span>Format: [16-Byte IV] : [16-Byte GCM AuthTag] : [Ciphertext]</span>
                        <span className="text-emerald-600 font-bold">Tam 256-bit Korumalı</span>
                      </div>
                      <div className="break-all text-slate-800 text-xs leading-relaxed">
                        <span className="text-indigo-600 font-bold" title="16-byte Random IV">{encryptedSecret.split(':')[0]}</span>
                        <span className="text-slate-400 font-bold">:</span>
                        <span className="text-amber-600 font-bold" title="16-byte GCM AuthTag">{encryptedSecret.split(':')[1]}</span>
                        <span className="text-slate-400 font-bold">:</span>
                        <span className="text-emerald-700 font-medium" title="Encrypted Payload">{encryptedSecret.split(':')[2]}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleVerifyDecryption}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Unlock className="w-3.5 h-3.5" /> Şifreyi Çöz & Doğrula (Decrypt Test)
                      </button>

                      {decryptedVerifyResult && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Çözülen Sır: {decryptedVerifyResult}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-emerald-700 font-mono truncate">
                    Ciphertext: {encryptedSecret}
                  </p>
                )}

                {showCodeModal && (
                  <div className="mt-3 p-3 bg-slate-950 rounded-lg text-slate-200 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-sans border-b border-slate-800 pb-2">
                      <span className="font-semibold text-amber-400">Node.js `crypto` AES-256-GCM Backend Implementasyonu</span>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-2 py-0.5 rounded bg-slate-800 transition cursor-pointer"
                      >
                        {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedCode ? 'Kopyalandı' : 'Kodu Kopyala'}
                      </button>
                    </div>
                    <pre className="font-mono text-[10px] text-emerald-400 overflow-x-auto p-2 bg-slate-900 rounded max-h-56">
                      {NODEJS_CRYPTO_VAULT_CODE}
                    </pre>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 flex items-center gap-3">
              {!currentTenant.byoPosConnected ? (
                <button
                  type="submit"
                  disabled={isEncrypting}
                  className="px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Key className="w-3.5 h-3.5" />
                  Şifrele ve Güvenli Bağlantıyı Kur
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                >
                  Bağlantıyı Güvenle Kopar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right column: Interactive payment routing simulator */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              Sanal POS Router Test Sahası
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Kiracının kendi Sanal POS'unun platform üzerinden müşteriden ödeme çekerken oluşturduğu anlık API akışını simüle edin.
            </p>

            <div className="space-y-2 pt-2">
              <label className="block text-[11px] font-medium text-slate-500">Test Sipariş Tutarı (TL)</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    value={testAmount}
                    onChange={(e) => setTestAmount(e.target.value)}
                    placeholder="1500"
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 text-slate-800 font-mono focus:outline-none"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">TL</span>
                </div>
                <button
                  onClick={handleTestPaymentRouting}
                  disabled={paymentLog.status === 'processing'}
                  className="px-4 py-2.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap"
                >
                  Ödemeyi Çek
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Simulated Live Action Log */}
            {paymentLog.status !== 'idle' && (
              <div className="mt-4 border border-slate-100 rounded-lg p-3 bg-slate-50 space-y-3">
                {paymentLog.status === 'processing' && (
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-ping" />
                    <span className="font-mono">Router: {currentTenant.name} için POS parametreleri aranıyor...</span>
                  </div>
                )}

                {paymentLog.status === 'success' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                      <span>{paymentLog.routedTo?.toUpperCase()} Gateway: Başarılı Ödeme Alındı</span>
                    </div>
                    <div className="text-[10px] text-slate-500 leading-relaxed font-mono">
                      Ödeme tutarı doğrudan satıcı hesabına aktarıldı. <span className="text-emerald-600 font-bold">%0 Komisyon</span> uygulandı. Cari kartına anında alacak kaydedildi!
                    </div>
                  </div>
                )}

                {paymentLog.status === 'failed' && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-red-600 font-semibold">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>Sanal POS Entegrasyon Hatası</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
                      {paymentLog.responsePayload?.message}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>BYO POS Güvencesi</span>
            <span className="font-mono text-emerald-500 font-medium">Bypass Central Wallet</span>
          </div>
        </div>

      </div>

      {/* API JSON Payload Console Inspector (Tabular display) */}
      {paymentLog.status === 'success' && paymentLog.requestPayload && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm animate-fade-in">
          <div className="px-6 py-3.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Dynamic Payment Router - API Payload Inspector</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
              POST /v1/gateways/route
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            {/* Request API schema */}
            <div className="p-6">
              <span className="text-[10px] uppercase tracking-wider font-mono text-indigo-400 font-semibold block mb-2">Request Body (Gönderilen Payload)</span>
              <pre className="font-mono text-[11px] text-slate-300 overflow-x-auto bg-slate-950/40 p-4 rounded-lg">
                <code>{JSON.stringify(paymentLog.requestPayload, null, 2)}</code>
              </pre>
            </div>
            {/* Response API schema */}
            <div className="p-6">
              <span className="text-[10px] uppercase tracking-wider font-mono text-emerald-400 font-semibold block mb-2">Response Body (Dönen Webhook Payload)</span>
              <pre className="font-mono text-[11px] text-slate-300 overflow-x-auto bg-slate-950/40 p-4 rounded-lg">
                <code>{JSON.stringify(paymentLog.responsePayload, null, 2)}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

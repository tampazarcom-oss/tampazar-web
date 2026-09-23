/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @file /app/api/stores/[storeId]/pos/connect/route.ts
 * Next.js App Router Server Route — Connect Merchant BYO POS
 */

import { encryptSecret } from '../utils/cryptoSecurity';

export interface PosConnectRequestBody {
  storeId: string;
  provider: 'paytr' | 'iyzico' | 'sipay' | 'stripe';
  merchantId?: string;
  apiKey: string;
  secretKey: string;
  testMode?: boolean;
}

export interface PosConnectResponse {
  success?: boolean;
  message?: string;
  error?: string;
  debug?: {
    encryptedApiKey: string;
    encryptedSecretKey: string;
    storeId: string;
    provider: string;
    timestamp: string;
  };
}

/**
 * Next.js App Router POST Handler Simulation
 */
export async function handlePosConnectRoute(reqBody: PosConnectRequestBody): Promise<{ status: number; data: PosConnectResponse }> {
  try {
    const { storeId, provider, merchantId, apiKey, secretKey, testMode } = reqBody;

    if (!storeId || !provider || !apiKey || !secretKey) {
      return {
        status: 400,
        data: { error: 'Eksik POS parametresi. (storeId, provider, apiKey, secretKey zorunludur).' }
      };
    }

    // Anahtarları AES-256-GCM ile güvenli şekilde şifrele
    const encryptedApiKey = await encryptSecret(apiKey);
    const encryptedSecretKey = await encryptSecret(secretKey);

    return {
      status: 200,
      data: {
        success: true,
        message: `${provider.toUpperCase()} Sanal POS altyapınız başarıyla dükkânınıza bağlandı. Müşteri ödemeleri doğrudan hesabınıza aktarılacaktır.`,
        debug: {
          storeId,
          provider,
          encryptedApiKey,
          encryptedSecretKey,
          timestamp: new Date().toISOString()
        }
      }
    };
  } catch (error: any) {
    return {
      status: 500,
      data: { error: 'POS bağlantısı kaydedilemedi: ' + error.message }
    };
  }
}

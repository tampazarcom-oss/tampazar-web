/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'buyer' | 'seller';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  storeId?: string;
  storeName?: string;
  legalTitle?: string;
  taxId?: string;
  taxOffice?: string;
  city?: string;
  district?: string;
  posPreference?: string;
  avatar?: string;
}

export interface SellerRegisterData {
  storeName: string;
  legalTitle: string;
  taxId: string;
  taxOffice: string;
  city: string;
  district: string;
  sector: string;
  posPreference: string;
  email: string;
  phone: string;
  password?: string;
}

export interface BuyerRegisterData {
  name: string;
  email: string;
  phone: string;
  city?: string;
  district?: string;
  password?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loginAsBuyer: (email?: string) => void;
  loginAsSeller: (email?: string, storeName?: string) => void;
  registerBuyer: (data: BuyerRegisterData) => void;
  registerSeller: (data: SellerRegisterData) => void;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  openAuthModal: (initialTab?: 'buyer' | 'seller') => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  authModalInitialTab: 'buyer' | 'seller';
}

const DEFAULT_BUYER: AuthUser = {
  id: 'buyer-1',
  name: 'Ahmet Yılmaz',
  email: 'ahmet.yilmaz@tampazar.com',
  phone: '+90 532 555 12 34',
  role: 'buyer',
  city: 'Ordu',
  district: 'Altınordu',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
};

const DEFAULT_SELLER: AuthUser = {
  id: 'seller-1',
  name: 'Serkan Koç (Foto Sentez)',
  email: 'serkan@fotosentez.com',
  phone: '+90 530 777 88 99',
  role: 'seller',
  storeId: 's3',
  storeName: 'FotoSentez Stüdyo',
  legalTitle: 'FotoSentez Prodüksiyon ve Medya Ltd. Şti.',
  taxId: '3810294821',
  taxOffice: 'Altınordu VD',
  city: 'Ordu',
  district: 'Altınordu',
  posPreference: 'Sipay Gateway (Doğrudan POS)',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('tampazar_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'buyer' | 'seller'>('buyer');

  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('tampazar_auth_user', JSON.stringify(user));
      } catch (e) {}
    } else {
      localStorage.removeItem('tampazar_auth_user');
    }
  }, [user]);

  const loginAsBuyer = (email = 'ahmet.yilmaz@tampazar.com') => {
    const buyerUser = {
      ...DEFAULT_BUYER,
      email
    };
    setUser(buyerUser);
    setIsAuthModalOpen(false);
  };

  const loginAsSeller = (email = 'serkan@fotosentez.com', storeName = 'FotoSentez Stüdyo') => {
    const sellerUser = {
      ...DEFAULT_SELLER,
      email,
      storeName
    };
    setUser(sellerUser);
    setIsAuthModalOpen(false);
  };

  const registerBuyer = (data: BuyerRegisterData) => {
    const newUser: AuthUser = {
      id: 'buyer-' + Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'buyer',
      city: data.city || 'Ordu',
      district: data.district || 'Altınordu',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const registerSeller = (data: SellerRegisterData) => {
    const newSellerId = 'tenant-' + Date.now();
    const newUser: AuthUser = {
      id: newSellerId,
      name: `${data.storeName} Yetkilisi`,
      email: data.email,
      phone: data.phone,
      role: 'seller',
      storeId: newSellerId,
      storeName: data.storeName,
      legalTitle: data.legalTitle || data.storeName,
      taxId: data.taxId,
      taxOffice: data.taxOffice,
      city: data.city,
      district: data.district,
      posPreference: data.posPreference,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'
    };

    // Save as new tenant in tenants storage if available
    try {
      const storedTenants = localStorage.getItem('tampazar_tenants');
      const tenantsList = storedTenants ? JSON.parse(storedTenants) : [];
      tenantsList.unshift({
        id: newSellerId,
        name: data.storeName,
        legalTitle: data.legalTitle,
        taxId: data.taxId,
        taxOffice: data.taxOffice,
        slug: data.storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        logo: '🏪',
        category: data.sector,
        rating: 5.0,
        reviews: 1,
        plan: 'Starter',
        quotaUsed: 0,
        quotaLimit: 500,
        byoPosConnected: true,
        activePos: data.posPreference.toLowerCase().includes('paytr') ? 'paytr' : 
                   data.posPreference.toLowerCase().includes('iyzico') ? 'iyzico' : 'sipay'
      });
      localStorage.setItem('tampazar_tenants', JSON.stringify(tenantsList));
    } catch (e) {}

    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tampazar_auth_user');
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) {
      if (newRole === 'buyer') loginAsBuyer();
      else loginAsSeller();
      return;
    }
    if (newRole === 'seller') {
      setUser({
        ...DEFAULT_SELLER,
        name: user.name,
        email: user.email
      });
    } else {
      setUser({
        ...DEFAULT_BUYER,
        name: user.name,
        email: user.email
      });
    }
  };

  const openAuthModal = (initialTab: 'buyer' | 'seller' = 'buyer') => {
    setAuthModalInitialTab(initialTab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        loginAsBuyer,
        loginAsSeller,
        registerBuyer,
        registerSeller,
        logout,
        switchRole,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
        authModalInitialTab
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

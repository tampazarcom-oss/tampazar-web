/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'customer' | 'merchant' | 'courier' | 'admin' | 'buyer' | 'seller';

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
  courierStatus?: 'available' | 'busy' | 'offline';
  courierVehicle?: string;
  courierRating?: number;
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

export interface CourierRegisterData {
  name: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  vehicleType: string;
  tcNo: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAsBuyer: (email?: string) => void;
  loginAsCustomer: (email?: string) => void;
  loginAsSeller: (email?: string, storeName?: string) => void;
  loginAsMerchant: (email?: string, storeName?: string) => void;
  loginAsCourier: (email?: string) => void;
  loginAsAdmin: (email?: string) => void;
  registerBuyer: (data: BuyerRegisterData) => void;
  registerSeller: (data: SellerRegisterData) => void;
  registerCourier: (data: CourierRegisterData) => void;
  logout: () => Promise<void>;
  switchRole: (newRole: UserRole) => void;
  openAuthModal: (initialTab?: 'buyer' | 'seller' | 'courier' | 'admin') => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  authModalInitialTab: 'buyer' | 'seller' | 'courier' | 'admin';
  getNormalizedRole: () => 'customer' | 'merchant' | 'courier' | 'admin';
  getRoleRedirectPath: (role?: UserRole) => string;
  updateCourierStatus: (status: 'available' | 'busy' | 'offline') => void;
  setAuthUser: (user: AuthUser) => void;
}

const DEFAULT_BUYER: AuthUser = {
  id: 'buyer-1',
  name: 'Ahmet Yılmaz',
  email: 'ahmet.yilmaz@tampazar.com',
  phone: '+90 532 555 12 34',
  role: 'customer',
  city: 'Ordu',
  district: 'Altınordu',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
};

const DEFAULT_SELLER: AuthUser = {
  id: 'seller-1',
  name: 'Serkan Koç (Foto Sentez)',
  email: 'serkan@fotosentez.com',
  phone: '+90 530 777 88 99',
  role: 'merchant',
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

const DEFAULT_COURIER: AuthUser = {
  id: 'courier-1',
  name: 'Murat Yıldız',
  email: 'kurye.murat@tampazar.com',
  phone: '+90 541 222 33 44',
  role: 'courier',
  city: 'Ordu',
  district: 'Altınordu',
  courierStatus: 'available',
  courierVehicle: 'Motosiklet (125cc)',
  courierRating: 4.9,
  avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80'
};

const DEFAULT_ADMIN: AuthUser = {
  id: 'admin-1',
  name: 'Süper Admin (Platform Yetkilisi)',
  email: 'admin@tampazar.com',
  phone: '+90 850 300 00 00',
  role: 'admin',
  city: 'İstanbul',
  district: 'Maslak',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
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

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'buyer' | 'seller' | 'courier' | 'admin'>('buyer');

  // AuthContext içindeki ilk yükleme useEffect'i:
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include' // Çerezlerin gitmesi için zorunlu
        });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
          }
        }
      } catch (error) {
        // Fallback to local storage state if server unavailable
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('tampazar_auth_user', JSON.stringify(user));
      } catch (e) {}
    } else {
      localStorage.removeItem('tampazar_auth_user');
    }
  }, [user]);

  const getNormalizedRole = (): 'customer' | 'merchant' | 'courier' | 'admin' => {
    if (!user) return 'customer';
    if (user.role === 'buyer' || user.role === 'customer') return 'customer';
    if (user.role === 'seller' || user.role === 'merchant') return 'merchant';
    if (user.role === 'courier') return 'courier';
    if (user.role === 'admin') return 'admin';
    return 'customer';
  };

  const getRoleRedirectPath = (targetRole?: UserRole): string => {
    const roleToUse = targetRole || (user ? user.role : 'customer');
    if (roleToUse === 'merchant' || roleToUse === 'seller') return '/yonetim';
    if (roleToUse === 'courier') return '/kurye/panel';
    if (roleToUse === 'admin') return '/sistem-admin';
    return '/hesabim';
  };

  const loginAsBuyer = (email = 'ahmet.yilmaz@tampazar.com') => {
    const buyerUser: AuthUser = {
      ...DEFAULT_BUYER,
      email,
      role: 'customer'
    };
    setUser(buyerUser);
    setIsAuthModalOpen(false);
  };

  const loginAsCustomer = loginAsBuyer;

  const loginAsSeller = (email = 'serkan@fotosentez.com', storeName = 'FotoSentez Stüdyo') => {
    const sellerUser: AuthUser = {
      ...DEFAULT_SELLER,
      email,
      storeName,
      role: 'merchant'
    };
    setUser(sellerUser);
    setIsAuthModalOpen(false);
  };

  const loginAsMerchant = loginAsSeller;

  const loginAsCourier = (email = 'kurye.murat@tampazar.com') => {
    const courierUser: AuthUser = {
      ...DEFAULT_COURIER,
      email,
      role: 'courier'
    };
    setUser(courierUser);
    setIsAuthModalOpen(false);
  };

  const loginAsAdmin = (email = 'admin@tampazar.com') => {
    const adminUser: AuthUser = {
      ...DEFAULT_ADMIN,
      email,
      role: 'admin'
    };
    setUser(adminUser);
    setIsAuthModalOpen(false);
  };

  const registerBuyer = (data: BuyerRegisterData) => {
    const newUser: AuthUser = {
      id: 'buyer-' + Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'customer',
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
      role: 'merchant',
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

  const registerCourier = (data: CourierRegisterData) => {
    const newCourier: AuthUser = {
      id: 'courier-' + Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'courier',
      city: data.city,
      district: data.district,
      courierStatus: 'available',
      courierVehicle: data.vehicleType,
      courierRating: 5.0,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80'
    };
    setUser(newCourier);
    setIsAuthModalOpen(false);
  };

  const updateCourierStatus = (status: 'available' | 'busy' | 'offline') => {
    if (user && (user.role === 'courier')) {
      setUser({ ...user, courierStatus: status });
    }
  };

  // Logout fonksiyonu:
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST', 
        credentials: 'include' 
      });
    } catch (e) {
      // ignore network errors
    } finally {
      setUser(null);
      localStorage.removeItem('tampazar_auth_user');
    }
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === 'merchant' || newRole === 'seller') loginAsSeller();
    else if (newRole === 'courier') loginAsCourier();
    else if (newRole === 'admin') loginAsAdmin();
    else loginAsBuyer();
  };

  const openAuthModal = (initialTab: 'buyer' | 'seller' | 'courier' | 'admin' = 'buyer') => {
    setAuthModalInitialTab(initialTab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const setAuthUser = (incomingUser: AuthUser) => {
    setUser(incomingUser);
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        loginAsBuyer,
        loginAsCustomer,
        loginAsSeller,
        loginAsMerchant,
        loginAsCourier,
        loginAsAdmin,
        registerBuyer,
        registerSeller,
        registerCourier,
        logout,
        switchRole,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
        authModalInitialTab,
        getNormalizedRole,
        getRoleRedirectPath,
        updateCourierStatus,
        setAuthUser
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

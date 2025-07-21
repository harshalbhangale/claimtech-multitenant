import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getSubdomain, getTenantConfig } from '../utils/tenantUtils';

interface TenantConfig {
  name: string;
  primaryColor: string;
  accentColor: string;
  accentLightColor?: string;
  completedColor?: string;
  primaryLightColor?: string;
  logo: string;
  secured: string;
  theme: string;
  inactiveColor?: string;

}

interface TenantContextType {
  tenant: string;
  config: TenantConfig;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tenant, setTenant] = useState<string>(getSubdomain());
  const [config, setConfig] = useState<TenantConfig>(getTenantConfig(tenant));

  // Debug logging
  console.log('TenantProvider - Current tenant:', tenant);
  console.log('TenantProvider - Current config:', config);

  useEffect(() => {
    const updateTenant = () => {
      const currentSubdomain = getSubdomain();
      console.log('TenantProvider - Updating tenant to:', currentSubdomain);
      setTenant(currentSubdomain);
      setConfig(getTenantConfig(currentSubdomain));
    };

    // Force update on mount
    updateTenant();

    window.addEventListener('popstate', updateTenant);
    return () => window.removeEventListener('popstate', updateTenant);
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, config }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}; 
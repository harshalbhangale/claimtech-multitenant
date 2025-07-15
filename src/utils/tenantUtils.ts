export const getSubdomain = (): string => {
  // Temporary override for testing - change this to test different tenants
  console.log('getSubdomain - Forcing blueclaims');
  return 'blueclaims';
  
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  // Check if there's a subdomain (more than 2 parts, e.g., resolvemyclaim.localhost:5173)
  if (parts.length > 2) {
    return parts[0];
  }
  
  // Default to 'resolvemyclaim' if no subdomain is detected or on localhost:5173 without subdomain
  return 'resolvemyclaim';
};

export const getTenantConfig = (subdomain: string) => {
  console.log('getTenantConfig - Getting config for subdomain:', subdomain);
  const tenantConfigs = {
    'resolvemyclaim': {
      name: 'resolvemyclaim',
      primaryColor: '#B8FF8D',
      accentColor: '#5B34C9',
      accentLightColor: '#EFEBFB',
      completedColor: '#50C878',
      inactiveColor: '#D9D9D9',
      logo: '/icons/resolve.png',
      secured: '/icons/secured.png',
      theme: 'default'
    },
    'blueclaims': {
      name: 'blueclaims',
      primaryColor: '#007BFF',
      accentColor: '#0056b3',
      accentLightColor: '#E8F0FF',
      completedColor: '#50C878',
      inactiveColor: '#D9D9D9',
      logo: '/icons/blueclaim.png',
      secured: '/icons/secured.png',
      theme: 'blueTheme'
    }
  };
  
  const config = tenantConfigs[subdomain as keyof typeof tenantConfigs] || tenantConfigs['resolvemyclaim'];
  console.log('getTenantConfig - Returning config:', config);
  return config;
}; 
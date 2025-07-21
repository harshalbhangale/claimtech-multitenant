export const getSubdomain = (): string => {
  const hostname = window.location.hostname;
  console.log('getSubdomain - hostname:', hostname);
  const parts = hostname.split('.');
  console.log('getSubdomain - parts:', parts);
  
  // Check for localhost subdomains (e.g., resolvemyclaim.localhost or blueclaims.localhost)
  if (parts.length >= 2 && parts[parts.length - 1] === 'localhost') {
    const subdomain = parts[0];
    console.log('getSubdomain - detected subdomain:', subdomain);
    return subdomain;
  }
  
  // Check for production subdomains (more than 2 parts, e.g., resolvemyclaim.example.com)
  if (parts.length > 2 && parts[parts.length - 1] !== 'localhost') {
    const subdomain = parts[0];
    console.log('getSubdomain - detected production subdomain:', subdomain);
    return parts[0];
  }
  
  // Default to 'resolvemyclaim' if no subdomain is detected or on localhost:5173 without subdomain
  console.log('getSubdomain - using default: resolvemyclaim');
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
      primaryLightColor: '#E9FFE9',
      logo: '/icons/resolve.png',
      secured: '/icons/secured.png',
      theme: 'default'
    },
    'blueclaims': {
      name: 'blueclaims',
      primaryColor: '#3695F7',
      accentColor: '#0056b3',
      accentLightColor: '#E8F0FF',
      completedColor: '#3695F7',
      inactiveColor: '#D9D9D9',
      primaryLightColor: '#3695F7',
      logo: '/icons/blueclaim.png',
      secured: '/icons/secured.png',
      theme: 'blueTheme'
    }
  };
  
  const config = tenantConfigs[subdomain as keyof typeof tenantConfigs] || tenantConfigs['resolvemyclaim'];
  console.log('getTenantConfig - Returning config:', config);
  return config;
}; 
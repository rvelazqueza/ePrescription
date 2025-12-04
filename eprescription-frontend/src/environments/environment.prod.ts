// Environment configuration for production
export const environment = {
  production: true,
  apiUrl: '', // Will use same domain in production, services add /api prefix
  keycloakUrl: 'https://keycloak.yourdomain.com',
  keycloakRealm: 'eprescription',
  keycloakClientId: 'eprescription-client'
};

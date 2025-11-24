// Environment configuration for production
export const environment = {
  production: true,
  apiUrl: '/api', // Will use same domain in production
  keycloakUrl: 'https://keycloak.yourdomain.com',
  keycloakRealm: 'eprescription',
  keycloakClientId: 'eprescription-client'
};

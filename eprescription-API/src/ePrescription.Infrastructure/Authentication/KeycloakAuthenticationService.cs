using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using EPrescription.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace EPrescription.Infrastructure.Authentication
{
    /// <summary>
    /// Keycloak authentication service implementation
    /// </summary>
    public class KeycloakAuthenticationService : IAuthenticationService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<KeycloakAuthenticationService> _logger;
        private readonly string _keycloakUrl;
        private readonly string _realm;
        private readonly string _clientId;
        private readonly string _clientSecret;

        public KeycloakAuthenticationService(
            HttpClient httpClient,
            IConfiguration configuration,
            ILogger<KeycloakAuthenticationService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;

            _keycloakUrl = configuration["Keycloak:Url"] ?? "http://keycloak:8080";
            _realm = configuration["Keycloak:Realm"] ?? "eprescription";
            _clientId = configuration["Keycloak:ClientId"] ?? "eprescription-api";
            _clientSecret = configuration["Keycloak:ClientSecret"] ?? throw new InvalidOperationException("Keycloak ClientSecret is required");
        }

        public async Task<AuthenticationResult> AuthenticateAsync(string username, string password)
        {
            try
            {
                var tokenEndpoint = $"{_keycloakUrl}/realms/{_realm}/protocol/openid-connect/token";

                var requestData = new Dictionary<string, string>
                {
                    { "grant_type", "password" },
                    { "client_id", _clientId },
                    { "client_secret", _clientSecret },
                    { "username", username },
                    { "password", password }
                };

                var response = await _httpClient.PostAsync(tokenEndpoint, new FormUrlEncodedContent(requestData));

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogWarning("Authentication failed for user {Username}: {Error}", username, errorContent);
                    
                    return new AuthenticationResult
                    {
                        Success = false,
                        ErrorMessage = "Invalid username or password"
                    };
                }

                var tokenResponse = await response.Content.ReadFromJsonAsync<KeycloakTokenResponse>();

                // Get user info
                var userInfo = await GetUserInfoAsync(tokenResponse.AccessToken);

                return new AuthenticationResult
                {
                    Success = true,
                    AccessToken = tokenResponse.AccessToken,
                    RefreshToken = tokenResponse.RefreshToken,
                    ExpiresIn = tokenResponse.ExpiresIn,
                    TokenType = tokenResponse.TokenType,
                    UserInfo = userInfo
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during authentication for user {Username}", username);
                return new AuthenticationResult
                {
                    Success = false,
                    ErrorMessage = "An error occurred during authentication"
                };
            }
        }

        public async Task<AuthenticationResult> RefreshTokenAsync(string refreshToken)
        {
            try
            {
                var tokenEndpoint = $"{_keycloakUrl}/realms/{_realm}/protocol/openid-connect/token";

                var requestData = new Dictionary<string, string>
                {
                    { "grant_type", "refresh_token" },
                    { "client_id", _clientId },
                    { "client_secret", _clientSecret },
                    { "refresh_token", refreshToken }
                };

                var response = await _httpClient.PostAsync(tokenEndpoint, new FormUrlEncodedContent(requestData));

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Token refresh failed");
                    return new AuthenticationResult
                    {
                        Success = false,
                        ErrorMessage = "Invalid refresh token"
                    };
                }

                var tokenResponse = await response.Content.ReadFromJsonAsync<KeycloakTokenResponse>();

                return new AuthenticationResult
                {
                    Success = true,
                    AccessToken = tokenResponse.AccessToken,
                    RefreshToken = tokenResponse.RefreshToken,
                    ExpiresIn = tokenResponse.ExpiresIn,
                    TokenType = tokenResponse.TokenType
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during token refresh");
                return new AuthenticationResult
                {
                    Success = false,
                    ErrorMessage = "An error occurred during token refresh"
                };
            }
        }

        public async Task<bool> ValidateTokenAsync(string token)
        {
            try
            {
                var userInfo = await GetUserInfoAsync(token);
                return userInfo != null;
            }
            catch
            {
                return false;
            }
        }

        public async Task<UserInfo> GetUserInfoAsync(string token)
        {
            try
            {
                var userInfoEndpoint = $"{_keycloakUrl}/realms/{_realm}/protocol/openid-connect/userinfo";

                var request = new HttpRequestMessage(HttpMethod.Get, userInfoEndpoint);
                request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

                var response = await _httpClient.SendAsync(request);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Failed to get user info");
                    return null;
                }

                var userInfoResponse = await response.Content.ReadFromJsonAsync<KeycloakUserInfoResponse>();

                // Extract roles from token (realm roles)
                var roles = ExtractRolesFromToken(token);

                return new UserInfo
                {
                    UserId = userInfoResponse.Sub,
                    Username = userInfoResponse.PreferredUsername,
                    Email = userInfoResponse.Email,
                    FirstName = userInfoResponse.GivenName,
                    LastName = userInfoResponse.FamilyName,
                    EmailVerified = userInfoResponse.EmailVerified,
                    Roles = roles,
                    Permissions = new List<string>() // Can be extended based on roles
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user info");
                return null;
            }
        }

        public async Task RevokeTokenAsync(string token)
        {
            try
            {
                var logoutEndpoint = $"{_keycloakUrl}/realms/{_realm}/protocol/openid-connect/logout";

                var requestData = new Dictionary<string, string>
                {
                    { "client_id", _clientId },
                    { "client_secret", _clientSecret },
                    { "refresh_token", token }
                };

                await _httpClient.PostAsync(logoutEndpoint, new FormUrlEncodedContent(requestData));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error revoking token");
            }
        }

        public Task<List<string>> GetUserRolesAsync(string userId)
        {
            // This would require Keycloak Admin API
            // For now, roles are extracted from token
            throw new NotImplementedException("Use GetUserInfoAsync to get roles from token");
        }

        public Task<List<string>> GetUserPermissionsAsync(string userId)
        {
            // This would require Keycloak Admin API
            // For now, permissions are derived from roles
            throw new NotImplementedException("Use GetUserInfoAsync to get permissions from roles");
        }

        private List<string> ExtractRolesFromToken(string token)
        {
            try
            {
                // Decode JWT token to extract roles
                var parts = token.Split('.');
                if (parts.Length != 3)
                    return new List<string>();

                var payload = parts[1];
                var jsonBytes = ParseBase64WithoutPadding(payload);
                var json = System.Text.Encoding.UTF8.GetString(jsonBytes);
                
                using var document = JsonDocument.Parse(json);
                var root = document.RootElement;

                var roles = new List<string>();

                // Extract realm roles
                if (root.TryGetProperty("realm_access", out var realmAccess))
                {
                    if (realmAccess.TryGetProperty("roles", out var realmRoles))
                    {
                        roles.AddRange(realmRoles.EnumerateArray().Select(r => r.GetString()));
                    }
                }

                return roles;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error extracting roles from token");
                return new List<string>();
            }
        }

        private byte[] ParseBase64WithoutPadding(string base64)
        {
            switch (base64.Length % 4)
            {
                case 2: base64 += "=="; break;
                case 3: base64 += "="; break;
            }
            return Convert.FromBase64String(base64);
        }
    }

    // Internal DTOs for Keycloak responses
    internal class KeycloakTokenResponse
    {
        [System.Text.Json.Serialization.JsonPropertyName("access_token")]
        public string AccessToken { get; set; }
        
        [System.Text.Json.Serialization.JsonPropertyName("refresh_token")]
        public string RefreshToken { get; set; }
        
        [System.Text.Json.Serialization.JsonPropertyName("expires_in")]
        public int ExpiresIn { get; set; }
        
        [System.Text.Json.Serialization.JsonPropertyName("token_type")]
        public string TokenType { get; set; }
    }

    internal class KeycloakUserInfoResponse
    {
        [System.Text.Json.Serialization.JsonPropertyName("sub")]
        public string Sub { get; set; }
        
        [System.Text.Json.Serialization.JsonPropertyName("preferred_username")]
        public string PreferredUsername { get; set; }
        
        [System.Text.Json.Serialization.JsonPropertyName("email")]
        public string Email { get; set; }
        
        [System.Text.Json.Serialization.JsonPropertyName("given_name")]
        public string GivenName { get; set; }
        
        [System.Text.Json.Serialization.JsonPropertyName("family_name")]
        public string FamilyName { get; set; }
        
        [System.Text.Json.Serialization.JsonPropertyName("email_verified")]
        public bool EmailVerified { get; set; }
    }
}

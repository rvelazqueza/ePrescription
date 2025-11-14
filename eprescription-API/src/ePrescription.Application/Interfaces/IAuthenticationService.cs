using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EPrescription.Application.Interfaces
{
    /// <summary>
    /// Service for handling authentication with Keycloak
    /// </summary>
    public interface IAuthenticationService
    {
        /// <summary>
        /// Authenticate user with username and password
        /// </summary>
        Task<AuthenticationResult> AuthenticateAsync(string username, string password);

        /// <summary>
        /// Refresh access token using refresh token
        /// </summary>
        Task<AuthenticationResult> RefreshTokenAsync(string refreshToken);

        /// <summary>
        /// Validate if a token is valid
        /// </summary>
        Task<bool> ValidateTokenAsync(string token);

        /// <summary>
        /// Get user information from token
        /// </summary>
        Task<UserInfo> GetUserInfoAsync(string token);

        /// <summary>
        /// Revoke/logout a token
        /// </summary>
        Task RevokeTokenAsync(string token);

        /// <summary>
        /// Get user roles from Keycloak
        /// </summary>
        Task<List<string>> GetUserRolesAsync(string userId);

        /// <summary>
        /// Get user permissions from Keycloak
        /// </summary>
        Task<List<string>> GetUserPermissionsAsync(string userId);
    }

    /// <summary>
    /// Result of authentication operation
    /// </summary>
    public class AuthenticationResult
    {
        public bool Success { get; set; }
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public int ExpiresIn { get; set; }
        public string TokenType { get; set; }
        public UserInfo UserInfo { get; set; }
        public string ErrorMessage { get; set; }
    }

    /// <summary>
    /// User information from Keycloak
    /// </summary>
    public class UserInfo
    {
        public string UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool EmailVerified { get; set; }
        public List<string> Roles { get; set; }
        public List<string> Permissions { get; set; }
    }
}

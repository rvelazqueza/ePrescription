using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EPrescription.Application.Interfaces;

namespace EPrescription.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthenticationService _authenticationService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            IAuthenticationService authenticationService,
            ILogger<AuthController> logger)
        {
            _authenticationService = authenticationService;
            _logger = logger;
        }

        /// <summary>
        /// Login with username and password
        /// </summary>
        [HttpPost("login")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(AuthenticationResult), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                _logger.LogInformation("Login attempt for user: {Username}", request.Username);

                var result = await _authenticationService.AuthenticateAsync(request.Username, request.Password);

                if (!result.Success)
                {
                    _logger.LogWarning("Login failed for user: {Username}", request.Username);
                    return Unauthorized(new { message = result.ErrorMessage });
                }

                _logger.LogInformation("Login successful for user: {Username}", request.Username);

                return Ok(new
                {
                    accessToken = result.AccessToken,
                    refreshToken = result.RefreshToken,
                    expiresIn = result.ExpiresIn,
                    tokenType = result.TokenType,
                    userInfo = result.UserInfo
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login for user: {Username}", request.Username);
                return StatusCode(500, new { message = "An error occurred during login" });
            }
        }

        /// <summary>
        /// Refresh access token using refresh token
        /// </summary>
        [HttpPost("refresh")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(AuthenticationResult), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            try
            {
                _logger.LogInformation("Token refresh attempt");

                var result = await _authenticationService.RefreshTokenAsync(request.RefreshToken);

                if (!result.Success)
                {
                    _logger.LogWarning("Token refresh failed");
                    return Unauthorized(new { message = result.ErrorMessage });
                }

                _logger.LogInformation("Token refresh successful");

                return Ok(new
                {
                    accessToken = result.AccessToken,
                    refreshToken = result.RefreshToken,
                    expiresIn = result.ExpiresIn,
                    tokenType = result.TokenType
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during token refresh");
                return StatusCode(500, new { message = "An error occurred during token refresh" });
            }
        }

        /// <summary>
        /// Logout and revoke tokens
        /// </summary>
        [HttpPost("logout")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Logout([FromBody] LogoutRequest request)
        {
            try
            {
                var username = User.Identity?.Name ?? "Unknown";
                _logger.LogInformation("Logout attempt for user: {Username}", username);

                await _authenticationService.RevokeTokenAsync(request.RefreshToken);

                _logger.LogInformation("Logout successful for user: {Username}", username);

                return Ok(new { message = "Logout successful" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during logout");
                return StatusCode(500, new { message = "An error occurred during logout" });
            }
        }

        /// <summary>
        /// Get current user information
        /// </summary>
        [HttpGet("userinfo")]
        [Authorize]
        [ProducesResponseType(typeof(UserInfo), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetUserInfo()
        {
            try
            {
                var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                
                if (string.IsNullOrEmpty(token))
                {
                    return Unauthorized(new { message = "No token provided" });
                }

                var userInfo = await _authenticationService.GetUserInfoAsync(token);

                if (userInfo == null)
                {
                    return Unauthorized(new { message = "Invalid token" });
                }

                return Ok(userInfo);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user info");
                return StatusCode(500, new { message = "An error occurred getting user info" });
            }
        }

        /// <summary>
        /// Validate if token is valid
        /// </summary>
        [HttpPost("validate")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> ValidateToken([FromBody] ValidateTokenRequest request)
        {
            try
            {
                var isValid = await _authenticationService.ValidateTokenAsync(request.Token);

                return Ok(new { valid = isValid });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating token");
                return StatusCode(500, new { message = "An error occurred validating token" });
            }
        }
    }

    // Request DTOs
    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RefreshTokenRequest
    {
        public string RefreshToken { get; set; } = string.Empty;
    }

    public class LogoutRequest
    {
        public string RefreshToken { get; set; } = string.Empty;
    }

    public class ValidateTokenRequest
    {
        public string Token { get; set; } = string.Empty;
    }
}

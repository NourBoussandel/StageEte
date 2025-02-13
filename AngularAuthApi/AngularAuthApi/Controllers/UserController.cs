
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using System.Text;

using Microsoft.EntityFrameworkCore;
using AngularAuthApi.helpers;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using AngularAuthApi.context;
using AngularAuthApi.entities;
using Microsoft.AspNetCore.Identity;
using AngularAuthApi.models.Dto;
using AngularAuthApi.Repositories;
using AngularAuthApi.models;

namespace AngularAuthYtAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {


        private readonly AppDbContext _authContext;
        public UserController(AppDbContext context)
        {
            _authContext = context;


        }


        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody] auth_model userObj)
        {
            try
            {
                if (userObj == null)
                    return BadRequest();

                var user = _authContext.Utilisateurs.Include(x => x.manager).Include(x => x.contrats)
                    .Where(x => x.email == userObj.email && x.mot_de_passe == userObj.mot_de_passe)
                    .FirstOrDefault();


                if (user == null)
                    return NotFound(new { Message = "User not found!" });


                user.Token = CreateJwt(user);
                var newAccessToken = user.Token;
                var newRefreshToken = CreateRefreshToken();
                user.RefreshToken = newRefreshToken;
                user.RefreshTokenExpiryTime = DateTime.Now.AddDays(10);
                _authContext.SaveChanges();

                return Ok(new TokenApiDto()
                {
                    AccessToken = newAccessToken,
                    RefreshToken = newRefreshToken
                });
            }
            catch (Exception ex) { return NotFound(new { Message = ex.Message }); }
        }



        private string CreateJwt(user user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("veryverysceret.....");
            var contrat_id = user.contrats.FirstOrDefault()?.id_contrat ?? 0;
            var semaine_id=user.contrats.FirstOrDefault()?.id_semaine ?? 0;

            var identity = new ClaimsIdentity(new Claim[]
            { new Claim("Id", user.Id.ToString(),ClaimValueTypes.Integer ),
                new Claim(ClaimTypes.Role,user.role.ToString()),
                 new Claim(ClaimTypes.Name,$"{user.prenom} {user.nom} "),
                new Claim("id_contrat",contrat_id.ToString(),ClaimValueTypes.Integer),
                new Claim("id_semaine",semaine_id.ToString(),ClaimValueTypes.Integer)


            });

            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.Now.AddSeconds(5),
                SigningCredentials = credentials
            };
            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            return jwtTokenHandler.WriteToken(token);
        }

        private string CreateRefreshToken()
        {
            var tokenBytes = RandomNumberGenerator.GetBytes(64);
            var refreshToken = Convert.ToBase64String(tokenBytes);

            var tokenInUser = _authContext.Utilisateurs
                .Any(a => a.RefreshToken == refreshToken);
            if (tokenInUser)
            {
                return CreateRefreshToken();
            }
            return refreshToken;
        }

        private ClaimsPrincipal GetPrincipleFromExpiredToken(string token)
        {
            var key = Encoding.ASCII.GetBytes("veryverysceret.....");
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateLifetime = false
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken securityToken;
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("This is Invalid Token");
            return principal;

        }
        [HttpPost("refresh")]
        public IActionResult Refresh([FromBody] TokenApiDto tokenApiDto)
        {
            if (tokenApiDto is null)
                return BadRequest("Invalid Client Request");
            string accessToken = tokenApiDto.AccessToken;
            string refreshToken = tokenApiDto.RefreshToken;
            var principal = GetPrincipleFromExpiredToken(accessToken);
            var username = principal.Identity.Name;
            var user = _authContext.Utilisateurs.FirstOrDefault(u => u.email == username);

            if (user is null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
                return BadRequest("Invalid Request");
            var newAccessToken = CreateJwt(user);
            var newRefreshToken = CreateRefreshToken();
            user.RefreshToken = newRefreshToken;


            _authContext.SaveChanges();
            return Ok(new TokenApiDto()
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,

            });


        }


        [HttpGet("get_user_informations/"+"{id_user}")]
        public IActionResult GetUserInformation(int id_user)
        {
            try
            {
                var user_trouve = _authContext.Utilisateurs.Where(x => x.Id == id_user) 
                    .Select(x => new user_model
                {
                    Id = x.Id,
                    nom = x.nom,
                    prenom= x.prenom,
                    email = x.email,
                    numero_tel = x.numero_tel,
                    role= x.role.ToString(),
                })
                .FirstOrDefault();

                if (user_trouve == null)
                {
                    return NotFound(); // Renvoyer 404 si l'utilisateur n'est pas trouvé
                }

                return Ok(user_trouve); // Renvoyer l'utilisateur trouvé
            }
            catch (Exception ex)
            {
                return BadRequest($"Erreur lors de la récupération des informations de l'utilisateur : {ex.Message}");
            }


        }
        [HttpGet("get_notifications/"+"{id_user}")]
        public IActionResult get_all_notification(int id_user)
        {
            var notifications =_authContext.notifs
                .Include(x=>x.user)
                .Where(x=>x.id_user== id_user).ToList();
            return Ok(notifications);

        }
        [HttpPost("marker_notif_est_vue")]
        public IActionResult MarkNotificationsAsSeen(Notification notif)
        {
            try
            {
                Notification notificationToMark = _authContext.notifs
                    .FirstOrDefault(n => n.id_notif == notif.id_notif && !n.est_vue);
                    

                if (notificationToMark==null)
                {
                    return NotFound("No unseen notifications for the given user.");
                }

                
                    notificationToMark.est_vue= true;
                

                _authContext.SaveChanges();

                return Ok(new { Message = "Notifications marked as seen successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest($"Error marking notifications as seen: {ex.Message}");
            }
        }
        [HttpGet("check_new_notifications")]
        public IActionResult CheckNewNotifications()
        {
            bool hasNewNotification = _authContext.notifs.Include(x=>x.user)
                .Any(notification => !notification.est_vue);
            return Ok(hasNewNotification);
        }

    }
}
using AngularAuthApi.context;
using AngularAuthApi.entities;
using AngularAuthApi.models;
using AngularAuthApi.models.Enums;
using Microsoft.AspNetCore.Mvc;

namespace AngularAuthApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class adresseController : ControllerBase
    {
        private readonly AppDbContext _adresseContext;

        public adresseController(AppDbContext appDbContext)
        {

            _adresseContext = appDbContext;

        }
        [HttpGet("get_adresse/" + "{id}")]

        public IActionResult GetAdresse(int id)
        {
            var adresses = _adresseContext.adresses
                .Where(x => x.id_user == id).ToList();
              
            return Ok(adresses);
        }
        [HttpDelete("supprimer_adresse/" + "{id}")]
        public IActionResult DeleteAdresse(int id)
        {
            try
            {
                var adresse_supp = _adresseContext.adresses.FirstOrDefault(x => x.id_adresse == id);
                _adresseContext.adresses.Remove(adresse_supp);
                _adresseContext.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest($"Erreur lors de la suppression de l'adresse : {ex.Message}");
            }
        }
        [HttpPost("enregistrer_adresse")]
        public IActionResult SaveAdresse([FromBody] Adresse adresse)
        {
            try
            {
               

                if (adresse.id_adresse == 0)
                {
                    _adresseContext.Add(adresse);

                }
                else
                {
                    // Retrieve the existing "demande" from the database by its ID
                    Adresse existingAdresse = _adresseContext.adresses.FirstOrDefault(d => d.id_adresse == adresse.id_adresse);

                    if (existingAdresse != null)
                    {
                        // Update properties of the existing "demande" with new values
                        existingAdresse.lieu = adresse.lieu;
                        existingAdresse.region = adresse.region;
                        existingAdresse.ville = adresse.ville;
                        existingAdresse.pays = adresse.pays;
                        existingAdresse.code_postal = adresse.code_postal;




                        // Update other properties as needed...
                    }
                    else
                    {
                        // Handle the case where the "demande" with the specified ID does not exist
                        throw new ArgumentException("Adresse not found.");
                    }
                }


                // Save changes to the database
                _adresseContext.SaveChanges();
                return Ok(new { Message = "okkk" }); ; // Return the saved "demande" object
            }
            catch (Exception ex)
            {
                // Handle any potential exceptions, such as database concurrency issues
                Console.WriteLine("Error saving Adresse: " + ex.Message);
                return null;
            }
        }
    }
}

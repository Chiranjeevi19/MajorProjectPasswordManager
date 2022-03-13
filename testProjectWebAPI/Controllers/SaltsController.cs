using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using testProjectClassLibrary;

namespace testProjectWebAPI.Controllers
{
    public class SaltsController : ApiController
    {
        // GET api/<controller>
        public HttpResponseMessage GetSalts()
        {
            try
            {
                using (ProjectEntities entities = new ProjectEntities())
                {
                    var data = entities.salts.ToList();
                    return Request.CreateResponse(HttpStatusCode.OK, data);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex);
            }
        }

        // GET api/<controller>/5
        public HttpResponseMessage GetSaltByID(int id)
        {
            try
            {
                using (ProjectEntities entities = new ProjectEntities())
                {
                    var entity = entities.salts.FirstOrDefault(e => e.id == id);
                    if (entity == null)
                    {
                        return Request.CreateResponse(HttpStatusCode.NotFound, $"Salt entity with id = {id} not found!");
                    }
                    return Request.CreateResponse(HttpStatusCode.OK, entity);
                }
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex);
            }
        }

        // POST api/<controller>
        public HttpResponseMessage Post([FromBody] salt Salt)
        {
            try
            {
                using (ProjectEntities entities = new ProjectEntities())
                {
                    entities.salts.Add(Salt);
                    entities.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, Salt);
                }
                
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex);
            }

        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}
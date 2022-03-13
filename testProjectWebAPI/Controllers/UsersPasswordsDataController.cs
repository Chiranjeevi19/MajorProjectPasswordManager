using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using testProjectClassLibrary;
using System.Diagnostics;
namespace testProjectWebAPI.Controllers
{
    public class UsersPasswordsDataController : ApiController
    {
        

        // GET api/<controller>/5
        public void Get(int userid)
        {
            try
            {
                using(ProjectEntities projectEntities = new ProjectEntities())
                {
                    List<usersPasswordsData> data = projectEntities.usersPasswordsDatas.Where(x => x.userid == userid).ToList();
                    Debug.WriteLine(data.Count);
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
            }
        }

        // POST api/<controller>
        public HttpResponseMessage Post([FromBody] usersPasswordsData data)
        {
            try
            {
                using (ProjectEntities entities = new ProjectEntities())
                {
                    var userObj = new UsersController();
                    int userId = (int)data.userid;
                    var User = userObj.Get(userId);
                    Debug.WriteLine("USER");
                    if (data != null)
                    {
                        
                        entities.usersPasswordsDatas.Add(data);
                        entities.SaveChanges();
                        return Request.CreateResponse(HttpStatusCode.OK, "Added successfully");
                    }
                    else
                    {
                        return Request.CreateErrorResponse(HttpStatusCode.NoContent, "NO CONTENT");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex);
            }
        }

        // PUT api/<controller>/5
        public void Put()
        {
            
        }

        // DELETE api/<controller>/5
        public HttpResponseMessage Delete([FromBody]usersPasswordsData data)
        {
            try
            {
                using (ProjectEntities entities = new ProjectEntities())
                {
                    //var dataToBeDeleted = entities.usersPasswordsDatas.Where(x => x.userid == userid && x.url == url && x.username == uname && x.password == password.Replace(' ', '+'));
                    entities.Entry(data).State = System.Data.Entity.EntityState.Deleted;
                    entities.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "Deleted Item");
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return Request.CreateErrorResponse(HttpStatusCode.BadGateway, ex);
            }
        }

    }
}
using Microsoft.AspNetCore.Http;
using System;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.ServiceModel.Channels;
using System.Web.Http;
using testProjectClassLibrary;
using System.Diagnostics;
using ISession = System.ServiceModel.Channels.ISession;

namespace testProjectWebAPI.Controllers
{
    public class UsersController : ApiController
    {
        public System.Web.SessionState.HttpSessionState Session { get; }
        // GET api/<controller>
        [HttpGet]
        public user CheckAccountAlreadyPresent(string email)
        {
            
            using (ProjectEntities entities = new ProjectEntities())
            {
                user data = entities.users.Include("usersPasswordsDatas").Include("usersNotesDatas").FirstOrDefault(e => e.email == email);
                Debug.WriteLine(data);
                return data;
            }
            
        }

        [HttpGet]
        public HttpResponseMessage GetValidatedUser(string uemail, string upwdhash)
        {
            try
            {
                using(ProjectEntities entities = new ProjectEntities())
                {
                    user existingUser = this.CheckAccountAlreadyPresent(uemail);
                    if(existingUser is null)
                    {
                        return Request.CreateErrorResponse(HttpStatusCode.NotFound, "User Not Found");
                    }
                    else
                    {
                        if(upwdhash != existingUser.pwdhash)
                        {
                            return Request.CreateErrorResponse(HttpStatusCode.Forbidden, "Forbidden");
                        }
                        else
                        {
                            return Request.CreateResponse(HttpStatusCode.OK, existingUser);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadGateway, ex);
            }
        }

        // GET api/<controller>/5
        public user Get(int id)
        {
            try
            {
                using(ProjectEntities entities = new ProjectEntities())
                {
                    user entity = entities.users.Include("usersPasswordsDatas").Include("usersNotesDatas").FirstOrDefault(e => e.id == id);
                    Debug.WriteLine(entity.usersPasswordsDatas.ToList()[0]);
                    user User = new user
                    {
                        id = entity.id,
                        pwdhash = entity.pwdhash,
                        email = entity.email,
                        usersPasswordsDatas = entity.usersPasswordsDatas,
                        usersNotesDatas = entity.usersNotesDatas,
                    };
                    Debug.WriteLine(User.id);
                    Debug.WriteLine(User.email);
                    Debug.WriteLine(User.usersPasswordsDatas.ToList());
                    return User;
                    
                }
            }
            catch(Exception ex)
            {
                Debug.WriteLine(ex);
                return null;
            }
        }

        // POST api/<controller>
        public HttpResponseMessage Post([FromBody] user User)
        {
            try
            {
                using (ProjectEntities entities = new ProjectEntities())
                {
                    
                    if (User == null)
                    {
                        return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Enter Details Properly!");
                    }
                    var ifAlreadyPresent = CheckAccountAlreadyPresent(User.email);
                    Console.WriteLine(ifAlreadyPresent);
                    if (!(ifAlreadyPresent is null))
                    {
                        return Request.CreateErrorResponse(HttpStatusCode.BadRequest,"User already present");
                    }
                    entities.users.Add(User);
                    entities.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, User);
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
            //using(ProjectEntities entities = new ProjectEntities())
            //{
            //    entities.users.Remove(Get(id));
            //    entities.SaveChanges();
            //}
        }
    }
}
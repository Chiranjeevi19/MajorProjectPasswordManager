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
        private List<usersPasswordsData> data;
        

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
                        int id = entities.usersPasswordsDatas.FirstOrDefault(x => x.userid == userId && x.url == data.url && x.username == data.username && x.password == data.password).id;
                        return Request.CreateResponse(HttpStatusCode.OK, id.ToString());
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

      

        // DELETE api/<controller>/5
        public HttpResponseMessage Delete([FromBody]usersPasswordsData data)
        {
            try
            {
                using (ProjectEntities entities = new ProjectEntities())
                {
                    Debug.WriteLine(data.password);
                    usersPasswordsData dataToBeDeleted = entities.usersPasswordsDatas.FirstOrDefault(x => x.userid == data.userid && x.url == data.url && x.username == data.username && x.password == data.password);
                    entities.Entry(dataToBeDeleted).State = System.Data.Entity.EntityState.Deleted;
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



        public int GetId(usersPasswordsData data)
        {
            using (ProjectEntities entities = new ProjectEntities())
            {
                this.data = entities.usersPasswordsDatas.Where(x => x.userid == data.userid).ToList();
                foreach (usersPasswordsData item in this.data)
                {
                    if (item.url == data.url && item.username == data.username && item.password == data.password.Replace(' ','+'))
                    {
                        return item.id;
                    }
                }
                return -1;
            }
        }



        [HttpPut]
        public HttpResponseMessage updateData([FromBody] usersPasswordsData newData)
        {
            try
            {
                using (ProjectEntities entities = new ProjectEntities())
                {
                    int idToBeUpdated = newData.id;
                    if (idToBeUpdated != -1)
                    {
                        usersPasswordsData finaldata = entities.usersPasswordsDatas.FirstOrDefault(x => x.id == idToBeUpdated);
                        finaldata.username = newData.username;
                        finaldata.password = newData.password;
                        finaldata.url = newData.url;
                        entities.usersPasswordsDatas.Add(finaldata);
                        entities.Entry(finaldata).State = System.Data.Entity.EntityState.Modified;
                        entities.SaveChanges();
                        return Request.CreateResponse(HttpStatusCode.OK, "Updated Item");
                    }
                    else
                    {
                        return Request.CreateResponse(HttpStatusCode.OK, "Item not found");
                    }
                }
            }
            catch(Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NoContent, ex);
            }
        }






    }
}
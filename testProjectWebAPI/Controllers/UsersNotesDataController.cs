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
    public class UsersNotesDataController : ApiController
    {
        List<usersNotesData> data;
        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        private int GetId(int userid, string note)
        {
            try
            {
                using (ProjectEntities projectEntities = new ProjectEntities())
                {
                    this.data = projectEntities.usersNotesDatas.Where(x => x.userid == userid).ToList();
                    foreach (usersNotesData item in this.data)
                    {
                        Debug.WriteLine(note);
                        Debug.WriteLine(item.note.ToString());
                        if (item.note == note.Replace(' ', '+'))
                        {
                            return item.id;
                        }
                    }
                    return -1;
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return -1;
            }
        }

        // POST api/<controller>
        public HttpResponseMessage Post([FromBody] usersNotesData data)
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

                        entities.usersNotesDatas.Add(data);
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


        // DELETE api/<controller>/5
        public HttpResponseMessage Delete(int userid, string note, [FromBody] user userObj)
        {
            int idToBeDeleted = this.GetId(userid, note);
            bool isDeleted = false;
            Debug.WriteLine(idToBeDeleted);
            if(idToBeDeleted != -1)
            {
                Debug.WriteLine("NOTE TO BE DELETED" + note.Replace(' ', '+'));
                try
                {
                    using (ProjectEntities entities = new ProjectEntities())
                    {
                        foreach (usersNotesData temp in data)
                        {
                            if(temp.id == idToBeDeleted)
                            {
                                //var User = entities.users.Include("usersPasswordsDatas").Include("usersNotesDatas").Where(x => x.id == userid);
                                entities.Entry(temp).State = System.Data.Entity.EntityState.Deleted;
                                entities.SaveChanges();
                                isDeleted = true;
                            }
                        }
                        if(isDeleted)
                            return Request.CreateResponse(HttpStatusCode.OK, "Deleted Item");
                        return Request.CreateErrorResponse(HttpStatusCode.NoContent, "Couldn't find the item");
                    }
                }
                catch(Exception ex)
                {
                    Debug.WriteLine(ex.Message);
                    return Request.CreateErrorResponse(HttpStatusCode.BadGateway, ex);
                }
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.NoContent, "Item Not Found");
            }
        }


        [HttpPut]
        public HttpResponseMessage updateData(int userid, string note, string updatedNote)
        {
            int idToBeUpdated = this.GetId(userid, note);
            bool isUpdated = false;
            Debug.WriteLine(idToBeUpdated);
            if (idToBeUpdated != -1)
            {
                Debug.WriteLine("NOTE TO BE DELETED" + note.Replace(' ', '+'));
                try
                {
                    using (ProjectEntities entities = new ProjectEntities())
                    {
                        foreach (usersNotesData temp in data)
                        {
                            if (temp.id == idToBeUpdated)
                            {
                                temp.note = updatedNote.Replace(' ', '+');
                                //var User = entities.users.Include("usersPasswordsDatas").Include("usersNotesDatas").Where(x => x.id == userid);
                                entities.usersNotesDatas.Add(temp);
                                entities.Entry(temp).State = System.Data.Entity.EntityState.Modified;
                                entities.SaveChanges();
                                isUpdated = true;
                            }
                        }
                        if (isUpdated)
                            return Request.CreateResponse(HttpStatusCode.OK, "Updated Item");
                        return Request.CreateErrorResponse(HttpStatusCode.NoContent, "Couldn't find the item");
                    }
                }
                catch (Exception ex)
                {
                    Debug.WriteLine(ex.Message);
                    return Request.CreateErrorResponse(HttpStatusCode.BadGateway, ex);
                }
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.NoContent, "Item Not Found");
            }
        }



    }
}
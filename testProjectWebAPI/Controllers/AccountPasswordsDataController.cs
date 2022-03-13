using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace testProjectWebAPI.Controllers
{
    public class AccountPasswordsDataController : Controller
    {
        // GET: AccountPasswordsData
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult LoginError()
        {
            return View();
        }
    }
}
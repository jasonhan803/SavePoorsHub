using System.Web.Mvc;

namespace AdminLTE1.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View("player");
        }

        public ActionResult AnotherLink()
        {
            return View("AnotherLink");
        }

        public ActionResult Resource()
        {
            return View("Resource");  
        }

        public ActionResult Gamehost()
        {
            return View("GameHost");
        }

        public ActionResult player()
        {
            return View("player");
        }
    }
        
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace test2.Controllers
{
	[Produces("application/json")]
	[Route("api/account/[action]")]
	public class AccountController : Controller
	{
		[HttpPost]
		public Models.LoginResult Login( string Email, string Password )
		{
			var m = new Models.LoginResult();
			m.Successfull = true;
			m.Error = "pippone";
			return m;
		}
	}
}
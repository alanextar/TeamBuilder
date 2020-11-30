using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TeamBuilder.ViewModels;

namespace TeamBuilder.Controllers
{
	//For swagger swachbuckle only
	//[ApiExplorerSettings(IgnoreApi = true)]
	//https://stackoverflow.com/a/38935583/9744434
	public class ErrorsController : Controller
	{
		[Route("api/error")]
		public ErrorResponseViewModel Error()
		{
			var context = HttpContext.Features.Get<IExceptionHandlerFeature>();
			var exception = context?.Error;
			var responseException = new ErrorResponseViewModel(exception);
			Response.StatusCode = (int)responseException.Code;

			return responseException;
		}
	}
}

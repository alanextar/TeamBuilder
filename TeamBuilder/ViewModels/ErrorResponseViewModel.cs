using System;
using System.Net;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TeamBuilder.ViewModels
{
	public class ErrorResponseViewModel
	{
		public string Type { get; set; }
		public string Message { get; set; }
		public string StackTrace { get; set; }
		public HttpStatusCode Code { get; set; } = HttpStatusCode.InternalServerError;
		public bool IsNoContent { 
			get {
				return Code == HttpStatusCode.NoContent;
			} 
		}

		public ErrorResponseViewModel(Exception ex)
		{
			Type = ex.GetType().Name;
			Message = ex.Message;
			StackTrace = ex.ToString();
			if (ex is HttpStatusException httpException)
			{
				Code = httpException.Status;
			}
		}
	}
}

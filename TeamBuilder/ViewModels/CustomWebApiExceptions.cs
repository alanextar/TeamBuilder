using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace TeamBuilder.ViewModels
{
	public class HttpStatusException : Exception
	{
		public HttpStatusCode Status { get; private set; }

		public HttpStatusException(HttpStatusCode status, string msg, string debugMsg = "") : base(GetMessage(msg, debugMsg))
		{
			Status = status;
		}

		private static string GetMessage(string msg, string debugMsg)
		{
			return System.Diagnostics.Debugger.IsAttached && !String.IsNullOrEmpty(debugMsg) ? debugMsg : msg;
		}
	}
}

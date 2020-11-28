using System;
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

		public ErrorResponseViewModel(Exception ex)
		{
			Type = ex.GetType().Name;
			Message = ex.Message;
			StackTrace = ex.ToString();
		}
	}
}

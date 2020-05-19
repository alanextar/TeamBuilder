using System.Collections.Generic;

namespace TeamBuilder.ViewModels
{
	public class Page<T>
	{
		public Page(IEnumerable<T> collection, string nextHref)
		{
			Collection = collection;
			NextHref = nextHref;
		}

		public IEnumerable<T> Collection { get; set; }
		public string NextHref { get; set; }
	}
}
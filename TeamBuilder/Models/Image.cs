using System;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace TeamBuilder.Models
{
	public class Image
	{
		public long Id { get; set; }
		public string Title { get; set; }
		[JsonIgnore]
		public byte[] Data { get; set; }
		[NotMapped]
		public string DataURL => $"data:image/jpeg;base64,{Convert.ToBase64String(Data)}";
	}
}
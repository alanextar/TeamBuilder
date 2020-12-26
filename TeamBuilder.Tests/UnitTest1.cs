using FakeItEasy;
using NUnit.Framework;
using TeamBuilder.Controllers;

namespace TeamBuilder.Tests
{
	public class Tests
	{
		private UserController controller;

		[SetUp]
		public void Setup()
		{
			controller = A.Fake<UserController>();
		}

		[Test]
		public void Test1()
		{
			Assert.Pass();
		}
	}
}
using System;
using Microsoft.AspNetCore.Mvc;
using project.DataService;

namespace project.Controllers
{
    public class DatabaseController : Controller{
        private readonly DataProvider dataProvider = new DataProvider();
        private readonly DataBaseInit dataBaseInit = DataBaseInit.GetInstance();
        public IActionResult Init(){
            bool isSuccess = dataProvider.TestConnectionToMySql();
            if(isSuccess){
                dataBaseInit.InitChatAppDB();
                Console.WriteLine("call init");
            }
            
            ViewData["isSuccess"] = isSuccess;           
            return View();
        }
        public IActionResult Drop(){
            bool isSuccess = dataProvider.TestConnectionToDB();
            if(isSuccess){
                dataBaseInit.DropChatAppDB();
                Console.WriteLine("call drop");
            }
            
            ViewData["isSuccess"] = isSuccess;           
            return View();
        }
    }
}
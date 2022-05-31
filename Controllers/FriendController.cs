using System;
using project.Repository;
using project.Models;
using project.MyTool;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace project.Controllers{
    public class FriendController : Controller{
        private IFriendRepository friendRepository;
        public FriendController(){
            friendRepository = new FriendRepository();
        }
        public IActionResult SearchFriend(string key){
            if(!SessionTool.CheckSession(HttpContext, "account")){   
                return Redirect("/Account/Login");
            }
            User user = SessionTool.GetSession<User>(HttpContext, "user");
            List<User> listResult = friendRepository.SearchFriend(user, key);
            return Json(listResult);
        }
    }
}
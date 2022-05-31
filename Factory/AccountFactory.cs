using project.Models;
using System;
namespace project.Factory{
    public class AccountFactory{
        public Account CreateAccount(string email, string password){
            if(email == "admin"){
                return new AdminAccount(email, password);
            }
            return new UserAccount(email, password);
        }
    }
}
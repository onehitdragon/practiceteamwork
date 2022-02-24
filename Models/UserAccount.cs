namespace project.Models{
    public class UserAccount : Account{
        public UserAccount(string email, string password):base(email, password){

        }
        override public string GetDefaultUrl(){
            return "/Home";
        }
    }
}
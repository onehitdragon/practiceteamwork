namespace project.Models{
    public class AdminAccount : Account{
        public AdminAccount(string email, string password):base(email, password){

        }
        override public string GetDefaultUrl(){
            return "/Admin";
        }
    }
}
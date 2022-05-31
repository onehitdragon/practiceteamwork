using project.Models;
using project.DataService;
using project.Factory;
using System.Data;

namespace project.Repository{
    public class AccountRepository : IAccountRepository{
        private DataProvider dataProvider;
        private AccountFactory accountFactory;
        public AccountRepository(){
            dataProvider = new DataProvider();
            accountFactory = new AccountFactory();
        }
        public Account GetAccount(Account account){
            string query = $"SELECT * FROM users WHERE Email LIKE BINARY '{account.Email}' AND Password LIKE BINARY MD5('{account.Password}')";
            if(dataProvider.HasRow(query)){
                return account;
            }
            return null;
        }
        public Account GetAccountWithEmail(Account account){
            string query = $"SELECT * FROM users WHERE Email LIKE BINARY '{account.Email}'";
            if(dataProvider.HasRow(query)){
                return account;
            }
            return null;
        }
        public Account GetAccountWithEmail(string email){
            string query = $"SELECT * FROM users WHERE Email LIKE BINARY '{email}'";
            if(dataProvider.HasRow(query)){
                return accountFactory.CreateAccount(email, "");
            }
            return null;
        }
        public void AddAccount(Account account){
            if(GetAccountWithEmail(account) == null){
                string query = $"INSERT INTO Users(Email, Password, TimeCreated) VALUES('{account.Email}', MD5('{account.Password}'), CURRENT_TIMESTAMP())";
                dataProvider.ExcuteQuery(query);
            }
        }
        public void AddGoogleAccount(Account account){
            if(GetAccountWithEmail(account) == null){
                string query = $"INSERT INTO Users(Email, TimeCreated) VALUES('{account.Email}', CURRENT_TIMESTAMP())";
                dataProvider.ExcuteQuery(query);
            }
        }
        public string GetActiveCode(string email){
            string query = $"SELECT ActiveCode FROM users JOIN useractive ON users.id = useractive.id WHERE Email = '{email}'";
            DataTable tableUserActive = dataProvider.GetDataTable(query);
            if(tableUserActive.Rows.Count == 0){
                return null;
            }
            string activeCode = tableUserActive.Rows[0][0].ToString();
            return activeCode;
        }
        public bool ChangePasswordWithActiveCode(string activeCode, string email, string password){
            string query = $"SELECT users.id FROM users JOIN useractive ON users.id = useractive.id WHERE Email = '{email}' AND ActiveCode = '{activeCode}'";
            DataTable tableUser = dataProvider.GetDataTable(query);
            if(tableUser.Rows.Count == 0){
                return false;
            }
            long userId = int.Parse(tableUser.Rows[0][0].ToString());
            query = $"UPDATE users SET users.Password = MD5('{password}') WHERE users.id = {userId}";
            dataProvider.ExcuteQuery(query);
            return true;
        }
    }
}
using project.Models;
using System;
using project.DataService;
using System.Data;
namespace project.Repository{
    public class UserRepository : IUserRepository{
        private DataProvider dataProvider;
        protected IAccountRepository accountRepository;
        public UserRepository(){
            dataProvider = new DataProvider();
            accountRepository = new AccountRepository();
        }
        public void AddUser(User user){
            if(user.Id != 0){
                if(GetUser(user) == null){
                    string query = $"INSERT INTO Users(id , AvatarUrl, FirstName, LastName, BirthDay, Gender, Phone, TimeCreated)"
                        + $"VALUES({user.Id},'{user.AvatarUrl}',N'{user.FirstName}',N'{user.LastName}','{user.BirthDay.ToString("yyyy/MM/dd")}', {Convert.ToInt32(user.Gender)} , '{user.Phone}', CURRENT_TIMESTAMP())";
                    dataProvider.ExcuteQuery(query);  
                }
            }
            else{
                // no id
                string query = $"INSERT INTO Users(AvatarUrl, FirstName, LastName, BirthDay, Gender, Phone, TimeCreated)"
                    + $"VALUES('{user.AvatarUrl}',N'{user.FirstName}',N'{user.LastName}','{user.BirthDay.ToString("yyyy/MM/dd")}', {Convert.ToInt32(user.Gender)} , '{user.Phone}', CURRENT_TIMESTAMP())";
                dataProvider.ExcuteQuery(query);
            }   
        }
        public User GetUser(User user){
            string query = $"SELECT * FROM users WHERE id = {user.Id}";
            if(dataProvider.HasRow(query)){
                return user;
            }         
            return null;
        }
        public User CreateUserByDataRow(DataRow userRow){
            return new User(
                UInt64.Parse(userRow[0].ToString()),
                userRow[1].ToString(),
                userRow[3].ToString(),
                userRow[2].ToString(),
                DateTime.Parse(userRow[4].ToString()),
                userRow[5].ToString() == "1" ? true : false,
                userRow[8].ToString()
            );
        }
        public User GetUser(string email){
            string query = $"SELECT * FROM users WHERE email = '{email}'";
            DataTable userTable = dataProvider.GetDataTable(query);
            if(userTable.Rows.Count == 0){
                return null;
            }
            DataRow userRow = userTable.Rows[0];
            return CreateUserByDataRow(userRow);
        }
        public User GetUser(ulong id){
            string query = $"SELECT * FROM users WHERE id = {id}";
            DataTable userTable = dataProvider.GetDataTable(query);
            if(userTable.Rows.Count == 0){
                return null;
            }
            DataRow userRow = userTable.Rows[0];
            return CreateUserByDataRow(userRow);
        }
        public void UpdateUser(User newUser){
            string query = $"UPDATE users SET AvatarUrl = '{newUser.AvatarUrl}', FirstName = '{newUser.FirstName}', LastName = '{newUser.LastName}', BirthDay = '{newUser.BirthDay.ToString("yyyy/MM/dd")}', Gender = {Convert.ToInt32(newUser.Gender)}, Phone = '{newUser.Phone}' WHERE id = '{newUser.Id}'";
            dataProvider.ExcuteQuery(query);
        }
        public void UpdateUser(string email, User newUser){
            if(accountRepository.GetAccountWithEmail(email) != null){
                string query = $"UPDATE users SET AvatarUrl = '{newUser.AvatarUrl}', FirstName = '{newUser.FirstName}', LastName = '{newUser.LastName}', BirthDay = '{newUser.BirthDay.ToString("yyyy/MM/dd")}', Gender = {Convert.ToInt32(newUser.Gender)}, Phone = '{newUser.Phone}' WHERE Email = '{email}'";
                dataProvider.ExcuteQuery(query);
            }
        }        
    }
}
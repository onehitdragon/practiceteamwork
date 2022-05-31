using project.Models;
using System.Data;
namespace project.Repository{
    public interface IUserRepository{
        void AddUser(User user);
        User GetUser(User user);
        User CreateUserByDataRow(DataRow userRow);
        User GetUser(string email);
        User GetUser(ulong id);
        void UpdateUser(string email, User newUser);
        void UpdateUser(User newUser);
    }
}
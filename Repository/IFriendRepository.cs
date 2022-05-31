using System.Collections.Generic;
using project.Models;
namespace project.Repository{
    public interface IFriendRepository{
        List<User> GetListFriend(User user, string type);
        List<User> GetListFriending(User user);
        List<User> GetListRequesting(User user);
        List<User> SearchFriend(User user, string key);
        void AddRequestingRelation(User sender, User receiver);
        void RemoveRequestingRelation(User sender, User receiver);
        void UpdateFriendingRelation(User sender, User receiver);
    }
}
using System.Collections.Generic;
using project.Models;
namespace project.Repository{
    public interface IConversationRepository{
        List<Conversation> GetListConversation(User user);
    }
}
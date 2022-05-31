using project.Models;
namespace project.Repository{
    public interface IMessageReaderRepository{
        void AddMessage(string json);
        void AddReader(string json, User user);
        int GetAmountMessageNotReaded(string json, User user);
    }
}
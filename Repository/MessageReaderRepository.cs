using System.IO;
using Newtonsoft.Json.Linq;
using project.Models;
using System;
using project.MyTool;
namespace project.Repository{
    public class MessageReaderRepository : IMessageReaderRepository{
        private string path;
        public MessageReaderRepository(){
            path = Path.Combine(Startup.rootPath, "Repository", "MessageReaderData.json");
        }
        public void AddMessage(string json){
            JObject conversation = JObject.Parse(json);
            JObject message = conversation["Messages"].Last as JObject;
            message.Property("TypeMessage").AddAfterSelf(new JProperty("Readers", new JArray()));

            JArray conversations = JArray.Parse(File.ReadAllText(path));
            foreach(JObject conversationItem in conversations){
                if(((int)conversationItem.Property("Id")) == ((int)conversation.Property("Id"))){
                    (conversationItem["Messages"].Last as JObject).AddAfterSelf(message);
                    File.WriteAllText(path, conversations.ToString());
                    return;
                }
            }
            conversations.Add(conversation);
            File.WriteAllText(path, conversations.ToString());
        }
        public void AddReader(string json, User user){
            JObject conversation = JObject.Parse(json);
            JArray conversations = JArray.Parse(File.ReadAllText(path));
            foreach(JObject conversationItem in conversations){
                if(((int)conversationItem.Property("Id")) == ((int)conversation.Property("Id"))){
                    JArray messages = conversationItem["Messages"] as JArray;
                    for(int i = messages.Count - 1; i >= 0; i--){
                        JObject message = messages[i] as JObject;
                        if(((ulong)message["Sender"]["Id"]) == user.Id){
                            break;
                        }
                        if(message["Readers"] == null){
                            break;
                        }
                        JArray readers = message["Readers"] as JArray;
                        if(IsReaded(readers, user)){
                            break;
                        }
                        readers.Add(JObject.Parse(JsonTool.EnCode(user)));
                    }
                    File.WriteAllText(path, conversations.ToString());
                    break;
                }
            }
        }
        private bool IsReaded(JArray readers, User user){
            foreach(JObject reader in readers){
                if(((ulong)reader.Property("Id")) == user.Id){
                    return true;
                }
            }
            return false;
        }
        public int GetAmountMessageNotReaded(string json, User user){
            int amount = 0;
            JObject conversation = JObject.Parse(json);
            JArray conversations = JArray.Parse(File.ReadAllText(path));
            foreach(JObject conversationItem in conversations){
                if(((int)conversationItem.Property("Id")) == ((int)conversation.Property("Id"))){
                    JArray messages = conversationItem["Messages"] as JArray;
                    for(int i = messages.Count - 1; i >= 0; i--){
                        JObject message = messages[i] as JObject;
                        if(((ulong)message["Sender"]["Id"]) == user.Id){
                            break;
                        }
                        if(message["Readers"] == null){
                            break;
                        }
                        JArray readers = message["Readers"] as JArray;
                        if(IsReaded(readers, user)){
                            break;
                        }
                        else{
                            amount++;
                        }
                    }
                    break;
                }
            }
            return amount;
        }
    }
}
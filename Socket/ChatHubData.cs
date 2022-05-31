using project.Models;
using System;
using System.Collections.Generic;

namespace project.Socket{
    public class ChatHubData{
        private static ChatHubData instance;
        public static ChatHubData GetInstance(){
            if(instance == null){
                return instance = new ChatHubData();
            }
            return instance;
        }
        private Dictionary<string, ClientData> dictionaryClient;
        public Dictionary<string, ClientData> DictionaryClient{
            get{
                return dictionaryClient;
            }
            set{
                dictionaryClient = value;
            }
        }
        private ChatHubData(){
            dictionaryClient = new Dictionary<string, ClientData>();
        }
        public void AddClient(string connectionId, ClientData client){
            if(dictionaryClient.ContainsKey(connectionId)){
                dictionaryClient[connectionId] = client;
            }
            else{
                dictionaryClient.Add(connectionId, client);
            }
        }
        public void RemoveClient(string connectionId){
            dictionaryClient.Remove(connectionId);
        }
        public ClientData GetClientData(string connectionId){
            return dictionaryClient[connectionId];
        }
        public string GetConnectionId(User user){
            foreach(var client in dictionaryClient){
                if(client.Value.User.Id == user.Id){
                    return client.Key;
                }
            }
            return null;
        }
        public string UserIsOnline(User user){
            foreach(var clientData in dictionaryClient){
                if(clientData.Value.User.Id == user.Id){
                    return clientData.Key;
                }
            }
            return null;
        }
    }
}
using project.Models;
using System;
using System.Collections.Generic;

namespace project.Socket{
    public class ClientData{
        private User user;
        private List<Conversation> listConversation;
        public List<Conversation> ListConversation{
            get{
                return listConversation;
            }
            set{
                listConversation = value;
            }
        }
        public User User{
            get{
                return user;
            }
            set{
                user = value;
            }
        }
        public ClientData(User user, List<Conversation> listConversation){
            this.user = user;
            this.listConversation = listConversation;
        }
    }
}
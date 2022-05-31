using System;
using System.Collections.Generic;
namespace project.Models{
    public class Conversation{
        private int id;
        private string title;
        private ulong creatorId;
        private List<User> participants;
        private List<Message> messages;
        public int Id{
            get{
                return id;
            }
            set{
                id = value;
            }
        }
        public string Title{
            get{
                return title;
            }
            set{
                title = value;
            }
        }
        public ulong CreatorId{
            get{
                return creatorId;
            }
            set{
                creatorId = value;
            }
        }
        public List<User> Participants{
            get{
                return participants;
            }
            set{
                participants = value;
            }
        }
        public List<Message> Messages{
            get{
                return messages;
            }
            set{
                messages = value;
            }
        }
        public Conversation(int id, string title, ulong creatorId, List<User> idParticipants, List<Message> messages){
            this.id = id;
            this.title = title;
            this.creatorId = creatorId;
            this.participants = idParticipants;
            this.messages = messages;
        }
        public List<User> GetOtherParticipants(User user){
            List<User> listParticiant = new List<User>();
            foreach(var participant in participants){
                if(participant.Id != user.Id){
                    listParticiant.Add(participant);
                }
            }
            return listParticiant;
        }
    }
}
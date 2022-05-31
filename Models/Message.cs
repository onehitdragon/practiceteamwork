using System;
namespace project.Models{
    public class Message{
        private int id;
        private User sender;
        private TypeMessage typeMessage;
        private string content;
        private string fileAttachUrl;
        private DateTime createAt;
        public int Id{
            get{
                return id;
            }
            set{
                id = value;
            }
        }
        public User Sender{
            get{
                return sender;
            }
            set{
                sender = value;
            }
        }
        public TypeMessage TypeMessage{
            get{
                return typeMessage;
            }
            set{
                typeMessage = value;
            }
        }
        public string Content{
            get{
                return content;
            }
            set{
                content = value;
            }
        }
        public string FileAttachUrl{
            get{
                return fileAttachUrl;
            }
            set{
                fileAttachUrl = value;
            }
        }
        public DateTime CreateAt{
            get{
                return createAt;
            }
            set{
                createAt = value;
            }
        }
        public Message(int id, User sender, TypeMessage typeMessage, string content, string fileAttachUrl, DateTime createAt){
            this.id = id;
            this.sender = sender;
            this.typeMessage = typeMessage;
            this.content = content;
            this.fileAttachUrl = fileAttachUrl;
            this.createAt = createAt;
        }
    }
}
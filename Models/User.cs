using System;
namespace project.Models{
    public class User{
        protected ulong id;
        protected string avatarUrl;
        protected string lastName;
        protected string firstName;
        protected DateTime birthDay;
        protected bool gender;
        protected string phone;
        public ulong Id{
            get{
                return id;
            }
            set{
                id = value;
            }
        }
        public string AvatarUrl{
            get{
                return avatarUrl;
            }
            set{
                avatarUrl = value;
            }
        }
        public string LastName{
            get{
                return lastName;
            }
            set{
                lastName = value;
            }
        }
        public string FirstName{
            get{
                return firstName;
            }
            set{
                firstName = value;
            }
        }
        public DateTime BirthDay{
            get{
                return birthDay;
            }
            set{
                birthDay = value;
            }
        }
        public bool Gender{
            get{
                return gender;
            }
            set{
                gender = value;
            }
        }
        public string Phone{
            get{
                return phone;
            }
            set{
                phone = value;
            }
        }
        public User(){}
        public User(string lastName, string avatarUrl){
            this.lastName = lastName;
            this.avatarUrl = avatarUrl;
        }
        public User(ulong id, string avatarUrl, string lastName){
            this.id = id;
            this.avatarUrl = String.IsNullOrEmpty(avatarUrl) ? "/img/layout/default-avatar.jpg" : avatarUrl;
            this.lastName = lastName;
        }
        public User(ulong id, string avatarUrl, string lastName, string firstName, DateTime birthDay, bool gender, string phone){
            this.id = id;
            this.avatarUrl = String.IsNullOrEmpty(avatarUrl) ? "/img/layout/default-avatar.jpg" : avatarUrl;
            this.lastName = lastName;
            this.firstName = firstName;
            this.birthDay = birthDay;
            this.gender = gender;
            this.phone = phone;
        }
        public User(string avatarUrl, string lastName, string firstName, DateTime birthDay, bool gender, string phone){
            this.avatarUrl = String.IsNullOrEmpty(avatarUrl) ? "/img/layout/default-avatar.jpg" : avatarUrl;
            this.lastName = lastName;
            this.firstName = firstName;
            this.birthDay = birthDay;
            this.gender = gender;
            this.phone = phone;
        }
    }
}
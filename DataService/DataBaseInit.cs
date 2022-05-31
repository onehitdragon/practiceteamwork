namespace project.DataService{
    public class DataBaseInit{
        private static DataBaseInit instance;
        private readonly DataProvider dataProvider = new DataProvider();
        private DataBaseInit(){}
        public static DataBaseInit GetInstance(){
            if(instance == null){
                instance = new DataBaseInit();
            }
            return instance;
        }
        //
        public void InitChatAppDB(){
            // create database
            string query = "CREATE DATABASE IF NOT EXISTS chatapp";
            dataProvider.ExcuteQueryNonDB(query);    

            // create user table
            query = "CREATE TABLE IF NOT EXISTS Users("
                +"id BIGINT unsigned PRIMARY KEY AUTO_INCREMENT,"
                +"AvatarUrl text,"
                +"FirstName VARCHAR(100) charset utf8,"
                +"LastName VARCHAR(100) charset utf8,"
                +"BirthDay date,"
                +"Gender int,"
                +"Email varchar(100),"
                +"Password varchar(100),"
                +"Phone varchar(13),"
                +"TimeCreated DateTime,"
                +"UNIQUE(Email)"
            +");";           
            dataProvider.ExcuteQuery(query);
            
            // init user data
            query = "SELECT * FROM Users";
            if(dataProvider.GetDataTable(query).Rows.Count == 0){
                query = "INSERT INTO Users(FirstName, LastName, BirthDay, Gender, Email, Password, Phone, TimeCreated) VALUES(N'B',N'Nguyễn','1997/1/15',1,'B@gmail.com', MD5('12345'), '08684242451', CURRENT_TIMESTAMP());"
                    +"INSERT INTO Users(FirstName, LastName, BirthDay, Gender, Email, Password, Phone, TimeCreated) VALUES(N'admin',N'admin','1999/5/23',0,'admin', MD5('admin'), '28614242451', CURRENT_TIMESTAMP());"
                    +"INSERT INTO Users(FirstName, LastName, BirthDay, Gender, Email, Password, Phone, TimeCreated) VALUES(N'C',N'Trần','1999/5/23',0,'C@gmail.com', MD5('12345'), '08614242451', CURRENT_TIMESTAMP());"
                    +"INSERT INTO Users(FirstName, LastName, BirthDay, Gender, Email, Password, Phone, TimeCreated) VALUES(N'G',N'Trần','2001/6/5',0,'G@gmail.com', MD5('12345'), '68614142451', CURRENT_TIMESTAMP());"
                    +"INSERT INTO Users(FirstName, LastName, BirthDay, Gender, Email, Password, Phone, TimeCreated) VALUES(N'A',N'Ngọc','1999/2/16',1,'A@gmail.com', MD5('12345'), '58614242451', CURRENT_TIMESTAMP());"
                    +"INSERT INTO Users(FirstName, LastName, BirthDay, Gender, Email, Password, Phone, TimeCreated) VALUES(N'Z',N'Huỳnh','2005/11/29',0,'Z@gmail.com', MD5('12345'), '18614242451', CURRENT_TIMESTAMP());";
                dataProvider.ExcuteQuery(query);
            }

            //create active table
            query = "CREATE TABLE IF NOT EXISTS UserActive ("
                +"id BIGINT unsigned,"
                +"ActiveCode varchar(100),"
                +"FOREIGN KEY (id) REFERENCES users(id)"           
            +")";
            dataProvider.ExcuteQuery(query);

            // init active data
            query = "SELECT * FROM UserActive";
            if(dataProvider.GetDataTable(query).Rows.Count == 0){
                query = "INSERT INTO UserActive VALUES(3, 'abc');"
                        +"INSERT INTO UserActive VALUES(5, '123')";
                dataProvider.ExcuteQuery(query);
            }

            // create conversation table
            query = "CREATE TABLE IF NOT EXISTS conversation("
                +"Id int PRIMARY KEY AUTO_INCREMENT,"
                +"Title varchar(100) charset utf8,"
                +"Creator_Id BIGINT unsigned,"
                +"Create_at DateTime,"
                +"Update_at DateTime,"
                +"Delete_at DateTime,"
                +"FOREIGN KEY (Creator_Id) REFERENCES users(id)"
            +")";
            dataProvider.ExcuteQuery(query);

            //init conversation data
            query = "SELECT * FROM conversation";
            if(dataProvider.GetDataTable(query).Rows.Count == 0){
                query = "INSERT INTO conversation(Title, Creator_Id, Create_at, Update_at, Delete_at) VALUES (N'Nguyễn B', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL);"
                    +"INSERT INTO conversation(Title, Creator_Id, Create_at, Update_at, Delete_at) VALUES (N'Ngọc A', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL);"
                    +"INSERT INTO conversation(Title, Creator_Id, Create_at, Update_at, Delete_at) VALUES (N'Trần G', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL);";
                dataProvider.ExcuteQuery(query);
            }

            // create messages table
            query = "CREATE TABLE IF NOT EXISTS messages("
                +"Id int PRIMARY KEY AUTO_INCREMENT,"
                +"Conversation_Id int,"
                +"Sender_Id BIGINT unsigned,"
                +"Message_Type ENUM('text','file'),"
                +"Message varchar(255) charset utf8,"
                +"Attachment_url text,"
                +"Create_at DateTime,"
                +"Delete_at DateTime,"
                +"FOREIGN KEY (Conversation_Id) REFERENCES conversation(Id),"
                +"FOREIGN KEY (Sender_Id) REFERENCES users(id)"
            +")";
            dataProvider.ExcuteQuery(query);

            // init message data
            query = "SELECT * FROM messages";
            if(dataProvider.GetDataTable(query).Rows.Count == 0){
                query = "INSERT INTO messages(Conversation_Id, Sender_Id, Message_Type, Message, Attachment_url, Create_at) VALUES (1, 1, 'text', N'Xin Chào', NULL, CURRENT_TIMESTAMP);"
                    +"INSERT INTO messages(Conversation_Id, Sender_Id, Message_Type, Message, Attachment_url, Create_at) VALUES (1, 5, 'text', N'Chào', NULL, CURRENT_TIMESTAMP);"
                    +"INSERT INTO messages(Conversation_Id, Sender_Id, Message_Type, Message, Attachment_url, Create_at) VALUES (1, 1, 'text', N'You are hero?', NULL, CURRENT_TIMESTAMP);"
                    +"INSERT INTO messages(Conversation_Id, Sender_Id, Message_Type, Message, Attachment_url, Create_at) VALUES (1, 5, 'text', N'I am not a hero, you?', NULL, CURRENT_TIMESTAMP);"
                    +"INSERT INTO messages(Conversation_Id, Sender_Id, Message_Type, Message, Attachment_url, Create_at) VALUES (2, 5, 'text', N'Are you fine?', NULL, CURRENT_TIMESTAMP);"
                    +"INSERT INTO messages(Conversation_Id, Sender_Id, Message_Type, Message, Attachment_url, Create_at) VALUES (2, 4, 'text', N'gg tonight', NULL, CURRENT_TIMESTAMP);"
                    +"INSERT INTO messages(Conversation_Id, Sender_Id, Message_Type, Message, Attachment_url, Create_at) VALUES (2, 4, 'text', N'are you?', NULL, CURRENT_TIMESTAMP);";
                dataProvider.ExcuteQuery(query);
            }

            // create participants table
            query = "CREATE TABLE IF NOT EXISTS participants("
                +"id int PRIMARY KEY AUTO_INCREMENT,"
                +"Conversation_Id int,"
                +"Users_Id BIGINT unsigned,"
                +"FOREIGN KEY (Conversation_Id) REFERENCES conversation(Id),"
                +"FOREIGN KEY (Users_Id) REFERENCES users(id)"
            +")";
            dataProvider.ExcuteQuery(query);

            // init participant data
            query = "SELECT * FROM participants";
            if(dataProvider.GetDataTable(query).Rows.Count == 0){
                query = "INSERT INTO participants(Conversation_Id, Users_Id) VALUES (1, 1);"
                    +"INSERT INTO participants(Conversation_Id, Users_Id) VALUES (1, 5);"
                    +"INSERT INTO participants(Conversation_Id, Users_Id) VALUES (2, 4);"
                    +"INSERT INTO participants(Conversation_Id, Users_Id) VALUES (2, 5);"
                    +"INSERT INTO participants(Conversation_Id, Users_Id) VALUES (3, 3);"
                    +"INSERT INTO participants(Conversation_Id, Users_Id) VALUES (3, 5);";
                dataProvider.ExcuteQuery(query);
            }

            // create relation table
            query = "CREATE TABLE relation("
                +"id int PRIMARY KEY AUTO_INCREMENT,"
                +"Sender BIGINT UNSIGNED,"
                +"Receiver BIGINT UNSIGNED,"
                +"State ENUM('requesting','friending'),"
                +"FOREIGN KEY (Sender) REFERENCES users(id),"
                +"FOREIGN KEY (Receiver) REFERENCES users(id)"
            +")";
            dataProvider.ExcuteQuery(query);

            // init relation table
            query = "SELECT * FROM relation";
            if(dataProvider.GetDataTable(query).Rows.Count == 0){
                query = "INSERT INTO relation(Sender, Receiver, State) VALUES (5, 1, 'friending');"
                        +"INSERT INTO relation(Sender, Receiver, State) VALUES (5, 2, 'requesting');"
                        +"INSERT INTO relation(Sender, Receiver, State) VALUES (3, 5, 'friending');"
                        +"INSERT INTO relation(Sender, Receiver, State) VALUES (4, 5, 'friending');";
                dataProvider.ExcuteQuery(query);
            }
        }
        public void DropChatAppDB(){
            string query = "DROP DATABASE IF EXISTS chatapp";
            dataProvider.ExcuteQueryNonDB(query);
        }
    }
}
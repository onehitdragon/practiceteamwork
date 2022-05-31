using MySql.Data.MySqlClient;
using System.Data;
namespace project.DataService{
    public class DataProvider{
        private string connectionStr = DataBaseConfig.mySqlConnectionStr;
        public bool TestConnectionToMySql(){
            try{
                MySqlConnection connect = new MySqlConnection(DataBaseConfig.mySqlConnectionStrNoDB);
                connect.Open();
                connect.Close();
            }
            catch{
                return false;
            }
            return true;
        }
        public bool TestConnectionToDB(){
            try{
                MySqlConnection connect = new MySqlConnection(DataBaseConfig.mySqlConnectionStr);
                connect.Open();
                connect.Close();
            }
            catch{
                return false;
            }
            return true;
        }
        public bool TestConnect(){
            if(TestConnectionToMySql() && TestConnectionToDB()){
                return true;
            }
            return false;
        }       
        //
        public void ExcuteQuery(string query){
            MySqlConnection connect = new MySqlConnection(connectionStr);
            connect.Open();
            MySqlCommand cmd = new MySqlCommand(query, connect);
            cmd.ExecuteNonQuery();
            connect.Close();
        }
        public void ExcuteQueryNonDB(string query){   
            MySqlConnection connect = new MySqlConnection(DataBaseConfig.mySqlConnectionStrNoDB);
            connect.Open();
            MySqlCommand cmd = new MySqlCommand(query, connect);
            cmd.ExecuteNonQuery();
            connect.Close();
        }
        public DataTable GetDataTable(string query){
            MySqlConnection connect = new MySqlConnection(connectionStr);
            connect.Open();
            MySqlCommand cmd = new MySqlCommand(query, connect);
            MySqlDataAdapter adapter = new MySqlDataAdapter(cmd);
            DataTable tb = new DataTable();
            adapter.Fill(tb);
            connect.Close();

            return tb;
        }
        public bool HasRow(string query){
            return GetDataTable(query).Rows.Count > 0 ? true : false;
        }
    }
}
using Newtonsoft.Json;
namespace project.MyTool{
    public class JsonTool{
        public static string EnCode(object _object){
            return JsonConvert.SerializeObject(_object);
        }
        public static object DeCode(string json){ 
            return JsonConvert.DeserializeObject(json);
        }
        public static T DeCode<T>(string json){ 
            return JsonConvert.DeserializeObject<T>(json);
        }
    }
}
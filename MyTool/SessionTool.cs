using Microsoft.AspNetCore.Http;
using System;
using System.Text.Json;
using project.Models;
namespace project.MyTool{
    public class SessionTool{
        public static void AddSession(HttpContext httpContext, string key, string value){
            httpContext.Session.SetString(key, value);
        }
        public static void AddSession<T>(HttpContext httpContext, string key, T _value){
            string value = JsonSerializer.Serialize(_value);          
            httpContext.Session.SetString(key, value);
        }
        public static string GetSession(HttpContext httpContext, string key){
            return httpContext.Session.GetString(key);
        }
        public static T GetSession<T>(HttpContext httpContext, string key){
            string result = httpContext.Session.GetString(key);
            return JsonSerializer.Deserialize<T>(result);
        }
        public static void DeleteSession(HttpContext httpContext, string key){
            httpContext.Session.Remove(key);
        }
        public static void ClearSession(HttpContext httpContext, string key){
            httpContext.Session.Clear();
        }
        public static bool CheckSession(HttpContext httpContext, string key){
            if(String.IsNullOrEmpty(SessionTool.GetSession(httpContext, key))){
                return false;
            }
            return true;
        }
    }
}
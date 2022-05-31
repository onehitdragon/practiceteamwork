using Microsoft.AspNetCore.Http;
using System;
namespace project.MyTool{
    public class CookieTool{
        private static CookieOptions cookieOptions = new CookieOptions();
        public static void CreateCookieDays(HttpContext httpContext, string key, string value, int daysExpire, string path){
            cookieOptions.Expires = new DateTimeOffset(DateTime.Now.AddDays(daysExpire));
            cookieOptions.Path = path;
            Console.WriteLine(cookieOptions.Domain);
            httpContext.Response.Cookies.Append(key, value, cookieOptions);
        }
        public static void DeleteCookie(HttpContext httpContext, string key, string path){
            if(CheckCookie(httpContext, key)){
                cookieOptions.Path = "/Account/Login";
                httpContext.Response.Cookies.Delete(key, cookieOptions);
            }
        }
        public static bool CheckCookie(HttpContext httpContext, string key){
            if(httpContext.Request.Cookies[key] == null){
                return false;
            }
            return true;
        }
        public static bool CheckCookie(HttpContext httpContext, string key, string value){
            if(!CheckCookie(httpContext, key)){
                return false;
            }
            if(httpContext.Request.Cookies[key] != value){
                return false;
            }          
            return true;
        }
        public static string GetCookie(HttpContext httpContext, string key){
            if(CheckCookie(httpContext, key)){
                return httpContext.Request.Cookies[key];
            }
            return "";
        }
    }
}
using System.Threading.Tasks;
using System;
using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;

namespace project.Email{
    public class MailService{
        private string senderMail = "onehitdragon15@gmail.com";
        private string passwordSender = "ihopethat";
        public async Task SendMailAsync(string receiverMail, string content){
            var email = new MimeMessage();
            email.Sender = MailboxAddress.Parse(this.senderMail);
            email.To.Add(MailboxAddress.Parse(receiverMail));
            email.Subject = "Chat App";

            var builder = new BodyBuilder();
            builder.TextBody = content;
            email.Body = builder.ToMessageBody();

            var smtp = new SmtpClient();
            smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            smtp.Authenticate(this.senderMail, this.passwordSender);
            await smtp.SendAsync(email);
            smtp.Disconnect(true);
            Console.WriteLine("send mail");
        }
    }
}
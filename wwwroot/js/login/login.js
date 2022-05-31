import {mainElement, ajax, messagePopup} from "../init.js";
const formLoginElement = document.querySelector('.body > .body__main .login-form');
const inputEmailElement = document.querySelector(".body > .body__main .login-form > .login-form__row > input[name='Email']");
const inputPasswordElement = document.querySelector(".body > .body__main .login-form > .login-form__row > input[name='Password']");
const btnLoginElement = document.querySelector(".body > .body__main .login-form > button[name='login']");
const btnRegisterElement = document.querySelector(".body > .body__main .login-form > button[name='register']");
const checkBoxElement = document.querySelector(".body > .body__main .login-form > .login-form__row--custom > div:first-child > input[type='checkbox']");
const loaddingImageElement = document.querySelector('.body > .body__main .login-form .loading');

// init ui
formLoginElement.removeChild(loaddingImageElement);
//

btnLoginElement.addEventListener('click', () => {
    // ui
    formLoginElement.replaceChild(loaddingImageElement ,btnLoginElement);
    //
    let email = inputEmailElement.value;
    let password = inputPasswordElement.value;
    ajax.sendPOST('/Account/Login', `Email=${email}&&Password=${password}&&SavePassword=${checkBoxElement.checked}`, (res) => {        
        setTimeout(() => {
            // ui
            formLoginElement.replaceChild(btnLoginElement, loaddingImageElement);
            //
            let data = JSON.parse(res.responseText);
            let messageElement;
            if(data.errorConnection){
                messageElement = messagePopup.createMessageElement(
                    '/img/layout/fail.png',
                    'Thông báo',
                    'Lỗi kết nối',
                    () => {
                        mainElement.removeChild(messageElement);
                    },
                    () => {
                        mainElement.removeChild(messageElement);
                    }
                );
            }
            else if(data.isSuccess){
                messageElement = messagePopup.createMessageElement(
                    '/img/layout/success.png',
                    'Thông báo',
                    'Đăng nhập thành công',
                    () => {
                        mainElement.removeChild(messageElement);
                        window.location.href = data.nextUrl;
                    },
                    () => {
                        mainElement.removeChild(messageElement);
                    },
                    {
                        hideCancer : true
                    }
                );
            }
            else{
                messageElement = messagePopup.createMessageElement(
                    '/img/layout/fail0.png',
                    'Thông báo',
                    'Sai tên tài khoản hoặc mật khẩu',
                    () => {
                        mainElement.removeChild(messageElement);
                    },
                    () => {
                        mainElement.removeChild(messageElement);
                    }
                );
            }
            mainElement.appendChild(messageElement);
        }, 1000)  
    });
});

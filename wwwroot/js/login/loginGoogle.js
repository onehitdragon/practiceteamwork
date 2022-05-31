import {mainElement, ajax, messagePopup} from "../init.js";
//google sign in
const myBtnGoogleSignInElement = document.querySelector('.body > .body__main .other-login > div:nth-child(2)');

function onSuccess(googleUser) {
    var profile = googleUser.getBasicProfile();
    let name = profile.getName();
    let avatarUrl = profile.getImageUrl();
    let Email = profile.getEmail();
    
    ajax.sendPOST('/Account/LoginGoogle', `EmailGoogle=${Email}&&GoogleName=${name}&&AvatarUrl=${avatarUrl}`, (res) => {
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
        else if(data.accountIsExist){
            messageElement = messagePopup.createMessageElement(
                avatarUrl,
                'Thông báo',
                'Chào mừng trở lại',
                () => {
                    mainElement.removeChild(messageElement);
                    window.location.href = '/Home';
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
                avatarUrl,
                'Thông báo',
                'Đăng nhập thành công',
                () => {
                    window.location.href = '/Home';
                },
                () => {
                    mainElement.removeChild(messageElement);
                },
                {
                    hideCancer : true
                }
            );
        }
        mainElement.appendChild(messageElement);
    })
}
function onFailure(error) {
    console.log(error);
    if(error.error != 'popup_closed_by_user'){
        let messageElement = messagePopup.createMessageElement(
            'img/layout/fail.png',
            'Thông báo',
            'Lỗi kết nối tới google',
            () => {
                mainElement.removeChild(messageElement);
            },
            () => {
                mainElement.removeChild(messageElement);
            }
        );
        mainElement.appendChild(messageElement);
    }
    else{
        
    }  
}
function renderButton() {
    gapi.load('auth2', function() {
        let googleAuth = gapi.auth2.init({
            client_id: '685022627226-qtgim2ke5al80ljtqqfig4anfhed5110.apps.googleusercontent.com'
        });
        googleAuth.attachClickHandler(myBtnGoogleSignInElement, {}, onSuccess, onFailure);
    });
}
window.renderButton = renderButton;
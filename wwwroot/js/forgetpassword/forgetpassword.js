import {ajax, mainElement} from "../init.js";
import MessagePopup from "../messagePopup.js";
let btnForgetElement = document.querySelector("input[name='button-forget']");
const btnCancertElement = document.querySelector("input[name='button-cancer']");
const inputEmailElement = document.querySelector("input[name='txtEmai']");

btnForgetElement.addEventListener('click', eventButtonForget);

function eventButtonForget(){
    const email = inputEmailElement.value;
    const messagePopup = new MessagePopup();
    const messageElement = messagePopup.createMessageLoadingElement('');
    mainElement.appendChild(messageElement);
    if(!email) return;
    ajax.sendPOST('/Account/ForgetPassword', `email=${email}`, (res) => {
        const data = JSON.parse(res.responseText);
        if(!data.isSuccess){
            alert("Email chưa đăng ký tài khoản nào!");
        }
        else{
            alert("Đã gửi mã kích hoạt!");
            showPasswordChangeElement();
        }
        console.log("remove");
        mainElement.removeChild(messageElement);
    });
}

function showPasswordChangeElement(){
    const rowPasswordElement = document.createElement('div');
    rowPasswordElement.className = 'row';
    rowPasswordElement.innerHTML = `
        <input type="text" name="txtMatkhau" placeholder="Mật khẩu">
        <i class="fa-solid fa-eye"></i>
    `;
    const rowRepeatPasswordElement = document.createElement('div');
    rowRepeatPasswordElement.className = 'row';
    rowRepeatPasswordElement.innerHTML = `
        <input type="text" name="txtRepass" placeholder="Nhập lại mật khẩu">
        <i  class="fa-solid fa-lock"></i>
    `;
    const rowActiveCodeElement = document.createElement('div');
    rowActiveCodeElement.className = 'row';
    rowActiveCodeElement.innerHTML = `
        <input type="text" name="txtMa" placeholder="Nhập mã kích hoạt">
        <i class="fa-solid fa-rotate-left"></i>
    `;
    const btnForgetWrapElement = btnForgetElement.parentElement;
    btnForgetWrapElement.insertAdjacentElement('beforebegin', rowPasswordElement);
    btnForgetWrapElement.insertAdjacentElement('beforebegin', rowRepeatPasswordElement);
    btnForgetWrapElement.insertAdjacentElement('beforebegin', rowActiveCodeElement);
    btnForgetElement.removeEventListener('click', eventButtonForget);
    btnForgetElement.textContent = 'Đổi mật khẩu';
    btnForgetElement.addEventListener('click' ,() => {
        const email = inputEmailElement.value;
        const password = rowPasswordElement.querySelector('input').value;
        const repeatPassword = rowRepeatPasswordElement.querySelector('input').value;
        const activeCode = rowActiveCodeElement.querySelector('input').value;
        if(!email || !password || !repeatPassword || !activeCode){
            alert("Hãy nhập đủ thông tin!");
            return;
        }
        if(password != repeatPassword){
            alert("Mật khẩu nhập lại sai!");
            return;
        }
        ajax.sendPOST('/Account/ForgetPasswordChange', `email=${email}&&password=${password}&&activeCode=${activeCode}`, (res) => {
            const data = JSON.parse(res.responseText);
            if(data.isSuccess){
                alert("Đổi mật khẩu thành công!");
                window.location.href = '/Home';
            }
            else{
                alert("Sai mã kính hoạt!");
            }
        });
    });
}
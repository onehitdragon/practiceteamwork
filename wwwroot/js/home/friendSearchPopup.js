import {ajax} from '../init.js';
import Socket from './socket.js';
import FriendControl from './friendControl.js';
class FriendSearchPopup{
    static #instance;
    constructor(listQuesting, addFriendToContainer){
        if(FriendSearchPopup.#instance){
            return FriendSearchPopup.#instance;
        }
        FriendSearchPopup.#instance = this;
        this.socket = Socket.getInstance();
        this.socket.on('requestingFriend', (user) => {
            this.#addRequestingItemElement(user);
        });
        this.listRequestingElement = this.#createListQuestingElement(listQuesting);
        this.addFriendToContainer = addFriendToContainer;
    }
    createFriendSearchPopup(close){
        const friendSearchElement = document.createElement('div');
        friendSearchElement.id = 'friend-search-area';
        friendSearchElement.innerHTML = `
            <div class='friend-search-main'>
                <div class='title'>
                    <span>Thêm bạn</span>
                    <button name='close-friend-search'>
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class='input-area'>
                    <div class='input-area__search'>
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <div class='input'>
                            <input placeholder='Nhập tên, số điện thoại...'/>
                        </div>
                        <p class='line'></p>
                        <div class='list-search'>
                        </div>
                        <i></i>
                    </div>
                </div>
                <div class='list-requesting-area'>
                    <div class='title'>
                        <span>Lời mời kết bạn</span>
                        <i class="fa-solid fa-angle-right"></i>
                    </div>
                    <div class='list-requesting'>
                    </div>
                </div>
            </div>
        `;
        const listSearchElement = friendSearchElement.querySelector('.list-search');
        const listRequestingElement = friendSearchElement.querySelector('.list-requesting');

        friendSearchElement.querySelector('.input-area > .input-area__search > .input > input').addEventListener('input', (e) => {
            const key = e.target.value;
            if(key == "") {
                listSearchElement.innerHTML = '';
                return;
            }
            ajax.sendGET(`/Friend/SearchFriend?key=${key}`, (res) => {
                const listUser = JSON.parse(res.responseText);
                listSearchElement.innerHTML = '';
                if(!listUser.length) return;
                listSearchElement.appendChild(
                    this.#createListResultFriendSearchElement(listUser)
                );
            })
        });
        window.addEventListener('click', (e) => {
            const inputElement = friendSearchElement.querySelector('.input-area > .input-area__search > .input > input');
            if(!inputElement.contains(e.target) && !listSearchElement.contains(e.target)){
                listSearchElement.innerHTML = '';
            }
        });

        listRequestingElement.appendChild(this.listRequestingElement);

        friendSearchElement.querySelector("button[name='close-friend-search']").addEventListener('click', () => {
            close();
        });

        return friendSearchElement;
    }
    #createListResultFriendSearchElement(listUser){
        const containerElement = document.createElement('div');
        containerElement.className = 'body-left__conversations';
        listUser.forEach((user) => {
            containerElement.appendChild(this.#createItemFriendSearchElement(user));
        });
        return containerElement;
    }
    #createItemFriendSearchElement(user){
        const friendElement = document.createElement('div');
        friendElement.className = 'conversation-item';
        const avatarFriendElement = document.createElement('div');
        avatarFriendElement.className = 'avatar-area';
        const infoAreaElement = document.createElement('div');
        infoAreaElement.className = 'info-area';
        avatarFriendElement.innerHTML = `
            <img class="avatar" src="${user.avatarUrl}">
        `;
        infoAreaElement.innerHTML = `
            <p class="name">${user.lastName + ' ' + user.firstName}</p>
            <div class="friend">
                <span>Kết bạn</span>
            </div>
        `;
        friendElement.appendChild(avatarFriendElement);
        friendElement.appendChild(infoAreaElement);

        infoAreaElement.querySelector('.friend').addEventListener('click', (e) => {
            this.socket.invoke('RequestingFriend', user);
            friendElement.remove();
            alert("Gửi lời mời thành công");
            const listSearchElement = document.querySelector('.friend-search-main .list-search .body-left__conversations');
            if(listSearchElement.childNodes.length == 0) listSearchElement.parentElement.innerHTML = '';
            e.stopPropagation();
        });

        return friendElement;
    }
    #createListQuestingElement(listUser){
        const containerElement = document.createElement('div');
        containerElement.className = 'body-left__conversations';
        listUser.forEach((user) => {
            containerElement.appendChild(this.#createItemQuestingElement(user));
        });

        return containerElement;
    }
    #createItemQuestingElement(user){
        const friendElement = document.createElement('div');
        friendElement.className = 'conversation-item';
        const avatarFriendElement = document.createElement('div');
        avatarFriendElement.className = 'avatar-area';
        const infoAreaElement = document.createElement('div');
        infoAreaElement.className = 'info-area';
        let lastName = user.LastName ? user.LastName : user.lastName;
        let firstName = user.FirstName ? user.FirstName : user.firstName;
        if(!lastName) lastName = "";
        if(!firstName) firstName = "";
        avatarFriendElement.innerHTML = `
            <img class="avatar" src="${user.AvatarUrl ? user.AvatarUrl : user.avatarUrl}">
        `;
        infoAreaElement.innerHTML = `
            <p class="name">${lastName + ' ' + firstName}</p>
            <div class="friends">
                <div class="friend">
                    <span>Đồng ý</span>
                </div>
                <div class="friend">
                    <span>Từ chối</span>
                </div>
            </div>
        `;
        const btnAgree = infoAreaElement.querySelector('.friends > .friend:first-child');
        const btnCancer = infoAreaElement.querySelector('.friends > .friend:last-child');

        btnAgree.addEventListener('click', () => {
            this.socket.invoke('AcceptRequesting', user);
            friendElement.remove();
            new FriendControl().addFriendToContainer(user);
        });
        btnCancer.addEventListener('click', () => {
            this.socket.invoke('CancerRequesting', user);
            friendElement.remove();
        });

        friendElement.appendChild(avatarFriendElement);
        friendElement.appendChild(infoAreaElement);

        return friendElement;
    }
    #addRequestingItemElement(user){
        this.listRequestingElement.insertAdjacentElement(
            'afterbegin',
            this.#createItemQuestingElement(user)
        );
    }
}
export default FriendSearchPopup;
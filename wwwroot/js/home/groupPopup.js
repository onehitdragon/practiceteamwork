import ConversationControl from "./conversationControl.js";
import Socket from "./socket.js";
class GroupPopup{
    constructor(listFriend){
        this.listFriend = listFriend;
        this.listFriendAdded = [];
        this.listFriendAddedElement = [];
        this.socket = Socket.getInstance();
    }
    createGroupPopupElement(close){
        const groupPopupElement = document.createElement('div');
        groupPopupElement.id = 'friend-search-area';
        groupPopupElement.innerHTML = `
            <div class='friend-search-main'>
                <div class='title'>
                    <span>Tạo nhóm</span>
                    <button name='close-friend-search'>
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class='input-area'>
                    <div class='input-area__search' style='margin-bottom: 10px;'>
                        <i></i>
                        <div class='input'>
                            <input name='name-group' placeholder='Nhập tên nhóm...'/>
                        </div>
                        <div class='list-search'>
                        </div>
                        <i></i>
                    </div>
                    <div class='input-area__search'>
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <div class='input'>
                            <input name='search-friend' placeholder='Thêm bạn vào nhóm...'/>
                        </div>
                        <p class='line'></p>
                        <div class='list-search'>
                        </div>
                        <i></i>
                    </div>
                </div>
                <div class='list-requesting-area'>
                    <div class='title'>
                        <span>Bạn bè</span>
                        <i class="fa-solid fa-angle-right"></i>
                    </div>
                    <div class='list-requesting'>
                    </div>
                </div>
            </div>
        `;
        this.friendSearchMainElement = groupPopupElement.querySelector('.friend-search-main');
        const listFriendElement = groupPopupElement.querySelector('.list-requesting');

        const areaButtonElement = document.createElement('div');
        this.areaButtonElement = areaButtonElement;
        areaButtonElement.className = 'area-button';
        areaButtonElement.innerHTML = `
            <div class='list-added'>
            </div>
            <button name='create-group-button'>Tạo nhóm</button>
        `;
        const buttonCreateGroupElement = areaButtonElement.querySelector('button');
        buttonCreateGroupElement.style = 'opacity: 0;';
        listFriendElement.appendChild(this.#createListFriendElement());
        this.inputNameGroupElement = groupPopupElement.querySelector(".input-area input[name='name-group']");
        this.inputNameGroupElement.addEventListener('input', (e) => {
            if(e.target.value == '') buttonCreateGroupElement.style = 'opacity: 0;';
            else buttonCreateGroupElement.style = 'opacity: 1;';
        });
        const inputFriendSearchElement = groupPopupElement.querySelector(".input-area input[name='search-friend']");
        inputFriendSearchElement.addEventListener('input', (e) => {
            let key = e.target.value;
            listFriendElement.querySelectorAll('.body-left__conversations > .conversation-item').forEach((e) => {
                let name = e.querySelector('.info-area > .name').textContent;
                key = key.toLowerCase();
                name = name.toLowerCase();
                if(!name.includes(key)) e.style = 'display: none;';
                else e.style = 'display: flex;';
            });
        });
        buttonCreateGroupElement.addEventListener('click', () => {
            if(this.listFriendAdded.length == 1){
                new ConversationControl().openConversationElement(this.listFriendAdded[0]);
            }
            else if(this.listFriendAdded.length > 1){
                this.socket.invoke('CreateGroupConversation', this.inputNameGroupElement.value, this.listFriendAdded);
            }
            close();
        })
        groupPopupElement.querySelector("button[name='close-friend-search']").addEventListener('click', () => {
            close();
        });

        return groupPopupElement;
    }
    #createListFriendElement(){
        const containerElement = document.createElement('div');
        containerElement.className = 'body-left__conversations';
        this.listFriend.forEach((friend) => {
            containerElement.appendChild(this.#createListFriendItemElement(friend));
        });
        return containerElement;
    }
    #createListFriendItemElement(friend){
        const friendElement = document.createElement('div');
        friendElement.className = 'conversation-item';
        const avatarFriendElement = document.createElement('div');
        avatarFriendElement.className = 'avatar-area';
        const infoAreaElement = document.createElement('div');
        infoAreaElement.className = 'info-area';
        const checkBoxWrapElement = document.createElement('div');
        checkBoxWrapElement.className = 'checkbox';
        let lastName = friend.LastName ? friend.LastName : friend.lastName;
        let firstName = friend.FirstName ? friend.FirstName : friend.firstName;
        if(!lastName) lastName = "";
        if(!firstName) firstName = "";
        avatarFriendElement.innerHTML = `
            <img class="avatar" src="${friend.AvatarUrl ? friend.AvatarUrl : friend.avatarUrl}">
        `;
        infoAreaElement.innerHTML = `
            <p class="name">${lastName + ' ' + firstName}</p>
        `;
        friendElement.addEventListener('click', () => {
            checkBoxWrapElement.classList.toggle('checked');
            if(checkBoxWrapElement.classList.contains('checked')){
                this.#addItemListFriendAdded(friend);
            }
            else{
                this.#removeItemListFriendAdded(friend);
            }
            
        })
        friendElement.appendChild(checkBoxWrapElement);
        friendElement.appendChild(avatarFriendElement);
        friendElement.appendChild(infoAreaElement);

        return friendElement;
    }
    #addItemListFriendAdded(friend){
        this.listFriendAdded.push(friend);
        const listAddedItemElement = this.#createListAddedItemElement(friend);
        this.listFriendAddedElement.push(listAddedItemElement);
        this.areaButtonElement.querySelector('.list-added').appendChild(listAddedItemElement);
        if(this.listFriendAdded.length == 1){
            this.#showAreaButton();
        }
    }
    #removeItemListFriendAdded(friend){
        for(let i = 0; i < this.listFriendAdded.length; i++){
            if(this.listFriendAdded[i].Id == friend.Id){
                this.listFriendAdded.splice(i, 1);
                this.areaButtonElement.querySelector('.list-added').removeChild(this.listFriendAddedElement[i]);
                this.listFriendAddedElement.splice(i, 1);
                break;
            }
        }
        if(this.listFriendAdded.length == 0){
            this.#hideAreaButton();
        }
    }
    #showAreaButton(){
        this.friendSearchMainElement.appendChild(this.areaButtonElement);
    }
    #hideAreaButton(){
        this.friendSearchMainElement.removeChild(this.areaButtonElement);
    }
    #createListAddedItemElement(friend){
        const itemElement = document.createElement('div');
        itemElement.className = 'list-added__item';
        let lastName = friend.LastName ? friend.LastName : friend.lastName;
        let firstName = friend.FirstName ? friend.FirstName : friend.firstName;
        if(!lastName) lastName = "";
        if(!firstName) firstName = "";
        itemElement.innerHTML = `
            <img src='${friend.AvatarUrl}'/>
            <span>${lastName + ' ' + firstName}</span>
        `;

        return itemElement;
    }
}
export default GroupPopup;
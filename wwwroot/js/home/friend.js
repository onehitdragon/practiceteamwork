import MenuLeft from "./menuLeft.js";
import ConversationControl from "./conversationControl.js";
import VideoCallControl from "./videoCallControl.js";
class Friend{
    constructor(friend){
        this.friend = friend;
        this.avatarUrl = this.friend.AvatarUrl ? this.friend.AvatarUrl : this.friend.avatarUrl;
        this.lastName = this.friend.LastName ? this.friend.LastName : this.friend.lastName;
        this.firstName = this.friend.FirstName ? this.friend.FirstName : this.friend.firstName;
        if(!this.lastName) this.lastName = "";
        if(!this.firstName) this.firstName = "";
    }
    createFriendElement(){
        const friendElement = document.createElement('div');
        friendElement.className = 'conversation-item';
        const avatarFriendElement = document.createElement('div');
        avatarFriendElement.className = 'avatar-area';
        const infoAreaElement = document.createElement('div');
        infoAreaElement.className = 'info-area';
        avatarFriendElement.innerHTML = `
            <img class="avatar" src="${this.avatarUrl}">
            <i class="fa-solid fa-circle icon-status--green"></i>
        `;
        infoAreaElement.innerHTML = `
            <p class="name">${this.lastName + ' ' + this.firstName}</p>
            <div class="friends">
                <div class="friend">
                    <span>Nhắn tin</span>
                </div>
                <div class="friend call">
                    <span>Gọi</span>
                </div>
            </div>
        `;
        const btnMessageElement = infoAreaElement.querySelector('.friend');
        const btnCallElement = infoAreaElement.querySelector('.call');

        btnMessageElement.addEventListener('click', () => {
            MenuLeft.btnFriendElement.click();
            new ConversationControl().openConversationElement(this.friend);
        });
        btnCallElement.addEventListener('click', () => {
            new VideoCallControl().call(this.friend);
        });

        friendElement.appendChild(avatarFriendElement);
        friendElement.appendChild(infoAreaElement);

        return friendElement;
    }
}
export default Friend;
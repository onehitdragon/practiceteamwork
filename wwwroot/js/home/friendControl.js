import Friend from "./friend.js";
import {mainElement} from "../init.js"; 
import FriendSearchPopup from "./friendSearchPopup.js";
import Socket from "./socket.js";
class FriendControl{
    static #instance;
    constructor(listFriend, listQuesting){
        if(FriendControl.#instance){
            return FriendControl.#instance;
        }
        FriendControl.#instance = this;
        this.listFriend = listFriend;
        this.containerFriendElement = document.createElement('div');
        this.containerFriendElement.className = 'body-left__conversations';
        this.listFriend.forEach((friend) => {
            this.addFriendToContainer(friend);
        });
        this.socket = Socket.getInstance();
        this.socket.on('acceptRequesting', (user) => {
            this.addFriendToContainer(user);
        });
        this.listQuesting = listQuesting;
        this.friendSearchPopup = new FriendSearchPopup(this.listQuesting);
    }
    addFriendToContainer(_friend){
        const friend = new Friend(_friend);
        this.containerFriendElement.appendChild(friend.createFriendElement());
    }
    showListFriend(){
        document.querySelector('.body-left').replaceChild(
            this.containerFriendElement,
            document.querySelector('.body-left__conversations')
        );
    }
    showFriendSearchPopup(){
        const friendSearchPopupElement = this.friendSearchPopup.createFriendSearchPopup(() => {
            mainElement.removeChild(friendSearchPopupElement);
        });
        mainElement.appendChild(friendSearchPopupElement);
    }
    
}
export default FriendControl;
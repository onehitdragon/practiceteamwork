import {mainElement} from "../init.js";
import GroupPopup from "./groupPopup.js";
class GroupControl{
    static #instance;
    constructor(listFriend){
        if(GroupControl.#instance){
            return GroupControl.#instance;
        }
        GroupControl.#instance = this;
        this.listFriend = listFriend;
    }
    showGroupPopup(){
        this.groupPopup = new GroupPopup(this.listFriend);
        const groupPopupElement = this.groupPopup.createGroupPopupElement(() => {
            mainElement.removeChild(groupPopupElement);
        });
        mainElement.appendChild(groupPopupElement);
    }
}
export default GroupControl;
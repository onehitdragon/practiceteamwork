import Conversation from "./conversation.js";
import MenuLeft from "./menuLeft.js";
import Socket from "./socket.js";
import EffectMessage from "./effectMessage.js";
import {mainElement, ajax, messagePopup} from "../init.js";
import animation from "./animation.js";
import MyTool from "./myTool.js";

class ConversationControl{
    static #instance;
    constructor(user, listConversation){
        if(ConversationControl.#instance){ 
            return ConversationControl.#instance;
        }
        ConversationControl.#instance = this;
        this.user = user;
        this.listConversation = listConversation;
        this.listConversationElement = [];
        this.conversationContainerElement = document.querySelector('.body-left__conversations');
        this.listMessageLoadingElement = [];
        this.socket = Socket.getInstance();
        this.effectMessage = new EffectMessage();
        this.menuLeft = new MenuLeft();
    }
    initConversation(){       
        this.listConversation.forEach((infoConversation, index) => {
            let conversation = new Conversation(this.user, infoConversation);
            // init conversation-item
            const conversationElement = conversation.CreateConversationElement();           
            this.listConversationElement.push(conversationElement);
            this.conversationContainerElement.appendChild(conversationElement);
            //
            conversationElement.addEventListener('click', () => {
                if(this.listConversation[index] != this.activeConversation){
                    this.activeConversation = this.listConversation[index];
                    conversation = new Conversation(this.user, this.listConversation[index]);
                    this.activeConversationElement = conversation.CreateActiveConversationElement();
                    const activeConversationContainerElement = document.querySelector('.body > .body__main');   
                    activeConversationContainerElement.replaceChild(
                        this.activeConversationElement,
                        activeConversationContainerElement.querySelector('.body-right')
                    );
                    conversation.ScrollToLastMessage(this.activeConversationElement);
                    conversation.FocusInputChat(this.activeConversationElement);  
                }
                const updateAmountMessageNotReaded = () => {
                    this.#ReadConversation();
                    Conversation.UpdateAmountMessageNotReaded(this.listConversationElement[index], 0);
                };
                this.#AddEventToInputChatElement(updateAmountMessageNotReaded);
                this.#AddEventToButtonChooseFileElement();
                updateAmountMessageNotReaded();
            });
        });
        animation();
    }
    reInitConversation(){
        document.querySelector('.body-left').replaceChild(
            this.conversationContainerElement,
            document.querySelector('.body-left__conversations')
        );
    }
    #AddEventToInputChatElement(UpdateAmountMessageNotReaded){
        const inputChatElement = document.querySelector(".body-right__send > input[type='text']");
        inputChatElement.addEventListener('keydown', (e) => {
            if(e.key == 'Enter' && inputChatElement.value != ''){
                let contentMessage = inputChatElement.value;
                inputChatElement.value = "";
                let message = {
                    Sender : this.user,
                    TypeMessage : 0,
                    Content : contentMessage,
                    CreateAt : MyTool.GetCurrentTime()
                };
                this.SendMessage(message);
                this.#StopTyping();
            }
            else{
                this.#Typing();
                UpdateAmountMessageNotReaded();
            }
        });
        inputChatElement.addEventListener("focus", () => {
            this.#Typing();
            UpdateAmountMessageNotReaded();
        });
        inputChatElement.addEventListener("blur", () => {
            this.#StopTyping();
        });
        window.addEventListener("beforeunload", () => {
            this.#StopTyping();
        });
    }
    SendMessage(message){
        this.activeConversation.Messages.push(message);   
        this.#updateListConversation(this.activeConversation, {
            newMessage : false
        });
        this.listMessageLoadingElement.push(
            {
                messageElementId : this.listMessageLoadingElement.length + 1,
                message : message,
                messageElement : new Conversation(this.user, this.activeConversation).GetLastContentMessageElement()
            }
        );
        this.socket.invoke(
            'SendMessage',
            JSON.stringify(this.activeConversation),
            this.listMessageLoadingElement.length
        );
    }
    #AddEventToButtonChooseFileElement(){
        const buttonChooseFileElement = document.querySelector(".body-right__send > button[name='add-file']");
        const inputElement = buttonChooseFileElement.querySelector('input');
        buttonChooseFileElement.addEventListener('click', () => {       
            inputElement.click();
        });
        inputElement.addEventListener('input', () => {
            const file = inputElement.files[0];
            const formData = new FormData();
            formData.append('file', file);       
            this.SendFile(formData);
        });
    }
    SendFile(formData){
        const messageLoadingPopupElement = messagePopup.createMessageLoadingElement(
            'Đang tải...'
        );
        mainElement.appendChild(messageLoadingPopupElement);
        ajax.sendPOSTFile('/Home/SendFile', formData, (res) => {
            mainElement.removeChild(messageLoadingPopupElement);
            const fileAttachUrl = JSON.parse(res.responseText).fileAttachUrl;
            console.log(JSON.parse(res.responseText));
            let message = {
                Sender : this.user,
                TypeMessage : 1,
                Content : formData.get('file').name,
                FileAttachUrl : fileAttachUrl,
                CreateAt : MyTool.GetCurrentTime()
            }
            this.SendMessage(message);
        });
    }
    #Typing(){
        this.socket.invoke(
            "Typing",
            JSON.stringify(this.activeConversation),
            true
        );
    }
    #StopTyping(){
        this.socket.invoke(
            "Typing",
            JSON.stringify(this.activeConversation),
            false
        );
    }
    initSocket(){
        this.#initSocket();
        this.socket.on('haveNewMessage', (json) => {
            let conversation = JSON.parse(json);
            this.#updateListConversation(conversation, {
                newMessage : true
            });
            this.#UpdateAmountMessageNotReaded(conversation);
            this.effectMessage.Ting();
        });
        this.socket.on('serverReceivedMessage', (json) => {
            let messageElementId = JSON.parse(json);
            for(let i = 0; i < this.listMessageLoadingElement.length; i++){
                if(this.listMessageLoadingElement[i].messageElementId == messageElementId){
                    this.listMessageLoadingElement[i].message.loading = false;
                    Conversation.ReplaceStatusLoadingToMessageElement(
                        this.listMessageLoadingElement[i].messageElement
                    );
                }
            }
        });
        this.socket.on("typing", (json) => {
            let data = JSON.parse(json);
            this.#updateTypingConversation(data, true);
        })
        this.socket.on("stopTyping", (json) => {
            let data = JSON.parse(json);
            this.#updateTypingConversation(data, false);
        })
        this.socket.on("getAmountMessageNotReaded", (data) => {  
            let conversation = JSON.parse(data.conversation);
            let amount = data.amount;
            for(let i = 0; i < this.listConversation.length; i++){
                if(this.listConversation[i].Id == conversation.Id){
                    let conversationElement = this.listConversationElement[i];
                    Conversation.UpdateAmountMessageNotReaded(conversationElement, amount);
                    break;
                }
            }
        })
        this.socket.on('createGroupConversation', (creator) => {
            if(creator.id == this.user.Id) this.reloadConversationElement(true);
            else this.reloadConversationElement(false)
        });
        this.listConversation.forEach((infoConversation) => {
            this.#UpdateAmountMessageNotReaded(infoConversation);
        });
    }
    #initSocket(){
        this.socket.invoke(
            'Init', 
            JSON.stringify(
            {
                user : this.user,
                listConversation : this.listConversation
            })
        );
    }
    #ReadConversation(){
        this.socket.invoke(
            "ReadConversation",
            JSON.stringify(this.activeConversation)
        );
    }
    #UpdateAmountMessageNotReaded(infoConversation){
        this.socket.invoke(
            "GetAmountMessageNotReaded",
            JSON.stringify(infoConversation)
        );
    }
    #updateListConversation(_conversation, options){
        const conversation = new Conversation(this.user, _conversation);
        for(let i = 0; i < this.listConversation.length; i++){
            if(this.listConversation[i].Id == _conversation.Id){
                this.listConversation[i] = _conversation;                
                this.listConversationElement[i] = conversation.AddUpdateLastMessageConversation(this.listConversationElement[i], options);
                break;
            }
        }
        if(this.activeConversation){
            if(this.activeConversation.Id == _conversation.Id){
                this.activeConversation = _conversation;
                conversation.AddUpdateMessageActiveConversationElement(this.activeConversationElement, options);
            }
        }
    }
    #updateTypingConversation(data, isTyping){
        let conversationTyping = data.conversationTyping;
        let senderTyping = data.senderTyping;
        for(let i = 0; i < this.listConversation.length; i++){
            if(this.listConversation[i].Id == conversationTyping.Id){   
                this.listConversation[i].Participants.forEach((participant, idx) => {
                    if(participant.Id == senderTyping.Id && participant.typing != isTyping){
                        this.listConversation[i].Participants[idx].typing = isTyping;
                        if(conversationTyping.Id == this.activeConversation.Id){
                            const conversation = new Conversation(this.user, this.listConversation[i]);
                            conversation.ReloadTypingConversation(this.activeConversationElement.querySelector('.body-right__messages'));
                            conversation.ScrollToLastMessage(this.activeConversationElement);
                        }
                    }
                })
                break;
            }
        }
    }
    openConversationElement(friend){
        friend.Id = friend.Id ? friend.Id : friend.id;
        let check = true;
        this.listConversation.forEach((conversation, idx) => {
            if(conversation.Participants.length == 2){
                conversation.Participants.forEach((participant) => {
                    if(participant.Id == friend.Id) {
                        this.listConversationElement[idx].click();
                        check = false;
                    }
                });
            }
        });
        if(check){
            this.reloadConversationElement(true);
        }
    }
    reloadConversationElement(hasClick = false){
        ajax.sendGET('/Home/GetListConversation', (res) => {
            const listConversation = JSON.parse(res.responseText);
            this.listConversation = listConversation;
            this.listConversationElement = [];
            this.conversationContainerElement.innerHTML = '';
            this.initConversation();
            this.#initSocket();
            if(hasClick){
                this.listConversationElement[this.listConversationElement.length - 1].click();
            }
        })
    }
}
export default ConversationControl;
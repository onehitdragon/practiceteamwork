import ImagePopup from "./imagePopup.js";
import AudioElement from "./audioElement.js";
import VideoElement from "./videoElement.js";
import IconAreaElement from "./iconAreaElement.js";

class Conversation{
    constructor(user, infoConversation){
        this.user = user;
        this.participants = infoConversation.Participants;
        this.amountParticipant = infoConversation.Participants.length;
        infoConversation.Participants.forEach((participant) => {
            if(participant.Id != this.user.Id){
                this.participant = participant;
            }
        });
        this.avatarUrl = this.participant.AvatarUrl;
        this.fullname = this.participant.LastName + " " + this.participant.FirstName;
        this.lastMessage = infoConversation.Messages[infoConversation.Messages.length - 1];
        this.messages = infoConversation.Messages;
        this.myAvatarUrl = document.querySelector('.body-left__head > .avatar').src;
        this.titleConversation = infoConversation.Title;
    }
    CreateConversationElement(newMessage){
        const conversationElement = document.createElement('div');
        conversationElement.className = 'conversation-item';
        const avatarAreaElement = document.createElement('div');
        avatarAreaElement.className = 'avatar-area';
        const infoAreaElement = document.createElement('div');
        infoAreaElement.className = 'info-area';
        const statusAreaElement = document.createElement('div');
        statusAreaElement.className = 'status-area';

        if(this.amountParticipant == 2){
            avatarAreaElement.innerHTML = `
                <img class="avatar" src="${this.avatarUrl}">
                <i class="fa-solid fa-circle icon-status--green"></i>
            `;
            infoAreaElement.innerHTML = `
                <p class="name">${this.fullname}</p>
                <p class="last-mes"></p>
            `;
            statusAreaElement.innerHTML = `
                <p class="time">
                    <i class="fa-solid fa-check"></i>
                    <span></span>
                </p>
            `;
        }
        else{
            avatarAreaElement.classList.add('group--avatar');
            for(let i = 0; i < this.participants.length; i++){
                let user = this.participants[i];
                avatarAreaElement.innerHTML += `
                    <img class="avatar" src="${user.AvatarUrl}">
                `;
                if(i == 2){
                    if(this.participants.length <= 4) continue;
                    else{
                        avatarAreaElement.innerHTML += `
                            <p class='amount'>${this.participants.length}</p>
                        `;
                    }
                    break;
                }
            }
            infoAreaElement.innerHTML = `
                <p class="name">${this.titleConversation}</p>
                <p class="last-mes"></p>
            `;
        }

        conversationElement.appendChild(avatarAreaElement);
        conversationElement.appendChild(infoAreaElement);
        conversationElement.appendChild(statusAreaElement);
        this.AddUpdateLastMessageConversation(conversationElement, newMessage);

        return conversationElement;
    }
    AddUpdateLastMessageConversation(conversationElement, options = {}){       
        const lastMesElement = conversationElement.querySelector('.info-area > .last-mes');
        if(!this.lastMessage){
            lastMesElement.innerText = "Chưa có tin nhắn";
            return conversationElement;
        }
        else if(this.lastMessage.Sender.Id != this.user.Id){
            lastMesElement.innerText = this.fullname + ': ' + this.lastMessage.Content;
        }
        else{
            lastMesElement.innerText = 'Bạn: ' + this.lastMessage.Content;
        }
        const timeElement = conversationElement.querySelector('.status-area > .time > span');
        this.#updateTimeMessageElement(timeElement, this.lastMessage);

        return conversationElement;
    }
    #updateTimeMessageElement(timeElement, message){       
        const date = new Date(message.CreateAt);
        let time = date.getHours() + ':' + date.getMinutes();
        if(date.getHours() <= 12) time += ' AM';
        else time += ' PM';
        timeElement.textContent = time;
    }
    CreateActiveConversationElement(){
        const activeConversationElement = document.createElement('div');
        activeConversationElement.className = 'body-right';
        const bodyRightBeforeElement = document.createElement('div');
        bodyRightBeforeElement.className = 'body-right__before';
        const headConversationElement = document.createElement('div');
        headConversationElement.className = 'body-right__head';
        const messageContainerElement = document.createElement('div');
        messageContainerElement.className = 'body-right__messages';
        const buttonConversationElement = document.createElement('div');
        buttonConversationElement.className = 'body-right__send';

        headConversationElement.innerHTML = `
            <img class="avatar" src="${this.avatarUrl}">
            <div class="info-area">
                <p class="name">${this.participants.length == 2 ? this.fullname : this.titleConversation}</p>
                <p class="status">Đang gõ...</p>
            </div>
            <div class="button-area">
                <button type="button" name="profile">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </button>
                <button type="button" name="menu">
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                </button>
            </div>
        `;

        let previousSender;
        this.messages.forEach((message, index) => {
            if(index == 0){
                this.CreateMessageNewRow(messageContainerElement, message);
            }
            else{
                this.CreateMessageMain(messageContainerElement, message, previousSender, message.Sender);
            }
            previousSender = message.Sender;

            if(message.loading){
                this.AddStatusLoadingToLastMessageElement(messageContainerElement);
            }
            else if(message.loading == false){
                this.AddStatusSuccessToLastMessageElement(messageContainerElement);
            }
        });

        this.ReloadTypingConversation(messageContainerElement);

        buttonConversationElement.innerHTML = `
            <button type="button" name="add-file">
                <input type='file' style='display: none;'>
                <i class="fa-solid fa-circle-plus"></i>
            </button>
            <input type="text" placeholder="Nhập tin nhắn...">
            <button type="button" name="icon">
                <i class="fa-solid fa-face-smile"></i>
            </button>
        `;
        let iconAreaElement = new IconAreaElement();
        iconAreaElement.createIconAreaElement();
        iconAreaElement.setEventToButtonIconElement(buttonConversationElement);

        activeConversationElement.appendChild(bodyRightBeforeElement);
        activeConversationElement.appendChild(headConversationElement);
        activeConversationElement.appendChild(messageContainerElement);
        activeConversationElement.appendChild(buttonConversationElement);

        return activeConversationElement;
    }
    CreateMessageMain(messageContainerElement, message, previousSender, currentSender){
        if(!previousSender || previousSender.Id != currentSender.Id){
            if(message.TypeMessage == 0){
                this.CreateMessageNewRow(messageContainerElement, message);
            }
            if(message.TypeMessage == 1){
                this.CreateFileMessageNewRow(messageContainerElement, message);
            }
        }
        else{
            if(message.TypeMessage == 0){
                this.CreateMessageExistRow(messageContainerElement, message);
            }
            if(message.TypeMessage == 1){
                this.CreateFileMessageExistRow(messageContainerElement, message);
            }
        }
    }
    CreateMessageNewRow(messageContainerElement, message){
        const lastMessageElement = this.#GetLastMessageElement(messageContainerElement);
        if(message.Sender.Id != this.user.Id){
            lastMessageElement.insertAdjacentElement("afterend", this.#CreateMessage(message));
        }
        else{
            lastMessageElement.insertAdjacentElement("afterend", this.#CreateMyMessage(message));
        }
    }
    CreateMessageExistRow(messageContainerElement, message){
        const lastMessageElement = this.#GetLastMessageElement(messageContainerElement);
        this.#AddMessageToPreviousMessageElement(message, lastMessageElement);
    }
    #GetLastMessageElement(messageContainerElement){
        let lastMessageElement = messageContainerElement.querySelectorAll('.message:not(.message-loading)');
        lastMessageElement = lastMessageElement[lastMessageElement.length - 1];
        if(!lastMessageElement){
            const divElement = document.createElement('div');
            messageContainerElement.appendChild(divElement);
            return divElement;
        } 
        return lastMessageElement;
    }
    #CreateMessage(message){ 
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerHTML = `
            <img class="avatar" src="${message.Sender.AvatarUrl}">
            <div class="content">
                <div class='content__mes'>
                    <p>${message.Content}</p>
                </div>
                <div class="name-time">
                    <span class="name">${this.#GetFullNameMessage(message)}</span>
                    <i class="fa-solid fa-circle"></i>
                    <span class="time">9:30 PM</span>
                </div>
            </div>
        `;
        const timeElement = messageElement.querySelector('.name-time > .time');
        this.#updateTimeMessageElement(timeElement, message);
        return messageElement;
    }
    #GetFullNameMessage(message){
        let fullName = "Bạn";
        if(message.Sender.Id != this.user.Id){
            fullName = message.Sender.LastName + ' ' + message.Sender.FirstName;
        }
        return fullName;
    }
    #CreateMyMessage(message){
        const messageElement = this.#CreateMessage(message);
        messageElement.classList.add('message--mymessage');
        return messageElement;
    }
    #AddMessageToPreviousMessageElement(message, previousMessageElement){
        previousMessageElement.querySelector('.content > .name-time').insertAdjacentHTML('beforebegin',`
            <div class='content__mes'>
                <p>${message.Content}</p>
            </div>
        `);
        const timeElement = previousMessageElement.querySelector('.name-time > .time');
        this.#updateTimeMessageElement(timeElement, message);
    }
    CreateFileMessageNewRow(messageContainerElement, message){
        const lastMessageElement = this.#GetLastMessageElement(messageContainerElement);
        if(message.Sender.Id != this.user.Id){
            lastMessageElement.insertAdjacentElement("afterend", this.CreateFileMessage(message));
        }
        else{
            lastMessageElement.insertAdjacentElement("afterend", this.CreateMyFileMessage(message));
        }
    }
    CreateFileMessageExistRow(messageContainerElement, message){
        const lastMessageElement = this.#GetLastMessageElement(messageContainerElement);
        this.AddFileMessageToPreviousFileMessageElement(message, lastMessageElement);
    }
    #GetFileType(message){
        const imageExts = ['png','jpg','jpeg','gif'];
        const audioExts = ['mp3'];
        const videoExts = ['mp4'];
        let ext = message.Content.split('.');
        ext = ext[ext.length - 1].toLowerCase();
        if(imageExts.includes(ext)){
            if(message.Content.includes(':')) return 'icon';
            return 'image';
        }
        if(audioExts.includes(ext)){
            return 'audio';
        }
        if(videoExts.includes(ext)){
            return 'video';
        }
        return null;
    }
    CreateFileMessage(message){
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        if(this.#GetFileType(message) == 'image'){
            messageElement.innerHTML = `
                <img class="avatar" src="${message.Sender.AvatarUrl}">
                <div class="content">
                    <div class='content__mes'>
                        <img src='${message.FileAttachUrl}'>
                    </div>
                    <div class="name-time">
                        <span class="name">User demo</span>
                        <i class="fa-solid fa-circle"></i>
                        <span class="time">9:30 PM</span>
                    </div>
                </div>
            `;
            this.AddEventToImageMessage(messageElement);
        }
        else if(this.#GetFileType(message) == 'icon'){
            messageElement.innerHTML = `
                <img class="avatar" src="${message.Sender.AvatarUrl}">
                <div class="content">
                    <div class='content__mes'>
                        <img style='width: 40px;' src='${message.FileAttachUrl}'>
                    </div>
                    <div class="name-time">
                        <span class="name">User demo</span>
                        <i class="fa-solid fa-circle"></i>
                        <span class="time">9:30 PM</span>
                    </div>
                </div>
            `;
        }
        else if(this.#GetFileType(message) == 'audio'){
            messageElement.innerHTML = `
                <img class="avatar" src="${message.Sender.AvatarUrl}">
                <div class="content">
                    <div class='content__mes'>
                        
                    </div>
                    <div class="name-time">
                        <span class="name">User demo</span>
                        <i class="fa-solid fa-circle"></i>
                        <span class="time">9:30 PM</span>
                    </div>
                </div>
            `;
            const audioElement = new AudioElement(message.FileAttachUrl).CreateAudioElement();
            messageElement.querySelector('.content > .content__mes').appendChild(audioElement);
        }
        else if(this.#GetFileType(message) == 'video'){
            messageElement.innerHTML = `
                <img class="avatar" src="${message.Sender.AvatarUrl}">
                <div class="content">
                    <div class='content__mes'>
                        
                    </div>
                    <div class="name-time">
                        <span class="name">User demo</span>
                        <i class="fa-solid fa-circle"></i>
                        <span class="time">9:30 PM</span>
                    </div>
                </div>
            `;
            const contentMessage = messageElement.querySelector('.content > .content__mes');
            const videoElement = new VideoElement(message.FileAttachUrl).CreateVideoElement(contentMessage);
            contentMessage.appendChild(videoElement);
        }
        else{
            messageElement.innerHTML = `
                <img class="avatar" src="${message.Sender.AvatarUrl}">
                <div class="content">
                    <div class='content__mes'>
                        <div class='other-file-main'>
                            <a href='${message.FileAttachUrl}' download='${message.Content}'>
                                ${message.Content}
                            </a>
                        </div>
                    </div>
                    <div class="name-time">
                        <span class="name">User demo</span>
                        <i class="fa-solid fa-circle"></i>
                        <span class="time">9:30 PM</span>
                    </div>
                </div>
            `;
        }
        messageElement.querySelector('.name-time > .name').textContent = this.#GetFullNameMessage(message);
        const timeElement = messageElement.querySelector('.name-time > .time');
        this.#updateTimeMessageElement(timeElement, message);

        return messageElement;
    }
    CreateMyFileMessage(message){
        const messageElement = this.CreateFileMessage(message);
        messageElement.classList.add('message--mymessage');
        return messageElement;
    }
    AddFileMessageToPreviousFileMessageElement(message, previousMessageElement){
        if(this.#GetFileType(message) == 'image'){
            previousMessageElement.querySelector('.content > .name-time').insertAdjacentHTML('beforebegin',`
                <div class='content__mes'>
                    <img src='${message.FileAttachUrl}'>
                </div>
            `);       
            this.AddEventToImageMessage(previousMessageElement);
        }
        else if(this.#GetFileType(message) == 'icon'){
            previousMessageElement.querySelector('.content > .name-time').insertAdjacentHTML('beforebegin',`
                <div class='content__mes'>
                    <img style='width: 40px;' src='${message.FileAttachUrl}'>
                </div>
            `); 
        }
        else if(this.#GetFileType(message) == 'audio'){
            const audioElement = new AudioElement(message.FileAttachUrl).CreateAudioElement();
            previousMessageElement.querySelector('.content > .name-time').insertAdjacentHTML('beforebegin',`
                <div class='content__mes'></div>
            `);
            const lastContentMessage = previousMessageElement.querySelectorAll('.content > .content__mes');
            lastContentMessage[lastContentMessage.length - 1].appendChild(audioElement);
        }
        else if(this.#GetFileType(message) == 'video'){
            previousMessageElement.querySelector('.content > .name-time').insertAdjacentHTML('beforebegin',`
                <div class='content__mes'></div>
            `);
            let lastContentMessage = previousMessageElement.querySelectorAll('.content > .content__mes');
            lastContentMessage = lastContentMessage[lastContentMessage.length - 1];
            const videoElement = new VideoElement(message.FileAttachUrl).CreateVideoElement(lastContentMessage);
            lastContentMessage.appendChild(videoElement);
        }
        else{
            previousMessageElement.querySelector('.content > .name-time').insertAdjacentHTML('beforebegin',`
                <div class='content__mes'>
                    <div class='other-file-main'>
                        <a href='${message.FileAttachUrl}' download='${message.Content}'>
                            ${message.Content}
                        </a>
                    </div>
                </div>
            `);
        }
        const timeElement = previousMessageElement.querySelector('.name-time > .time');
        this.#updateTimeMessageElement(timeElement, message);
    }
    CreateTypingMessageElement(user){
        const messageElement = document.createElement('div');
        messageElement.className = 'message message-loading';
        messageElement.innerHTML = `
            <img class="avatar" src="${user.AvatarUrl}">
            <div class="content">
                <div class='content__mes'>
                    <p class="loading">
                        <i class="fa-solid fa-circle"></i>
                        <i class="fa-solid fa-circle"></i>
                        <i class="fa-solid fa-circle"></i>
                    </p>
                </div>
                <div class="name-time"></div>
            </div>
        `;
        return messageElement;
    }
    CreateMyTypingMessageElement(user){
        const messageElement = this.CreateMessage(user);
        messageElement.classList.add('message--mymessage');
        return messageElement;
    }
    AddEventToImageMessage(messageElement){
        let imageElement = messageElement.querySelectorAll('.content .content__mes img');
        imageElement = imageElement[imageElement.length - 1];
        imageElement.addEventListener('click', () => {
            const mainElement = document.querySelector('main');
            const imagePopupElement = ImagePopup.CreateImagePopupElement(
                imageElement.src,
                () => { mainElement.removeChild(imagePopupElement) }
            );
            mainElement.appendChild(imagePopupElement);
        });
    }
    AddUpdateMessageActiveConversationElement(activeConversationElement, options = {}){
        const previousMessage = this.messages[this.messages.length - 2];
        const newMessage = this.messages[this.messages.length - 1];
        const messageContainerElement = activeConversationElement.querySelector('.body-right__messages');
        this.CreateMessageMain(messageContainerElement, newMessage, previousMessage ? previousMessage.Sender : null, newMessage.Sender);

        if(!options.newMessage){
            newMessage.loading = true;
            this.AddStatusLoadingToLastMessageElement(messageContainerElement);
        }

        this.ScrollToLastMessage(activeConversationElement);
    }
    ScrollToLastMessage(activeConversationElement){
        const messageContainerElement = activeConversationElement.querySelector('.body-right__messages');
        let lastMesElement = messageContainerElement.querySelectorAll('.message:last-child > .content .content__mes');
        lastMesElement = lastMesElement[lastMesElement.length - 1];
        if(!lastMesElement) return;
        if(lastMesElement.querySelector('img')){
            lastMesElement.querySelector('img').addEventListener('load', (e) => {
                e.target.scrollIntoView();
            });
        }
        else{
            lastMesElement.scrollIntoView();
        }
    }
    FocusInputChat(activeConversationElement){
        const inputChatElement = activeConversationElement.querySelector("input[type='text']");
        inputChatElement.focus();
    }
    AddStatusLoadingToLastMessageElement(messageContainerElement){
        let contentMesLastElement = this.GetLastContentMessageElement(messageContainerElement);
        if(!contentMesLastElement.querySelector('.status-load')){
            contentMesLastElement.insertAdjacentHTML('beforeend', '<i class="status-load fa-solid fa-circle-notch"></i>');
        }
    }
    AddStatusSuccessToLastMessageElement(messageContainerElement){
        let contentMesLastElement = this.GetLastContentMessageElement(messageContainerElement);
        if(!contentMesLastElement.querySelector('.status-load')){
            contentMesLastElement.insertAdjacentHTML('beforeend', '<i class="status-success fa-solid fa-check"></i>');
        }
    }
    GetLastContentMessageElement(messageContainerElement){
        if(!messageContainerElement){
            messageContainerElement = document.querySelector('.body-right__messages');
        }
        let lastMessageElement = this.#GetLastMessageElement(messageContainerElement);
        let contentMesLastElement = lastMessageElement.querySelectorAll('.content .content__mes');
        contentMesLastElement = contentMesLastElement[contentMesLastElement.length - 1];
        return contentMesLastElement;
    }
    static ReplaceStatusLoadingToMessageElement(contentMessageElement){
        const statusSuccessElement = document.createElement('i');
        statusSuccessElement.className = 'status-success fa-solid fa-check';
        contentMessageElement.replaceChild(
            statusSuccessElement,
            contentMessageElement.querySelector('.status-load')
        );
    }
    ReloadTypingConversation(messageContainerElement){
        const messageElements = messageContainerElement.querySelectorAll('.message');
        messageElements.forEach((message) => {
            if(message.querySelector('.loading')){
                messageContainerElement.removeChild(message);
            }
        });
        this.participants.forEach((participant) => {
            if(participant.typing){
                if(participant.Id != this.user.Id){
                    messageContainerElement.appendChild(this.CreateTypingMessageElement(participant));
                }
                else{
                    messageContainerElement.appendChild(this.CreateMyTypingMessageElement(participant));
                }
            }
        });
    }
    static UpdateAmountMessageNotReaded(conversationElement, amount){
        const statusAreaElement = conversationElement.querySelector('.status-area');
        if(statusAreaElement.querySelector('.status')){
            if(amount == 0){
                statusAreaElement.removeChild(statusAreaElement.querySelector('i:last-child'));     
            }
            else{
                const spanElement = statusAreaElement.querySelector('i > span');
                spanElement.innerText = amount;
            }
        }
        else{
            if(amount == 0){
                return;     
            }
            const newStatusMessageElement = document.createElement('i');
            newStatusMessageElement.className = 'fa-solid fa-circle status';
            newStatusMessageElement.innerHTML = `<span>${amount}</span>`;
            statusAreaElement.appendChild(newStatusMessageElement);
        }
    }
}
export default Conversation;
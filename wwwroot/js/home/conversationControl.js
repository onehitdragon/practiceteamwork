class ConversationControl{
    constructor(user, listConversation){
        this.user = user;
        this.listConversation = listConversation;
        this.listConversationElement = [];
        this.conversationContainerElement = document.querySelector('.body-left__conversations');
        this.listMessageLoadingElement = [];
    }
    init(){       
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
                }
                this.#AddEventToInputChatElement();
                this.#AddEventToButtonChooseFileElement();
            });
        });
    }
    #AddEventToInputChatElement(){
        const inputChatElement = document.querySelector(".body-right__send > input[type='text']");
        inputChatElement.addEventListener('keydown', (e) => {
            if(e.key == 'Enter' && inputChatElement.value != ''){
                let contentMessage = inputChatElement.value;
                inputChatElement.value = "";
                let message = {
                    Sender : this.user,
                    TypeMessage : 0,
                    Content : contentMessage
                };
                this.#SendMessage(message);
            }
        });
    }
    #SendMessage(message){
        this.activeConversation.Messages.push(message);
        this.#updateListConversation(this.activeConversation, {
            newMessage : false
        });
        this.listMessageLoadingElement.push(
            {
                messageElementId : this.listMessageLoadingElement.length + 1,
                message : message,
                messageElement : Conversation.GetLastMessageElement()
            }
        );
        this.signalr.invoke(
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
            formData.append('file', inputElement.files[0]);
            ajax.sendPOSTFile('/Home/SendFile', formData, (res) => {
                const fileAttachUrl = JSON.parse(res.responseText).fileAttachUrl;
                console.log(JSON.parse(res.responseText));
                console.log(res.responseText);
                let message = {
                    Sender : this.user,
                    TypeMessage : 1,
                    Content : file.name,
                    FileAttachUrl : fileAttachUrl
                }
                this.#SendMessage(message);
            });
        });
    }
    async startSocket(){
        this.signalr = new signalR.HubConnectionBuilder().withUrl('/chat').build();
        await this.signalr.start();
        this.signalr.invoke(
            'Init', 
            JSON.stringify(
            {
                user : this.user,
                listConversation : this.listConversation
            })
        );
        this.signalr.on('haveNewMessage', (json) => {
            let conversation = JSON.parse(json);
            this.#updateListConversation(conversation, {
                newMessage : true
            });
        });
        this.signalr.on('serverReceivedMessage', (json) => {
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
}
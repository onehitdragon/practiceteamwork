import ConversationControl from "./conversationControl.js";
import MyTool from "./myTool.js";
class IconAreaElement{
    #dinoIcons = ['ankylosaurus.png','apatosaurus.png','archaeopteryx.png','dilophosaurus.png',
    'dinosaur-egg.png','dried-insect-in-amber.png','elasmosaurus.png','fossil.png','pteranodon.png',
    'spinosaurus.png','stegosaurus.png','triceratops.png','velociraptor.png'];
    #emojiIcons = ['confused.png','cool.png','in-love.png','in-love-1.png',
    'sad.png','sad-1.png','sad-2.png','smile.png','smile-1.png','surprised.png'];
    #nowarIcons = ['no-tanks.png','no-violence.png','no-war.png','no-war-1.png','no-war-3.png',
    'no-war-4.png','no-war-5.png','no-war-6.png','no-war-8.png','no-war-10.png','no-war-11.png',
    'no-war-20.png','no-war-7.png'];
    constructor(){
        
    }
    createIconAreaElement(){
        const iconAreaElement = document.createElement('div');
        iconAreaElement.className = 'icon-area';
        const mainElement = document.createElement('div');
        mainElement.className = 'main';

        mainElement.appendChild(this.#createRowMenuElement("Dinos", this.#dinoIcons));
        mainElement.appendChild(this.#createRowMenuElement("Mọi người", this.#emojiIcons, true));
        mainElement.appendChild(this.#createRowMenuElement("No war", this.#nowarIcons));
        iconAreaElement.appendChild(mainElement);
        this.iconAreaElement = iconAreaElement;

        return iconAreaElement;
    }
    #createRowMenuElement(title, icons, isCollapse){
        const rowMenuElement = document.createElement('div');
        rowMenuElement.className = 'menu-row';
        const rowTitleElement = document.createElement('p');
        rowTitleElement.className = 'menu-row__title';
        const iconContainer = document.createElement('div');
        iconContainer.className = 'menu-row__icons';
        
        rowTitleElement.innerHTML = `
            <p>${title}</p>
            <i class="fa-solid fa-angle-right"></i>
        `;
        let isRed = true;
        icons.forEach((icon) => {
            let iconElement = document.createElement('div');
            iconElement.className = 'icon';
            if(isRed) iconElement.classList.add('icon--red');
            else iconElement.classList.add('icon--blue');
            isRed = !isRed;
            iconElement.innerHTML = `
                <img src="/img/icons/${icon}"/>
            `;
            iconElement.addEventListener('click', () => {
                const conversationControl = new ConversationControl();
                let message = {
                    Sender : conversationControl.user,
                    TypeMessage : 1,
                    Content : `:${icon}`,
                    FileAttachUrl : iconElement.querySelector('img').src,
                    CreateAt : MyTool.GetCurrentTime()
                }
                conversationControl.SendMessage(message);
                this.iconAreaElement.parentElement.removeChild(this.iconAreaElement);              
            });
            iconContainer.appendChild(iconElement);
        });

        rowTitleElement.addEventListener("click", () => {
            if(rowMenuElement.lastElementChild == iconContainer) {
                rowMenuElement.removeChild(iconContainer);
                rowTitleElement.querySelector('i').classList.remove('rotate90');
            }
            else {
                rowMenuElement.appendChild(iconContainer);
                rowTitleElement.querySelector('i').classList.add('rotate90');
            };
        });

        rowMenuElement.appendChild(rowTitleElement);
        if(!isCollapse) {
            rowMenuElement.appendChild(iconContainer);
            rowTitleElement.querySelector('i').classList.add('rotate90');
        }   

        return rowMenuElement;
    }
    setEventToButtonIconElement(buttonConversationElement){
        const buttonIconElement = buttonConversationElement.querySelector("button[name='icon']");
        buttonIconElement.addEventListener('click', (e) => {
            if(buttonConversationElement.contains(this.iconAreaElement)){
                buttonConversationElement.removeChild(this.iconAreaElement);
                buttonIconElement.querySelector('i').classList.remove('i--white');
            }
            else{
                buttonConversationElement.appendChild(this.iconAreaElement);
                buttonIconElement.querySelector('i').classList.add('i--white');
            }
            e.stopPropagation();
        });
        document.addEventListener('click', (e) => {
            if(this.iconAreaElement.contains(e.target) || e.target == buttonIconElement) return;
            if(buttonConversationElement.contains(this.iconAreaElement)){
                buttonConversationElement.removeChild(this.iconAreaElement);
                buttonIconElement.querySelector('i').classList.remove('i--white');
            }
        });
    }
}
export default IconAreaElement;
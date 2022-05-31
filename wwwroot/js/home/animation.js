const initAnimation = () => {
    const bodyLeftElement = document.querySelector('.body > .body__main .body-left');
    const conversationElements = document.querySelectorAll('.body-left__conversations > .conversation-item');
    let bodyRightElement = document.querySelector('.body > .body__main .body-right');

    bodyLeftElement.style = 'transform: translateX(250px);';
    bodyRightElement.style = 'opacity: 0';
    let onAnimation;
        
    conversationElements.forEach((conversationElement) => {
        conversationElement.addEventListener('click', () => {
            if(onAnimation){
                return;
            }
            onAnimation = true;
            bodyLeftElement.classList.toggle('body-left--ani');
            bodyRightElement = document.querySelector('.body > .body__main .body-right');
            bodyRightElement.style = 'opacity: 0';
            setTimeout(() => {
                bodyLeftElement.style = 'transform: translateX(0px);'           
                bodyRightElement.style = 'opacity: 1;';
                bodyLeftElement.querySelector('.body-left__before').style = 'border-top-right-radius: 0px; border-bottom-right-radius: 0px;';
                bodyRightElement.querySelector('.body-right__before').style = 'border-top-left-radius: 0px; border-bottom-left-radius: 0px;';
                bodyLeftElement.classList.toggle('body-left--ani');
            }, 1000);
        });
    });
}

export default initAnimation;

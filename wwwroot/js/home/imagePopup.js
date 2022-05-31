class ImagePopup{
    constructor(){

    }
    static CreateImagePopupElement(srcImg, closeCallback){
        let imagePopupElement = document.createElement('div');
        imagePopupElement.id = 'img-video-popup';
        imagePopupElement.innerHTML = `
            <img src="${srcImg}"></img>
        `;
        imagePopupElement.addEventListener('click', (e) => {
            if(e.target != imagePopupElement.querySelector('img')){
                closeCallback();
            }
        });

        return imagePopupElement;
    }
}
export default ImagePopup;
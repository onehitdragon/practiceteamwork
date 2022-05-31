class VideoPopup{
    static CreateVideoPopup(videoMainElement, closeCallback){
        let videoPopupElement = document.createElement('div');
        videoPopupElement.id = 'img-video-popup';
        videoPopupElement.append(videoMainElement);
        videoPopupElement.addEventListener('click', (e) => {
            if(e.target == videoPopupElement){
                closeCallback();
            }
        });

        return videoPopupElement;
    }
}
export default VideoPopup;
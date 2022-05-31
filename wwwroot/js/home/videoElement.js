import VideoPopup from "./videoPopup.js";
import AudioElement from "./audioElement.js";
import {mainElement} from "../init.js";
class VideoElement{
    constructor(videoSrc){
        this.videoSrc = videoSrc;
    }
    CreateVideoElement(contentMessage){
        const videoMainElement = document.createElement('div');
        videoMainElement.className = 'video-main';
        const videoElement = document.createElement('video');
        videoElement.src = this.videoSrc;
        const controlMainElement = document.createElement('div');
        controlMainElement.className = 'control-main';
        controlMainElement.innerHTML = `
            <div class='control-main__play'>
                <button>
                    
                </button>
            </div>
            <input type='range' value='0' max='100'>
            <div class='control-main__controls'>
                <div class='control-left'>
                    <button class='play'>
                        
                    </button>
                    <div class='time'>
                        <span class='progress-time'>00:00</span>
                        <span> / </span>
                        <span class='total'>00:00</span>
                    </div>
                    <button class='volume'>
                        
                    </button>
                </div>
                <div class='control-right'>
                    <button class='zoom'>
                        <i class="fa-solid fa-expand"></i>
                    </button>
                </div>
            </div>
        `;
        const buttonPlayMainElement = controlMainElement.querySelector('.control-main__play > button');
        const inputRangeElement = controlMainElement.querySelector("input[type='range']");
        const buttonPlayElement = controlMainElement.querySelector('.control-main__controls .control-left > .play');
        const timeProgressElement = controlMainElement.querySelector('.control-main__controls .control-left .time > .progress-time');
        const timeTotalElement = controlMainElement.querySelector('.control-main__controls .control-left .time > .total');
        const buttonVolumeElement = controlMainElement.querySelector('.control-main__controls .control-left > .volume');
        const buttonZoomElement = controlMainElement.querySelector('.control-main__controls .control-right > .zoom');
        
        const iconMainStop = document.createElement('i');
        iconMainStop.className = 'fa-solid fa-circle-play';
        buttonPlayMainElement.append(iconMainStop);
        const iconMainPlaying = document.createElement('i');
        iconMainPlaying.className = 'fa-solid fa-circle-pause';

        const iconStoping = document.createElement('i');
        iconStoping.className = 'fa-solid fa-play';
        buttonPlayElement.append(iconStoping);
        const iconPlaying = document.createElement('i');
        iconPlaying.className = 'fa-solid fa-stop';

        buttonPlayMainElement.addEventListener('click', buttonPlayClick);
        buttonPlayElement.addEventListener('click', buttonPlayClick);
        const audioElement = new AudioElement();
        function buttonPlayClick(){
            if(buttonPlayMainElement.children[0] == iconMainStop){
                buttonPlayMainElement.replaceChild(
                    iconMainPlaying,
                    buttonPlayMainElement.children[0]
                );
                buttonPlayElement.replaceChild(
                    iconPlaying,
                    buttonPlayElement.children[0]
                );
                audioElement.StartAnimation('line-ani-video');
                videoElement.play();
            }
            else{
                buttonPlayMainElement.replaceChild(
                    iconMainStop,
                    buttonPlayMainElement.children[0]
                );
                buttonPlayElement.replaceChild(
                    iconStoping,
                    buttonPlayElement.children[0]
                );
                audioElement.StopAnimation('line-ani-video');
                videoElement.pause();
            }
        }
        videoElement.addEventListener('loadedmetadata', () => {
            timeTotalElement.textContent = audioElement.GetTotalTime(videoElement);
        });
        videoElement.addEventListener('timeupdate', () => {
            timeProgressElement.textContent = audioElement.GetCurrentTime(videoElement);
            inputRangeElement.value = (videoElement.currentTime / videoElement.duration) * 100;
        });
        videoElement.addEventListener('ended', () => {
            buttonPlayMainElement.replaceChild(
                iconMainStop,
                buttonPlayMainElement.children[0]
            );
            buttonPlayElement.replaceChild(
                iconStoping,
                buttonPlayElement.children[0]
            );
            audioElement.StopAnimation('line-ani-video');
            controlMainElement.style = 'opacity: 1; transition: .3s;';
        });
        inputRangeElement.addEventListener('input', () => {
            videoElement.currentTime = videoElement.duration * (inputRangeElement.value / 100);
        });

        const iconSound = document.createElement('i');
        iconSound.className = 'fa-solid fa-volume-high';
        buttonVolumeElement.append(iconSound);
        const iconNoSound = document.createElement('i');
        iconNoSound.className = 'fa-solid fa-volume-xmark';
        buttonVolumeElement.addEventListener('click', () => {
            if(buttonVolumeElement.children[0] == iconSound){
                buttonVolumeElement.replaceChild(
                    iconNoSound,
                    buttonVolumeElement.children[0]
                );
                videoElement.muted = true;
            }
            else{
                buttonVolumeElement.replaceChild(
                    iconSound,
                    buttonVolumeElement.children[0]
                );
                videoElement.muted = false;
            }
        });

        controlMainElement.addEventListener('mouseenter', () => {
            controlMainElement.style = 'opacity: 1; transition: .3s;';
        });
        controlMainElement.addEventListener('mouseleave', () => {
            if(videoElement.paused){
                return;
            }
            controlMainElement.style = 'opacity: 0; transition: 2s;';
        });

        videoMainElement.append(videoElement);
        videoMainElement.append(controlMainElement);

        buttonZoomElement.addEventListener('click', () => {
            const videoPopupElement = VideoPopup.CreateVideoPopup(
                videoMainElement,
                () => {
                    mainElement.removeChild(videoPopupElement);
                    contentMessage.insertAdjacentElement('afterBegin', videoMainElement);
                }
            );
            mainElement.append(videoPopupElement);
            
        });

        return videoMainElement;
    }
}
export default VideoElement;
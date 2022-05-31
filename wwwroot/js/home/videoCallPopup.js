import VideoCallControl from "./videoCallControl.js";
class VideoCallPopup{
    constructor(){
        this.isShareScreen = false;
    }
    createVideoCallPopupElement(close){
        const videoCallContainerElement = document.createElement('div');
        videoCallContainerElement.className = 'main-video';
        videoCallContainerElement.innerHTML = `
            <div class="main__video-call">
                <div class="call-time">
                    <i class="fa-solid fa-record-vinyl"></i>
                    <span>00:00</span>
                </div>
                <video class='otherVideo' autoplay muted></video>
                <video class='myVideo' autoplay muted></video>
                <div class="controls-main">
                    <div class="volume__bar">
                        <div class="volume">
                            <i class="fa-solid fa-volume-xmark"></i>
                            <input type="range" min='0' max='100' value='0'>
                        </div>
                    </div>
                    <div class="controls-main__control">
                        <button name="zoom">
                            <i class="fa-solid fa-expand"></i>
                        </button>
                        <button name="mute">
                            <i class="fa-solid fa-microphone-slash"></i>
                        </button>
                        <button name="stop">
                            <i class="fa-solid fa-phone-flip"></i>
                        </button>
                        <button name="hide-camera">
                            <i class="fa-solid fa-video"></i>
                        </button>
                        <button name="setting">
                            <i class="fa-solid fa-desktop"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        const mainContainerElement = videoCallContainerElement.querySelector('.main__video-call');
        const myVideoElement = videoCallContainerElement.querySelector('video.myVideo');
        const otherVideoElement = videoCallContainerElement.querySelector('video.otherVideo');
        otherVideoElement.addEventListener('loadedmetadata', () => {
            let width = otherVideoElement.clientWidth;
            let height = otherVideoElement.clientHeight;
            let windowWidth = window.innerWidth;
            let windowHeight = window.innerHeight;
            while(width > windowWidth || height > windowHeight){
                width *= 0.9;
                height *= 0.9;
            }
            mainContainerElement.style = `width: ${width}px; height: ${height}px`;
            otherVideoElement.style = `width: ${width}px; height: ${height}px`;
        });
        this.myVideoElement = myVideoElement;
        this.otherVideoElement = otherVideoElement;
        const btnZoomElement = videoCallContainerElement.querySelector("button[name='zoom']");
        const btnMuteElement = videoCallContainerElement.querySelector("button[name='mute']");
        const btnMuteLeftElement = videoCallContainerElement.querySelector(".volume");
        const iconMenuLeftElement = btnMuteLeftElement.querySelector('i');
        const inputRangeElement = btnMuteLeftElement.querySelector("input[type='range']");
        const btnStopElement = videoCallContainerElement.querySelector("button[name='stop']");
        const btnHideCameraElement = videoCallContainerElement.querySelector("button[name='hide-camera']");
        const btnSettingElement = videoCallContainerElement.querySelector("button[name='setting']");
        console.log([otherVideoElement]);
        btnZoomElement.addEventListener('click', () => {

        });
        btnMuteElement.addEventListener('click', () => {
            this.#toggleIconButtonElement(btnMuteElement, 'fa-microphone', 'fa-microphone-slash');
        });
        let currentValue = 100;
        const showMuteIcon = () => {
            iconMenuLeftElement.classList.remove('fa-volume-high');
            iconMenuLeftElement.classList.add('fa-volume-xmark');
            this.otherVideoElement.muted = true;
        }
        const hideMuteIcon = () => {
            iconMenuLeftElement.classList.add('fa-volume-high');
            iconMenuLeftElement.classList.remove('fa-volume-xmark');
            this.otherVideoElement.muted = false;
        }
        iconMenuLeftElement.addEventListener('click', () => {
            this.#toggleIconButtonElement(btnMuteLeftElement, 'fa-volume-high', 'fa-volume-xmark');
            const valueRange = inputRangeElement.value;
            if(valueRange > 0){
                inputRangeElement.value = 0;
                showMuteIcon();
            }
            else{
                inputRangeElement.value = currentValue != 0 ? currentValue : 100;
                hideMuteIcon();
            }
        });
        inputRangeElement.addEventListener('input', () => {
            currentValue = inputRangeElement.value;
            if(inputRangeElement.value == 0){
                showMuteIcon();
            }
            else{
                hideMuteIcon();
            }
        });
        btnStopElement.addEventListener('click', () => {
            close();
        });
        btnHideCameraElement.addEventListener('click', () => {
            this.#toggleIconButtonElement(btnHideCameraElement, 'fa-video', 'fa-video-slash');
        });
        btnSettingElement.addEventListener('click', () => {
            const videoCallControl = new VideoCallControl();
            if(!this.isShareScreen){
                videoCallControl.shareScreen();
                btnSettingElement.querySelector('i').style = 'color : red;';
            }
            else{
                videoCallControl.stopShareScreen();
                btnSettingElement.querySelector('i').style = 'color : white;';
            }
            this.isShareScreen = !this.isShareScreen;
            
        });
        const timeElement = videoCallContainerElement.querySelector('.call-time > span');
        this.#linearTime(timeElement);

        return videoCallContainerElement;
    }
    #toggleIconButtonElement(buttonElement, iconName1, iconName2){
        const iconButtonElement = buttonElement.querySelector('i');
        if(iconButtonElement.classList.contains(iconName1)){
            iconButtonElement.classList.replace(iconName1, iconName2);
        }
        else{
            iconButtonElement.classList.replace(iconName2, iconName1);
        }
    }
    #linearTime(timeElement){
        let time = 0;
        setInterval(() => {
            time++;
            let minute = parseInt(time/60);
            let second = parseInt(time - minute * 60);
            if(parseInt(minute / 10) == 0){
                minute = '0' + minute;
            }
            if(parseInt(second / 10) == 0){
                second = '0' + second;
            }
            timeElement.textContent = `${minute}:${second}`;
        }, 1000)
    }
    setMediaStream(myMediaStream, otherMediaStream){
        this.myVideoElement.srcObject = myMediaStream;
        this.otherVideoElement.srcObject = otherMediaStream;
    }
}
export default VideoCallPopup;
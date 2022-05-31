class AudioElement{
    constructor(audioSrc){
        this.audioSrc = audioSrc;
    }
    CreateAudioElement(){
        const audioMainElement = document.createElement('div');
        audioMainElement.className = 'audio-main';
        const audioElement = document.createElement('audio');
        audioElement.src = this.audioSrc;
        const buttonPlayElement = document.createElement('button');
        buttonPlayElement.className = 'audio-main__play';
        const timeContainerElement = document.createElement('div');
        timeContainerElement.className = 'audio-main__time';
        timeContainerElement.innerHTML = `
            <span class='progress-time'>0:00</span>
            <span> / </span>
            <span class='total'>1:44</span>
        `;
        const timeProgressElement = timeContainerElement.querySelector('.progress-time');
        const timeTotalElement = timeContainerElement.querySelector('.total');
        const inputRangeElement = document.createElement('input');
        inputRangeElement.type = 'range';
        inputRangeElement.max = 100;
        inputRangeElement.value = 0;
        const buttonVolumnElement = document.createElement('button');
        buttonVolumnElement.className = 'audio-main__volume';

        const iconStoping = document.createElement('i');
        iconStoping.className = 'fa-solid fa-play';
        buttonPlayElement.appendChild(iconStoping);
        const iconPlaying = document.createElement('i');
        iconPlaying.className = 'fa-solid fa-stop';
        buttonPlayElement.addEventListener('click', () => {
            if(buttonPlayElement.children[0] == iconStoping){
                buttonPlayElement.replaceChild(
                    iconPlaying,
                    buttonPlayElement.children[0]
                );
                this.StartAnimation('line-ani-audio');
                audioElement.play();
            }
            else{
                buttonPlayElement.replaceChild(
                    iconStoping,
                    buttonPlayElement.children[0]
                );
                this.StopAnimation('line-ani-audio');
                audioElement.pause();
            }
        });
        const iconSound = document.createElement('i');
        iconSound.className = 'fa-solid fa-volume-high';
        buttonVolumnElement.append(iconSound);
        const iconNoSound = document.createElement('i');
        iconNoSound.className = 'fa-solid fa-volume-xmark';
        buttonVolumnElement.addEventListener('click', () => {
            if(buttonVolumnElement.children[0] == iconSound){
                buttonVolumnElement.replaceChild(
                    iconNoSound,
                    buttonVolumnElement.children[0]
                );
                audioElement.muted = true;
            }
            else{
                buttonVolumnElement.replaceChild(
                    iconSound,
                    buttonVolumnElement.children[0]
                );
                audioElement.muted = false;
            }
        });

        audioElement.addEventListener('loadedmetadata', () => {
            timeTotalElement.textContent = this.GetTotalTime(audioElement);
        });
        audioElement.addEventListener('timeupdate', () => {
            timeProgressElement.textContent = this.GetCurrentTime(audioElement);
            inputRangeElement.value = (audioElement.currentTime / audioElement.duration) * 100;
        });
        audioElement.addEventListener('ended', () => {
            buttonPlayElement.replaceChild(
                iconStoping,
                buttonPlayElement.children[0]
            );
            this.StopAnimation('line-ani-audio');
        });
        inputRangeElement.addEventListener('input',() => {
            audioElement.currentTime = audioElement.duration * (inputRangeElement.value / 100);
        });

        audioMainElement.append(audioElement);
        audioMainElement.append(buttonPlayElement);
        audioMainElement.append(timeContainerElement);
        audioMainElement.append(inputRangeElement);
        audioMainElement.append(buttonVolumnElement);
        return audioMainElement;
    }
    StartAnimation(nameAnimation){
        const animations = document.getAnimations();
        animations.forEach((animation) => {
            if(animation.animationName == nameAnimation){
                animation.play();
            }
        });
    }
    StopAnimation(nameAnimation){
        const animations = document.getAnimations();
        animations.forEach((animation) => {
            if(animation.animationName == nameAnimation){
                animation.pause();
            }
        });
    }
    GetTotalTime(audioElement){
        const duration = audioElement.duration;
        let minus = parseInt(duration / 60);
        let second = parseInt(duration - minus * 60);
        return `${minus}:${second}`;
    }
    GetCurrentTime(audioElement){
        const currentTime = audioElement.currentTime;
        let minus = parseInt(currentTime / 60);
        let second = parseInt(currentTime - minus * 60);
        if(parseInt(second / 10) == 0){
            second = '0' + second;
            //console.log(second);
        }
        //console.log(second);
        return `${minus}:${second}`;
    }
}
export default AudioElement;
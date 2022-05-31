class EffectMessage{
    constructor(){
        navigator.mediaDevices.getUserMedia({audio: true, video: true});
    }
    Ting(){
        const audio = new Audio('/sound/ting.mp3');
        navigator.mediaDevices.getUserMedia({audio: true}).then(() => {
            audio.play().then(() => {
            
            })
            .catch((err) => {
                console.log(err);
            })
        });
    }
}
export default EffectMessage;
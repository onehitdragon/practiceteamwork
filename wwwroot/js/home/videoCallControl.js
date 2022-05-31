import VideoCallPopup from './videoCallPopup.js';
import {mainElement} from '../init.js';
import MessagePopup from '../messagePopup.js';
import Socket from './socket.js';
class VideoCallControl{
    static #instance
    constructor(){
        if(VideoCallControl.#instance){
            return VideoCallControl.#instance;
        }
        VideoCallControl.#instance = this;
        this.mediaStreamConstrain = {
            audio : true,
            video: true
        }
        this.configureWebRTC = {
            iceServers: [
                {
                    urls: 'stun:stun.l.google.com:19302'
                },
                {
                    urls: "turn:openrelay.metered.ca:80",
                    username: "openrelayproject",
                    credential: "openrelayproject"
                },
                {
                  urls: "turn:openrelay.metered.ca:443",
                  username: "openrelayproject",
                  credential: "openrelayproject",
                },
                {
                  urls: "turn:openrelay.metered.ca:443?transport=tcp",
                  username: "openrelayproject",
                  credential: "openrelayproject",
                }
            ]
        }
        this.candidates = [];
        this.socket = Socket.getInstance();
        const messagePopup = new MessagePopup();
        this.socket.on('canCallVideo', (data) => {
            if(data == 'offline'){
                const messageElement = messagePopup.createMessageElement(
                    '/img/layout/fail.png',
                    'Lỗi',
                    'Người dùng đã Offline',
                    () => {
                        mainElement.removeChild(messageElement);
                    },
                    null,
                    {
                        hideCancer : true
                    }
                );
                mainElement.appendChild(messageElement);
            }
            if(data == 'canCalling'){
                const messageElement = messagePopup.createMessageElement(
                    this.user.AvatarUrl,
                    this.user.LastName + ' ' + this.user.FirstName ? this.user.FirstName : "",
                    'Đang gọi...',
                    null, null,
                    {
                        hideCancer : true,
                        hideAgree : true
                    }
                );
                this.currentMessageElement = messageElement;
                mainElement.appendChild(messageElement);
            }
            if(data == 'startCallVideo'){
                mainElement.removeChild(this.currentMessageElement);
                this.#createOffer();
            }
        })
        this.socket.on('calling', (user) => {
            const messageElement = messagePopup.createMessageElement(
                user.avatarUrl,
                user.lastName + ' ' + (user.firstName ? user.firstName : ""),
                'Đang gọi bạn...',
                () => {
                    this.socket.invoke('AcceptCalling', user);
                    mainElement.removeChild(messageElement);
                },
                () => {
                    mainElement.removeChild(messageElement);
                }
            );
            mainElement.appendChild(messageElement);
        })
        this.socket.on('offer', (sender, sdp) => {
            this.user = sender;
            this.webRTC = new RTCPeerConnection(this.configureWebRTC);
            this.#createAnswer(sender, sdp);
        })
        this.socket.on('answer', (sdp) => {
            this.#acceptAnswer(sdp);
        })
        this.socket.on('updateCandidate', (candidate) => {
            this.#updateCandidate(candidate);
        });
        this.socket.on('stopCall', (stoper) => {
            this.closeCallPopupElement(false);
            const messageElement = messagePopup.createMessageElement(
                stoper.avatarUrl,
                stoper.lastName + ' ' + stoper.firstName,
                'Đã kết thúc cuộc gọi',
                () => {
                    mainElement.removeChild(messageElement);
                },
                null,
                {
                    hideCancer : true
                }
            );
            mainElement.appendChild(messageElement);
        });
    }
    call(user){
        this.webRTC = new RTCPeerConnection(this.configureWebRTC);
        this.user = user;
        this.socket.invoke("CallVideo", this.user);
    }
    #getMediaUser(callback = () => {}){
        // navigator.permissions.query({name : 'camera'}).then((permission) => {
        //     if(permission.state == 'denied'){
        //         mainElement.appendChild(messageElement);
        //     }  
        // })
        const messagePopup = new MessagePopup();
        const messageElement = messagePopup.createMessageElement(
            '/img/layout/fail.png',
            'Lỗi',
            'Yêu cầu máy ảnh và microphone',
            () => {
                mainElement.removeChild(messageElement);
            },
            null,
            {
                hideCancer : true
            }
        );
        navigator.mediaDevices.getUserMedia(this.mediaStreamConstrain).then((myMediaStream) => {
            for(const track of myMediaStream.getTracks()) {
                this.webRTC.addTrack(track);
            }
            callback(myMediaStream);
        })
        .catch((err) => {
            console.log(err);
            mainElement.appendChild(messageElement);
        })
    }
    shareScreen(){
        navigator.mediaDevices.getDisplayMedia(this.mediaStreamConstrain).then((myMediaStream) => {
            for(const track of this.myMediaStream.getTracks()){
                this.myMediaStream.removeTrack(track);
            }
            for(const track of myMediaStream.getTracks()) {
                this.myMediaStream.addTrack(track);
                for(let i = 0; i < this.webRTC.getSenders().length; i++){
                    const sender = this.webRTC.getSenders()[i];
                    if(sender.track.kind == track.kind){
                        sender.replaceTrack(track);
                    }
                }
            }
        })
        .catch((err) => {
            console.log(err);
            mainElement.appendChild(messageElement);
        })
    }
    stopShareScreen(){
        navigator.mediaDevices.getUserMedia(this.mediaStreamConstrain)
        .then((mediaStream) => {
            for(const track of this.myMediaStream.getTracks()){
                this.myMediaStream.removeTrack(track);
            }
            for(const track of mediaStream.getTracks()) {
                this.myMediaStream.addTrack(track);
                for(let i = 0; i < this.webRTC.getSenders().length; i++){
                    const sender = this.webRTC.getSenders()[i];
                    if(sender.track.kind == track.kind){
                        sender.replaceTrack(track);
                    }
                }
            }
        });
    }
    #showVideoCallPopup(){
        const videoCallPopup = new VideoCallPopup();
        this.videoCallPopup = videoCallPopup;
        this.closeCallPopupElement = (sendSocket = true) => {
            mainElement.removeChild(videoCallPopupElement);
            this.#stopCall();
            if(sendSocket) this.socket.invoke('StopCall', this.user);
        }
        const videoCallPopupElement = videoCallPopup.createVideoCallPopupElement(this.closeCallPopupElement);  
        let otherMediaStream;  
        this.webRTC.ontrack = (e) => {
            if(!otherMediaStream){
                otherMediaStream = new MediaStream();
                videoCallPopup.setMediaStream(this.myMediaStream, otherMediaStream);
                mainElement.appendChild(videoCallPopupElement);
            }
            otherMediaStream.addTrack(e.track);
        }
    }
    #createOffer(){
        this.#showVideoCallPopup();
        this.webRTC.onicecandidate = (e) => {
            if(e.candidate){
                this.socket.invoke('UpdateCandidate', this.user, e.candidate);
            }
        };
        this.#getMediaUser((myMediaStream) => {
            this.myMediaStream = myMediaStream;
            this.webRTC.createOffer()
            .then((sdp) => {
                this.webRTC.setLocalDescription(sdp);
                this.socket.invoke('Offer', this.user, sdp);
            });
        });
    }
    #createAnswer(sender, sdp){
        this.#showVideoCallPopup();
        this.webRTC.onicecandidate = (e) => {
            if(e.candidate){
                this.socket.invoke('UpdateCandidate', sender, e.candidate);
            }
        };
        this.#getMediaUser((myMediaStream) => {
            this.myMediaStream = myMediaStream;
            this.webRTC.setRemoteDescription(sdp);
            this.webRTC.createAnswer()
            .then((sdp) => {
                this.webRTC.setLocalDescription(sdp);
                this.socket.invoke('Answer', sender, sdp);
            });
        });
    }
    #acceptAnswer(sdp){
        this.webRTC.setRemoteDescription(sdp);
    }
    #updateCandidate(candidate){
        this.#addCandidateToRTC(candidate);
    }
    #addCandidateToRTC(candidate){
        this.webRTC.addIceCandidate(new RTCIceCandidate(candidate))
        .then(() => {
            console.log("add candidate success");
        })
        .catch((err) => {
            console.log(err);
            setTimeout(() => {
                this.#addCandidateToRTC(candidate);
            }, 2000);
        })
    }
    #stopCall(){
        this.webRTC.close();
    }
}
export default VideoCallControl;
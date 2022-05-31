import ConversationControl from './conversationControl.js';
import Socket from './socket.js';
import FriendControl from './friendControl.js';
import GroupControl from './groupControl.js';
import VideoCallControl from './videoCallControl.js';
console.log(conversationList);
const friendControl = new FriendControl(friendList, requestingList);
const groupControl = new GroupControl(friendList);
const conversationControl = new ConversationControl(user, conversationList);
conversationControl.initConversation();
const socket = Socket.getInstance();
socket.start().then(() => {
    conversationControl.initSocket();
});
const videoCallControl = new VideoCallControl();

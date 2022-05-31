import Ajax from './ajax.js';
import MessagePopup from './messagePopup.js';

const mainElement = document.querySelector('main');
const ajax = new Ajax();
const messagePopup = new MessagePopup();

export {mainElement, ajax, messagePopup}
class Ajax{
    constructor (){
        this.ajax = new XMLHttpRequest();
    }
    sendGET(url, callback){    
        this.ajax.open('GET', url);
        this.ajax.onload = () => {
            callback(this.ajax);
        }
        this.ajax.send();         
    }

    sendPOST(url, body, callback){
        this.ajax.open('POST', url);
        this.ajax.onload = () => {
            callback(this.ajax);
        }
        this.ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        this.ajax.send(body);
    }

    sendPOSTFile(url, body, callback){
        this.ajax.open('POST', url);
        this.ajax.onload = () => {
            callback(this.ajax);
        }
        this.ajax.send(body);
    }
}
export default Ajax;
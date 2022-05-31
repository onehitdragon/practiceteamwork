class Socket{
    static #instance;
    static getInstance(){
        if(!this.#instance){
            this.#instance = new Socket();
            this.#instance.signalr = new signalR.HubConnectionBuilder().withUrl('/chat').build();
        }
        return this.#instance;
    }
    async start(){
        await this.signalr.start();
    }
    invoke(nameFunc, ...values){
        if(values.length == 1){
            this.signalr.invoke(nameFunc, values[0]);
        }
        if(values.length == 2){
            this.signalr.invoke(nameFunc, values[0], values[1]);
        }
        if(values.length == 3){
            this.signalr.invoke(nameFunc, values[0], values[1], values[3]);
        }
    }
    on(nameFunc, callback){
        this.signalr.on(nameFunc, callback);
    }
}
export default Socket;
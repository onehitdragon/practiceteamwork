class MyTool{
    static GetCurrentTime(){
        let date = new Date();
        let today = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        let time = today.toISOString().slice(0, 19);
        return time;
    }
}

export default MyTool;
class RamdomBackground{
    constructor (){
        this.backgrounds = ['bg.jpeg', 'bg1.jpeg', 'bg2.jpeg', 'bg3.jpeg', 'bg4.jpeg', 'bg5.jpeg'];
    }   
    getBackGroundName(){
        let numberRand = 1; //(Math.random() * 100) % this.backgrounds.length;
        numberRand = parseInt(numberRand);
        return this.backgrounds[numberRand];
    }
}
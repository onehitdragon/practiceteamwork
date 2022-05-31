// random bg
const htmlElement = document.querySelector('html');

let randomBackground = new RamdomBackground();
htmlElement.style = `background-image: url('/img/layout/${randomBackground.getBackGroundName()}');`;
//
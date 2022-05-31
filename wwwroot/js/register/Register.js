class Register{
    constructor(email, lastName, firstName, birthDay, phone, password){
        
    }
}
const emailElement = document.querySelector("input[name='Email']");
const lastNameElement = document.querySelector("input[name='LastName']");
const firstNamelElement = document.querySelector("input[name='FirstName']");
const birthDayEmailElement = document.querySelector("input[name='BirthDay']");
const radioMaleElement = document.querySelector("input[name='RadioMale']");
const radioFemaleElement = document.querySelector("input[name='RadioFemale']");
const toggleRadioGender = (e) => {
    if(e.target.checked){
        e.target.checked = true;
        return;
    }
    if(radioMaleElement.checked){
        radioFemaleElement.checked = false;
    }
    else{
        radioMaleElement.checked = false;
    }
}
radioMaleElement.addEventListener('input', toggleRadioGender);
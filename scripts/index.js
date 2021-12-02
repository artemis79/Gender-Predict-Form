const submitButton = document.querySelector('.submit.button');
const saveButton = document.querySelector('.save.button');
const name = document.querySelector('.name');
const predictedGender = document.getElementById('gender_prediction');
const predictedNumber = document.getElementById('number_prediction');
const savedAnswer = document.getElementById('saved_answer');
const clearButton = document.querySelector('.clear.button');


function checkName(nameValue){

    if (nameValue == "") {
        window.alert("name was empty");
        return false;
    }
    if(nameValue.length > 255){
        window.alert("name too long");
        return false;
    }

    if(!nameValue.match(/^[a-z0-9]+$/i)){
        window.alert("name not alphanumerical");
        return false;
    }

    return true
}
async function getNamePrediction(inputName) {
    try {
        let response = await fetch(`https://api.genderize.io/?name=${inputName}`);
        let json = await response.json();
        if (response.status != 200) {
            handleError(json);
            return Promise.reject(`Request failed with error ${response.status}`);
        }
        return json;

    } catch (e) {
        console.log(e);
        showErrorMessage(e);
    }
}

function showPrediction(jsonPrediction){
    predictedGender.innerHTML = `${jsonPrediction.gender}`;
    predictedNumber.innerHTML = `${jsonPrediction.probability}`;
}

function showSavedAnswer(nameValue){
    let gender = window.localStorage.getItem(nameValue);
    if(gender == null)
        savedAnswer.textContent = " No Answered Saved yet!";
    else
        savedAnswer.textContent = gender;

}

async function sendRequest(e) {
    let nameValue = name.value;

    if(!checkName(nameValue))
        return ;

    e.preventDefault();

    let jsonPrediction = await getNamePrediction(nameValue);
    showPrediction(jsonPrediction);
    showSavedAnswer(nameValue);
}

function clearChoices(){
    document.querySelector('input[name="gender"]:checked').checked = false;
    name.value = "";
}

async function saveAnswer(e){
    let nameValue = name.value;

    if(!checkName(nameValue))
        return ;

    e.preventDefault();
    let radioButton = document.querySelector('input[name="gender"]:checked');

    if (radioButton == null){
        let gender = predictedGender.textContent;
        if(gender == "Unknown")
            window.alert("No prediction or Chosen answer to save");

        else
            window.localStorage.setItem(nameValue, gender);
    }
    else{
        window.localStorage.setItem(nameValue, radioButton.value);
    }
    clearChoices();

}

async function clearAnswer(e){
    let nameValue = name.value;
    if(!checkName(nameValue))
        return;

    e.preventDefault();
    window.localStorage.removeItem(nameValue);
}

submitButton.addEventListener('click', sendRequest);
saveButton.addEventListener('click', saveAnswer);
clearButton.addEventListener('click', clearAnswer);
const submitButton = document.querySelector('.submit.button');
const saveButton = document.querySelector('.save.button');
const name = document.querySelector('.name');
const predictedGender = document.getElementById('gender_prediction');
const predictedNumber = document.getElementById('number_prediction');
const savedAnswer = document.getElementById('saved_answer');
const clearButton = document.querySelector('.clear.button');
const warningField = document.getElementById('warning');


//Checks if the name from user input is valid or not
function checkName(){
    let nameValue = name.value;
    if (nameValue == "") {
        warningField.textContent = "name is empty";
        return false;
    }
    if(nameValue.length > 255){
        warningField.textContent = "name too long";
        return false;
    }

    if(!nameValue.match(/^[a-z0-9]+$/i)){
        warningField.textContent = "name not alphanumerical";
        return false;
    }

    warningField.textContent = "";
    return true;
}

function showErrorMessage(message) {
    warningField.textContent = message;
}

// for handle status code error
function handleError(response) {
    showErrorMessage(response.message);
}

//Fetches name prediction via http get request and returns a json object
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


//Shows Gender prediction and probability in Prediction block
function showPrediction(jsonPrediction){
    predictedGender.innerHTML = `${jsonPrediction.gender}`;
    predictedNumber.innerHTML = `${jsonPrediction.probability}`;
}


//Shows saved answer from local storage in Saved Answer field
function showSavedAnswer(nameValue){
    let gender = window.localStorage.getItem(nameValue);
    if(gender == null) {
        savedAnswer.textContent = " No Answered Saved!";
        document.querySelector(".answer").style.visibility = "hidden";
    }
    else {
        savedAnswer.textContent = gender;
        document.querySelector(".answer").style.visibility = "visible";
    }

}

//Submits name and gets prediction and shows prediction and saved answer
async function sendRequest(e) {
    let nameValue = name.value;

    if(!checkName())
        return ;

    e.preventDefault();

    let jsonPrediction = await getNamePrediction(nameValue);

    if(jsonPrediction.gender == null) {
        warningField.textContent = "Name not found";
        predictedGender.textContent = "Unknown";
        predictedNumber.textContent = "0";
        showSavedAnswer(name.value);
        return;
    }

    showPrediction(jsonPrediction);
    showSavedAnswer(nameValue);
}

//Clears radio button choice
function clearChoices(){
    if (document.querySelector('input[name="gender"]:checked') != null)
        document.querySelector('input[name="gender"]:checked').checked = false;

    name.value = "";
}

//Saves users choice or current prediction
async function saveAnswer(e){
    let nameValue = name.value;

    if(!checkName())
        return ;

    e.preventDefault();
    let radioButton = document.querySelector('input[name="gender"]:checked');

    if (radioButton == null){
        let gender = predictedGender.textContent;
        if(gender == "Unknown") {
            warningField.textContent = "Nothing to save";
        }

        else {
            window.localStorage.setItem(nameValue, gender);
        }
    }
    else{
        window.localStorage.setItem(nameValue, radioButton.value);
    }

    clearChoices();
    document.querySelector(".answer").style.visibility = "hidden";

}

//Deletes saved answer
async function clearAnswer(e){
    let nameValue = name.value;
    if(!checkName())
        return;

    e.preventDefault();
    window.localStorage.removeItem(nameValue);
    document.querySelector(".answer").style.visibility = "hidden";

}


//Make buttons black when mouse moves over
document.querySelectorAll('input[type=button]').forEach(function(e) {
    e.addEventListener('mouseover', function() {
        this.style.backgroundColor = "black";
        this.style.color="white";
    })
});

//Makes buttons white when mouse moves out
document.querySelectorAll('input[type=button]').forEach(function(e) {
    e.addEventListener('mouseout', function() {
        this.style.backgroundColor = "white";
        this.style.color="black";
    })
});


//Event Listeners
document.querySelector(".answer").style.visibility = "hidden";
submitButton.addEventListener('click', sendRequest);
saveButton.addEventListener('click', saveAnswer);
clearButton.addEventListener('click', clearAnswer);
name.addEventListener('input', checkName);
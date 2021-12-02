const submitButton = document.querySelector('.submit.button');
const name = document.querySelector('.name');
const predictedGender = document.getElementById('gender_prediction');
const predictedNumber = document.getElementById('number_prediction');

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


async function sendRequest(e) {
    let nameValue = name.value;
    if (nameValue == "") {
        console.log("name was empty");
        return;
    }
    if(nameValue.length > 255){
        console.log("name too large");
        return;
    }

    if(!nameValue.match(/^[a-z0-9]+$/i)){
        console.log("name not alphanumerical");
        return;
    }
    e.preventDefault();

    let jsonPrediction = await getNamePrediction(nameValue);
    
    predictedGender.innerHTML = `${jsonPrediction.gender}`;
    predictedNumber.innerHTML = `${jsonPrediction.probability}`;
}

submitButton.addEventListener('click', sendRequest);
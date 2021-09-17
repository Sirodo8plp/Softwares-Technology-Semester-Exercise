document.querySelector('#transition').addEventListener('click', DecideProjectCreationProgress);

function CollectAllMandatoryValues() {
    let required_values = [];
    required_values.push(document.querySelector('#title').value);
    required_values.push(document.querySelector('#description').value);
    required_values.push(document.querySelector('#projectType').value);
    required_values.push(document.querySelector('#offerVisibility').value);
    required_values.push(document.querySelector('#category').value);
    required_values.push(document.querySelector('#paymentType').value);
    return required_values;
}

function ShowAndHideErrorMessage(errorID) {
    document.querySelector(`#${errorID}`).classList.add('error-show');
    let links = Array.from(document.querySelectorAll('.mandatory a,.secondary a'));
    links.forEach(link => link.classList.add('transition-link-disable'));
    document.querySelector('#transition').classList.add('transition-link-disable');
    setTimeout(() => {
        document.querySelector(`#${errorID}`).classList.remove('error-show');
        links.forEach(link => link.classList.remove('transition-link-disable'));
    }, 3000);
}

function MoveToTheNextSection() {
    document.querySelector('#mandatory').classList.add('mandatory-hide');
    document.querySelector('#secondary').classList.remove('secondary-hide');
}

function MoveToThePreviousSection() {
    document.querySelector('#mandatory').classList.remove('mandatory-hide');
    document.querySelector('#secondary').classList.add('secondary-hide');
}

document.querySelector('#goBackButton').addEventListener('click', MoveToThePreviousSection);

function DecideProjectCreationProgress(e) {
    let required_values = CollectAllMandatoryValues();

    if (required_values.includes("")) ShowAndHideErrorMessage("error");
    else MoveToTheNextSection();

}

document.querySelector('#range').addEventListener('input', () => {
    document.querySelector('#range-label').innerHTML = `Duration of offers' availability: 
        ${document.querySelector('#range').value} days.`;
})

//Inititate register project process

//Get All Data

function GatherData() {
    return {
        title: document.querySelector('#title').value,
        description: document.querySelector('#description').value,
        type: document.querySelector('#projectType').value,
        visibility: document.querySelector('#offerVisibility').value,
        subcategory: document.querySelector('#category').value,
        category: document.querySelector('#category option:checked').parentElement.label,
        paymentType: document.querySelector('#paymentType').value,
        price: document.querySelector('#projectsPrice').value,
        duration: document.querySelector('#duration').value,
        offerDuration: document.querySelector('#range').value,
        tags: document.querySelector('#freetags').value
    }
}

document.querySelector('#completeCreation').addEventListener('click', async () => {
    document.querySelector('#completeCreation').classList.add('transition-link-disable');
    let data = GatherData();
    let regularExpression = /[a-zA-z]/g
    if(regularExpression.test(data.price)){
        ShowAndHideErrorMessage('priceError');
        return;
    }
    try {
        let checkExistenceFetch = await fetch(`/project/checkExistence/${data.title}`);
        let checkExistenceReply = await checkExistenceFetch.json();
        if (checkExistenceReply.message === "No project exists with this title.") {
            fetch("/project/createProject", {
                method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
                body: JSON.stringify(data)
            }).then(response => response.json()).then(data => {
                if (data.message === "Project has successfully been registered.")
                    window.location.href = "/customer/projects";
                else {

                }
            }).catch(error => console.error(error));
        } else {

        }
    } catch (error) {
        console.error(error);
    }
});
function AnimateOptionsAndChangeInputValue(option1ID, option2ID, hiddenInputID, option1Value , option2Value) {
    let option1Element = document.querySelector('#' + option1ID);
    let option2Element = document.querySelector('#' + option2ID);
    let hiddenFormInput = document.querySelector('#' + hiddenInputID);

    option1Element.addEventListener('click', () => {
        if (option2Element.classList.contains('private-clicked')) {
            option2Element.classList.remove('private-clicked');
        }

        if (option1Element.classList.contains('public-clicked')) {
            option1Element.classList.remove('public-clicked');
            hiddenFormInput.value = "";
        } else {
            option1Element.classList.add('public-clicked');
            hiddenFormInput.value = option1Value;
        }
    });

    option2Element.addEventListener('click', () => {
        if (option1Element.classList.contains('public-clicked')) {
            option1Element.classList.remove('public-clicked');
        }

        if (option2Element.classList.contains('private-clicked')) {
            option2Element.classList.remove('private-clicked');
            hiddenFormInput.value = "";
        } else {
            option2Element.classList.add('private-clicked');
            hiddenFormInput.value = option2Value;
        }
    });
}

AnimateOptionsAndChangeInputValue('projectPublic' , 'projectPrivate' , 'projectType' , 'Public' , 'Private');
AnimateOptionsAndChangeInputValue('offerVisible','offerHidden','offerVisibility','Visible','Hidden');
AnimateOptionsAndChangeInputValue('byHourOption','byProjectOption','paymentType','By Hour','By the end of the project');
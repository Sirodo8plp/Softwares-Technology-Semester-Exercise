function AnimateLabelInputTitle() {
    let inputTitle = document.querySelector('#title');
    let inputLabel = document.querySelector('.input-label-title');

    inputTitle.addEventListener('focusout', () => {
        let title = inputTitle.value;
        if (title.length !== 0) {
            inputTitle.classList.add('input-with-text');
            inputLabel.classList.add('input-label-with-text');
        } else {
            inputTitle.classList.remove('input-with-text');
            inputLabel.classList.remove('input-label-with-text');
        }
    });
}

function AnimateLabelTextareaDescription() {
    let inputDescription = document.querySelector('#description');
    let inputLabel = document.querySelector('.input-label-description');

    inputDescription.addEventListener('focusout', () => {
        let title = inputDescription.value;
        if (title.length !== 0) {
            inputDescription.classList.add('input-with-text');
            inputLabel.classList.add('input-label-textarea-with-text');
        } else {
            inputDescription.classList.remove('input-with-text');
            inputLabel.classList.remove('input-label-textarea-with-text');
        }
    });
}

function AnimateLabelProjectsPrice() {
    let inputText = document.querySelector('#projectsPrice');
    let inputLabel = document.querySelector('.input-label-secondary');
    inputText.addEventListener('focusout' , () => {
        console.log("woof");
        let text = inputText.value;
        if(text.length !== 0){
            document.querySelector('#projectsPrice').classList.add('input-with-text');
            document.querySelector('.input-label-secondary').classList.add('input-label-secondary-text');
        }
        else{
            document.querySelector('.input-label-secondary').classList.remove('input-label-secondary-text');
            document.querySelector('#projectsPrice').classList.remove('input-with-text');
        }
    });
}

AnimateLabelInputTitle();
AnimateLabelTextareaDescription();
AnimateLabelProjectsPrice();
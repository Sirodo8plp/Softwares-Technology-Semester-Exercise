function DefineGenderSVG() {
    let genderParagraph = document.querySelector('#Gender').nextElementSibling;
    genderParagraph.classList.add('gender');
    let SVGelement = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
        useElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    if (genderParagraph.innerHTML === 'male') {
        useElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '../symbol-defs.svg#icon-male');
        SVGelement.classList.add('male-svg');
    } else {
        useElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '../symbol-defs.svg#icon-female');
        SVGelement.classList.add('female-svg');
    }
    SVGelement.appendChild(useElement);
    genderParagraph.appendChild(SVGelement);
}

DefineGenderSVG();

document.querySelector('#ProfileTab').classList.add('selectedTab');

function CheckUploadFile() {
    const [file] = document.querySelector("input[type='file']").files;
    if (!file) {
        return false;
    } else {
        return true;
    }
}

document.querySelector('.cuvi').addEventListener('submit', (e) => {
    if(!CheckUploadFile()){
        e.preventDefault();
    }
});
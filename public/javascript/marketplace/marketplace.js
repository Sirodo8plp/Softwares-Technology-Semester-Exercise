const filters = document.querySelector('.left-content');
const filtersContainer = document.querySelector('.left');
const mainSection = document.querySelector('.main');

function getViewportWidth() {
    return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
}

function RefactorDOM_TurnFiltersToSlideMenu() {
    filtersContainer.remove();
    document.body.insertBefore(filtersContainer, mainSection);
    filtersContainer.classList.add('left-resize');
    filters.classList.add('left-content-resize');
    document.body.classList.add('body-resize');
}

function RefactorDOM_ResetFilersList() {
    filtersContainer.classList.remove('left-resize');
    filters.classList.remove('left-content-resize');
    filtersContainer.remove();
    mainSection.insertBefore(filtersContainer, document.querySelector('.page'));
}

document.querySelector('.left-button').addEventListener('click', () => {
    if (getViewportWidth() < 1250) {
        RefactorDOM_TurnFiltersToSlideMenu();
    }
});

document.querySelector('.left').addEventListener('click' , (event) => {
    if(filtersContainer == event.target){
        filtersContainer.classList.remove('left-resize');
        filters.classList.remove('left-content-resize');
        document.body.classList.remove('body-resize');
    }
});

window.addEventListener('resize', () => {
    if (getViewportWidth() > 1250) RefactorDOM_ResetFilersList();
});
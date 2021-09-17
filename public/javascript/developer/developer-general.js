/*set the checkboxes*/
document.getElementById('slide').checked = false;

let navigationSlideButton = document.querySelector("#slide");

navigationSlideButton.addEventListener('click', () => {
    let navigationMenuContainer = document.querySelector('.inside-nav');
    let navigationMenuList = document.querySelector('.inside-nav-container');
    let mainContainer = document.querySelector('.main-container');

    if (navigationSlideButton.checked) {
        //document.querySelector('.flex-body').style.display = "block";
        navigationMenuContainer.remove();
        document.body.insertBefore(navigationMenuContainer, document.querySelector('.constrain'));
        navigationMenuContainer.classList.add('inside-nav-top');
        navigationMenuList.classList.add('inside-nav-container-top');
        mainContainer.classList.add('main-container-top');
        document.querySelectorAll('.nav-left').forEach(span => {
            span.style.display = "none";
        });
        document.querySelectorAll('.nav-top').forEach(span => {
            span.style.display = "block";
        });
    } else {
        navigationMenuContainer.remove();
        document.querySelector('.constrain').insertBefore(navigationMenuContainer, mainContainer);
        navigationMenuContainer.classList.remove('inside-nav-top');
        navigationMenuList.classList.remove('inside-nav-container-top');
        mainContainer.classList.remove('main-container-top');
        document.querySelectorAll('.nav-top').forEach(span => {
            span.style.display = "none";
        });
        document.querySelectorAll('.nav-left').forEach(span => {
            span.style.display = "block";
        });
    }
});

//change UI in resize

function getViewportWidth() {
    return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
}

function refactorDomPutInsideNavToTop( ) {
    let navigationMenuContainer = document.querySelector('.inside-nav');
    let navigationMenuList = document.querySelector('.inside-nav-container');
    let mainContainer = document.querySelector('.main-container');
    navigationMenuContainer.remove();
    document.body.insertBefore(navigationMenuContainer, document.querySelector('.constrain'));
    navigationMenuContainer.classList.add('inside-nav-top');
    navigationMenuList.classList.add('inside-nav-container-top');
    mainContainer.classList.add('main-container-top');
    document.querySelectorAll('.nav-left').forEach(span => {
        span.style.display = "none";
    });
    document.querySelectorAll('.nav-top').forEach(span => {
        span.style.display = "block";
    });
}

function DOM_putInsideNavToTheTop(navigationMenuContainer) {
    navigationMenuContainer.remove();
    document.body.insertBefore(navigationMenuContainer, document.querySelector('.constrain'));
    navigationMenuContainer.classList.add('inside-nav-top');
    document.querySelectorAll('.nav-left').forEach(span => {
        span.style.display = "none";
    });
    document.querySelectorAll('.nav-top').forEach(span => {
        span.style.display = "block";
    });
}

function DOM_putInsideNavToTheLeft(navigationMenuContainer) {
    try{
        let navigationMenuList = document.querySelector('.inside-nav-container');
        let mainContainer = document.querySelector('.main-container');
        navigationMenuList.classList.remove('inside-nav-container-top');
        mainContainer.classList.remove('main-container-top');
    }
    catch(err){
        console.log(err);
    }
    navigationMenuContainer.classList.remove('inside-nav-top');
    navigationMenuContainer.remove();
    document.querySelector('.constrain').insertBefore(navigationMenuContainer, document.querySelector('.main-container'));
    document.querySelectorAll('.nav-top').forEach(span => {
        span.style.display = "none";
    });
    document.querySelectorAll('.nav-left').forEach(span => {
        span.style.display = "block";
    });
}

window.addEventListener('resize', () => {
    let navigationMenuContainer = document.querySelector('.inside-nav');
    if (getViewportWidth() <= 991) DOM_putInsideNavToTheTop(navigationMenuContainer);
    else DOM_putInsideNavToTheLeft(navigationMenuContainer);
});

let navigationMenuContainer = document.querySelector('.inside-nav');
if (getViewportWidth() <= 991) DOM_putInsideNavToTheTop(navigationMenuContainer);
else DOM_putInsideNavToTheLeft(navigationMenuContainer);


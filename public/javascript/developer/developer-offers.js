async function getOffers() {
    try {
        let requestData = await fetch("/developer/getOffers");
        let offers = await requestData.json();
        return offers;
    } catch (error) {
        console.error(error);
    }
}

async function showOffers() {
    let container = document.querySelector('.main-container');
    let offers = await getOffers();
    offers.forEach((offer,count) => {
        let offerHTML = `
        <div class="offer-container" id="${"offer-container"+count}">
            <p class="offer-date">
                <svg class="p-svg">
                    <use href="../symbol-defs.svg#icon-calendar"></use>
                </svg>
                ${offer.date.split("T")[0]}
            </p>
            <h3 class="offer-project-title">${offer.project}</h3>
            <p class="offer-price">
                <svg class="p-svg">
                    <use href="../symbol-defs.svg#icon-coins"></use>
                </svg>
                ${offer.offer}
            </p>
        </div>
        `;
        container.insertAdjacentHTML('beforeend' , offerHTML);
    });
    container.insertAdjacentHTML('beforeend' ,`
        <div class="options">
            <a href="/developer/projects" class="navLink">View your Projects</a>
            <a href="/developer/general" class="navLink">Return to General tab</a>
        </div>
    `);
}

showOffers().then(() => {
    try{
        let anchorID = window.location.href;
        anchorID = anchorID.split("#")[1];
        location.hash = "#" + anchorID;
    }
    catch(e){}
});

document.querySelector('#OffersTab').classList.add('selectedTab');
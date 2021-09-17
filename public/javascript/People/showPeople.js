async function Json(pathToFetch) {
    try {
        let fetchRequest = await fetch(pathToFetch);
        let fetchResponse = await fetchRequest.json();
        return fetchResponse;
    } catch (error) {
        console.log(error);
    }
}

async function GetDevelopers() {
    let developers = await Json("/home/people/getDevelopers");
    return developers;
}

async function GetCustomers() {
    return await Json("/home/people/getCustomers");
}

async function ShowDevelopers(container) {
    let serverResponse = await GetDevelopers();
    if (serverResponse.message === "Success" && serverResponse.developers.length > 0) {
        serverResponse.developers.forEach(developer => {
            container.insertAdjacentHTML('beforeend', `
                <div class="profile profile-developer">
                    <figure class="profile__figure">
                        <img class="profile__image" src="../images/${developer.profileImage}" alt="User's profile image">
                    </figure>
                    <h2 class="profile__username">${developer.privacy[0].setting === true ? "Username: " + developer.username : "Username: Locked"}</h2>
                    <a href="/home/visitDeveloper/${developer.username}" class="profile__redirect">Details</a>
                </div>
            `);
        });
    }
    //display custom Tags
    if (serverResponse.tags[0] === "") serverResponse.tags.shift();
    if (serverResponse.tags.length > 0 ) {
        serverResponse.tags.forEach(customTag => {
            document.querySelector('#left-SuggestedTech').insertAdjacentHTML('beforeend', `
            <a href="#" class="category">${customTag}</a>
            `);
        })
    } else
        document.querySelector('#left-SuggestedTech').insertAdjacentHTML('beforeend', `<h3>There are not any custom tags available.</h3>`);
}

async function ShowCustomers(container) {
    let serverResponse = await GetCustomers();
    if (serverResponse.message === "Success" && serverResponse.customers.length > 0) {
        serverResponse.customers.forEach(customer => {
            container.insertAdjacentHTML('beforeend', `
                <div class="profile profile-customer">
                    <figure class="profile__figure">
                        <img class="profile__image" src="../images/${customer.profileImage}" alt="User's profile image">
                    </figure>
                    <h2 class="profile__username">${customer.privacy[0].setting === true ? "Username: " + customer.username : "Username: Locked"}</h2>
                    <a href="/home/visitCustomer/${customer.username}" class="profile__redirect">Details</a>
                </div>
            `);
        });
    }
}

async function ShowUsers() {
    let container = document.querySelector('.page');
    await ShowDevelopers(container);
    await ShowCustomers(container);
    await refreshDevelopers();
}

ShowUsers();
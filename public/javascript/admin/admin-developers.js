async function GetDevelopers() {
    try {
        let fetchRequest = await fetch("/admin/GetDevelopers");
        let response = await fetchRequest.json();
        return response;
    } catch (error) {
        console.error(error);
    }
}

async function showDevelopers() {
    try {
        let developers = await GetDevelopers();
        developers = developers.developers;
        let developerContainer = document.querySelector('.customer-profiles-container')
        if(developers.length > 0){
            developers.forEach(developer => {
                developerContainer.insertAdjacentHTML('beforeend' , `
                    <div class="customer">
                        <figure class="customer-figure">
                            <img src="../images/${developer.profileImage}" alt="ProfileImage">
                        </figure>
                        <p>Username: ${developer.username}</p>
                        <p>Email: ${developer.email}</p>
                        <p>First Name: ${developer.name}</p>
                        <p>Last Name: ${developer.surname}</p>
                        <a href="/admin/deleteDeveloper/${developer._id}" class="delete-link">Delete</a>
                    </div>
                `);
            });
        }
        else {
            developerContainer.innerHTML = `
            <h2 style="text-align:center;">No developers were found.</h2>
            `
        }
    } catch (error) {
        console.log(error);
    }
}

showDevelopers();

let filters = {
    customTags: "",
    predefinedTags: "",
    rating: 0,
    completedProjects: 0
};
async function refreshDevelopers() {
    let links = Array.from(document.querySelectorAll('.left-content a'));
    links.shift(); // remove the 'Remove Filters' link
    links.forEach(link => link.addEventListener('click', filterLink));
    document.querySelector('#rating').addEventListener('input', filterRating);
    document.querySelector('#completedProjectsCounter').addEventListener('input', filterCompletedProjects);
}

function filterLink(e) {
    if (e.target.classList.contains('selected'))
        e.target.classList.remove('selected');
    else
        e.target.classList.add('selected');
    if (e.target.parentElement.classList.contains("left-SuggestedTech"))
        filters.customTags = Array.from(document.querySelectorAll('.left-SuggestedTech a.selected')).map(link => link.innerHTML).join();
    else
        filters.predefinedTags = Array.from(document.querySelectorAll('.left-categories a.selected')).map(link => link.innerHTML).join();
    applyFilters();
}

function filterRating(e) {
    e.target.nextElementSibling.innerHTML = `Current rating: ${e.target.value}`;
    filters.rating = e.target.value;
    applyFilters();
}

function filterCompletedProjects(e) {
    filters.completedProjects = e.target.value;
    applyFilters();
}

async function applyFilters() {
    let filterFetchOptions = {
        method: "POST",
        body: JSON.stringify(filters),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    fetch("/home/filterDevelopers", filterFetchOptions)
        .then(response => response.json())
        .then(data => {
            if (data.message === "success") {
                Array.from(document.querySelectorAll('.profile-developer')).forEach(developerDiv => {
                    developerDiv.remove();
                });
                data.developers.forEach(developer => {
                    document.querySelector('.page').insertAdjacentHTML('afterbegin', `
                    <div class="profile profile-developer">
                        <figure class="profile__figure">
                            <img class="profile__image" src="../images/${developer.profileImage}" alt="User's profile image">
                        </figure>
                        <h2 class="profile__username">${developer.privacy[0].setting === true ? "Username: " + developer.username : "Username: Locked"}</h2>
                        <a href="/home/visitDeveloper/${developer.username}" class="profile__redirect">Details</a>
                    </div>
                `);
                })
            }

        })
        .catch(error => console.error(error));
}
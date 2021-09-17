fetch("/home/customizeNavbar").then(response => response.json())
    .then(data => {
            let navbar = document.querySelector('#navbarProfileHolder');
            if (data.type === "Customer" || data.type === "Developer") {
                navbar.insertAdjacentHTML('beforeend', `
                <li class="nav-item bordernav">
                    <a class="nav-link nav-link-profile" id="userProfile" href="/home/profile">
                        <figure class="navigation-profile-image">
                            <img src="../images/${data.image}" alt="profileImage">
                        </figure>
                        #${data.username}</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="signup" href="/logout">Log Out</a>`);
            }else if(data.type !== "Guest"){
                navbar.insertAdjacentHTML('beforeend', `
                <li class="nav-item bordernav">
                    <a class="nav-link nav-link-profile" id="userProfile" href="/home/profile">
                        Welcome Admin!</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="signup" href="/logout">Log Out</a>`);
            }else {
                navbar.insertAdjacentHTML('beforeend' , `
                    <li class="nav-item bordernav">
                        <a class="nav-link" id="login" onclick="redirectfunct(this.id)">Sign In</a>
                    </li>
                    <li class="nav-item bordernav">
                        <a class="nav-link" id="signup" onclick="redirectfunct(this.id)">Sign Up</a>
                    </li>
                `);
            }
        }).catch(error => {
            console.error(error);
        });


/*********/
/*search*/
/*******/

// <p class="categoryTitle">Projects</p>
// <div class="searchResults" id="userList"></div>
// <p class="categoryTitle">Users</p>
// <div class="searchResults" id="projectList"></div>

document.querySelector('#searchInput').addEventListener('focusin' , () => {
    document.querySelector('#searchResultsTab').classList.add('searchTab-focus');
});

document.querySelector('#searchInput').addEventListener('focusout' , () => {
    document.querySelector('#searchResultsTab').classList.remove('searchTab-focus');
});

document.querySelector('#searchInput').addEventListener('input' , async (e) => {
    let fetchRequest = await fetch(`/home/searchAsync/${e.target.value}`);
    let searchResults = await fetchRequest.json();
    let searchTab = document.querySelector('#searchResultsTab');
    searchTab.innerHTML = "";
    ShowUsers(searchResults.users , searchTab);
    ShowSearchedProjects(searchResults.projects , searchTab);
});

function ShowUsers(users,container){
    container.insertAdjacentHTML('afterbegin' , `<p class="categoryTitle">Users</p>`);
    if(users.length === 0){
        container.insertAdjacentHTML('beforeend' , `<p>No users were found with this username.</p>`);
        return;
    }
    users.forEach(user => {
        container.insertAdjacentHTML('beforeend' , `
            <div class="profile">
                <figure class="profile-figure">
                    <img src="../images/${user.profileImage}" alt="ProfileImage" onerror="this.style.display='none'">
                </figure>
                <p>${user.username}</p>
                <a href="/home/${user.type === "Customer" ? "visitCustomer" : "visitDeveloper"}/${user.username}" class="profile-link">Visit</a>
            </div>
        `);
    });
}

function ShowSearchedProjects(projects,container){
    container.insertAdjacentHTML('beforeend' , `<p class="categoryTitle">Projects</p>`);
    if(projects.length === 0){
        container.insertAdjacentHTML('beforeend' , `<p>No projects were found with this title.</p>`);
        return;
    }
    projects.forEach(project => {
        container.insertAdjacentHTML('beforeend' , `
            <div class="profile">
                <p>${project.title}</p>
                <a href="/home/visitProject/${project.title}" class="profile-link">View</a>
            </div>
        `);
    });
    container.insertAdjacentHTML('beforeend' , `
        <a class="profile-link ext" href="/home/marketplace">Visit Marketplace</a>
    `);
}
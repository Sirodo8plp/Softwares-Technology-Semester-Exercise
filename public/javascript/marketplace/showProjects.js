async function getProjects() {
    try {
        let fetchRequest = await fetch("/project/marketplace/getProjects");
        let projectsResponse = await fetchRequest.json();
        ShowProjects(projectsResponse);
    } catch (error) {

    }
}

async function ShowProjects(serverResponse) {
    let projects = serverResponse.projects;
    let userType = serverResponse.userType;
    console.log(userType);
    let projectsContainer = document.querySelector('.page');
    projectsContainer.innerHTML = "";
    if (projects.length === 0) {
        projectsContainer.insertAdjacentHTML('beforeend', "<h2 style='grid-column:1/3;text-align:center'>No projects were found. Try to single out some filters.</h2>");
        return
    }
    projects.forEach((project, count) => {
        let projectHTML = ` <div class="project-container" id="projectContainer${count}">`;
        if (project.projectVisibility === "Private" && userType === "Guest")
            projectHTML += `
            <div class="locked-message">
                    <svg>
                        <use href="../symbol-defs.svg#icon-locked"></use>
                    </svg>
                    <p>This project is only visible to registered users. Sign in in order to see it.</p>
                </div>
            <div class="locked">
            `;
        projectHTML += `<h3 class="project-title">${project.title}</h3>`;
        if (project.offerVisibility === 'Visible' && project.offers.length > 0) {
            projectHTML += `<div class="project-offers"><h4>Project's Offers</h4>`;
            project.offers.forEach(offer => {
                projectHTML += `
                    <p>${offer.username}</p>
                    <p>${offer.offer}$</p>
                `
            });
            projectHTML += `</div>`;
        }
        projectHTML += `
            <h4>Project Description</h4>
            <div class="project-desciption">
                <p>${project.description}</p>
            </div>
            <div class="project-technologies">
                <h4>Technologies:</h4>
                <p>${project.technologies}</p>
            </div>
            <ul class="project-minor">
                <li>
                    <svg>
                        <use href="../symbol-defs.svg#icon-calendar"></use>
                    </svg>
                    Created on ${project.date}
                </li>
                <li>
                    <svg>
                        <use href="../symbol-defs.svg#icon-coins"></use>
                    </svg>
                    Max price: ${project.offer}$
                </li>
            </ul>`;
        if (userType === "Customer")
            projectHTML += `
            <div class="project-actions">
                <a class="action-link" href="#" onclick="AddRecommendationTab('projectContainer${count}','${project._id}',${count})">
                    Recommend
                </a>
                <a class="action-link" href="/project/viewDetails/${project._id}">Details</a>
            </div>
            `;
        else if (userType === "Developer") {
            projectHTML += `
            <div class="project-actions">
                <a class="action-link" href="#" onclick="AddRecommendationTab('projectContainer${count}','${project._id}',${count})">Recommend</a>
                <a class="action-link" href="/project/viewDetails/${project._id}">Details</a>
                <a class="action-link" href="#" onclick="AddOfferTab('projectContainer${count}','${project._id}')">Make an Offer</a>
            </div>`;
        }
        if (project.projectVisibility === "Private")
            projectHTML += `</div>`;


        projectsContainer.insertAdjacentHTML('beforeend', projectHTML);
    });
}

function AddOfferTab(containerID, projectID) {
    try {
        document.querySelector('.recommendADeveloper').remove();
    } catch (error) {}
    try {
        document.querySelector(".offerForm").remove();
    } catch (error) {} finally {
        document.querySelector(`#${containerID}`).insertAdjacentHTML('beforeend', `
        <form method="POST" action="/project/insertOffer/${projectID}" class="offerForm">
            <div class="makeOfferContainer">
                <label class="offerLabel" for="developerOffer">Write your offer and press submit!</label>
                <input class="inputLabel" id="developerOffer" name="developerOffer" type="text autocomplete="off">
                <input class="inputLabel" type="submit" value="Submit Offer">
            </div>
        </form>
    `);
    }
}

function AddRecommendationTab(containerID, projectID, count) {
    try {
        document.querySelector('.recommendADeveloper').remove();
    } catch (error) {}
    try {
        document.querySelector('.makeOfferContainer').remove();
    } catch (error) {

    } finally {
        document.querySelector(`#${containerID}`).insertAdjacentHTML('beforeend', `
        <div class="recommendADeveloper">
            <h3 style='text-align:center'>Select a developer from the following list and recommend this project to them</h3>
            <label for="searchDevForRec${count}">Search a Developer</label>
            <input type="text" id="searchDevForRec${count}" name="searchDevForRec${count}" oninput="UpdateRecommendationList('searchDevForRec${count}','recommendationList${count}','${projectID}')">
            <div class="recommendation-list" id="recommendationList${count}">
            </div>
        </div>
    `);
    }
}

async function UpdateRecommendationList(inputID, recListID, projectID) {
    try {
        let filter = document.querySelector(`#${inputID}`).value;
        let developersRequest = await fetch(`/home/marketplace/getDevelopers/${filter}`);
        let developers = await developersRequest.json();
        developers = developers.developers;
        if(developers.length === 0){
            document.querySelector(`#${recListID}`).innerHTML = "No users were found with this username.";
        }
        else{
            document.querySelector(`#${recListID}`).innerHTML = "";
            developers.forEach(developer => {
                document.querySelector(`#${recListID}`).insertAdjacentHTML('beforeend' , `
                    <div class="Searchprofile">
                        <figure class="searchDevFigure">
                            <img src="../images/${developer.profileImage}">
                        </figure>
                        <p>${developer.username}</p>
                        <a href="/project/recommendDev/${developer.username}/${projectID}" class="recLink">Select</a>
                    </div>
                `);
            });
        }
    } catch (error) {
        console.log(error);
    }
}
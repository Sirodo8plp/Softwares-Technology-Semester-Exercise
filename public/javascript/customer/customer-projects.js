async function getProjects() {
    try {
        let requestData = await fetch("/customer/getProjects");
        let projects = await requestData.json();
        return projects;
    } catch (error) {
        console.error(error);
    }
}

async function showProjects() {
    let projects = await getProjects();
    let HTMLcontainer = document.querySelector('.project-container');
    if (projects.length === 0) {
        let heading = "<h3 class='noProjectsFound'>You have not created any projects yet.</h3>"
        HTMLcontainer.insertAdjacentHTML("afterbegin", heading);
        return
    }
    projects.forEach((project, count) => {
        let projectElement = `
                        <div class="project" id="projectContainer${count}">
                            <div class="project-topRow">
                                <p class="project-offer">
                                    <svg class="p-svg">
                                        <use href="../symbol-defs.svg#icon-coins"></use>
                                    </svg>
                                    ${project.offer}$
                                </p>
                                <h2 class="project-title">${project.title}</h2>
                                <p class="project-date">
                                    <svg class="p-svg">
                                        <use href="../symbol-defs.svg#icon-calendar"></use>
                                    </svg>
                                    ${project.date}
                                </p>
                            </div>
                            <div class="project-descriptionTitle">
                                <h4>Description</h4>
                                <a href="#projectDescription${count}" class="expand" id="expandButton${count}">Expand</a>
                            </div>
                            <p class="project-description" id="projectDescription${count}">${project.description}</p>
                            ${project.technologies === "" ? "" :`
                            <div class="technologies">
                                <h2>Technologies:</h2>
                                <p>${project.technologies}</p>
                            </div>`}`;

                            if(project.offers.length > 0){
                                projectElement += "<h2 style='text-align:center'>Offers</h2>"
                                projectElement += "<div class='project-offers'>"
                                project.offers.forEach(offer => {
                                    projectElement += `
                                    <div ${offer.accepted === true ? "class='offer-accepted'" : ""}>
                                        <p>${offer.username}</p>
                                        <p>${offer.offer}$</p>`;
                                    if(offer.accepted === false && project.acceptedByCustomer === false)
                                        projectElement += `<a class="accept-offer" href="/project/acceptOffer/${offer.username}/${project.title.replace(/\s/g,"_")}">Accept</a></div>`;
                                    else{
                                        projectElement += `</div>`;
                                    }
                                });
                                projectElement += "</div>";
                            }
                            projectElement += `<label id="projectVisibilityLabel${count}" class="switch projectVisibility" for="projectVisibility${count}">Project Visibility: <span id="projectVisibilitySpan${count}">${project.projectVisibility}</span>
                                <span class="slider"><span class="ball"></span></span>
                                <input type="checkbox" class="settingInput" ${project.projectVisibility === "Public" ? "checked" : ""} id="projectVisibility${count}">
                                <span class="slider"><span class="ball"></span></span>
                            </label>
                            <label id="offerVisibilityLabel${count}" class="switch offerVisibility" for="offerVisibility${count}">Offer Visibility: <span id="offerVisibilitySpan${count}">${project.offerVisibility}</span>
                                <span class="slider"><span class="ball"></span></span>
                                <input type="checkbox" class="settingInput" ${project.offerVisibility === "Hidden" ? "" : "checked"} id="offerVisibility${count}">
                                <span class="slider"><span class="ball"></span></span>
                            </label>
                            <p class="category">Category: ${project.category}</p>
                            <p class="subcategory">Subcategory: ${project.subcategory}</p>
                            <div class='project-status project-status-progress'>
                                <svg class="p-svg">
                                    <use href="../symbol-defs.svg#icon-notice"></use>
                                </svg>
                                <p>
                                    ${project.status}
                                </p>
                            </div>
                            <p class="project-duration">Project Development Duration: ${project.projectDevelopmentDuration}</p>
                            <p class="project-payment-type">Payment Type: ${project.paymentType}</p>
                            <p class="project-offer-duration">Offer Duration: ${project.offerDuration} days</p>
                            <label id="acceptedByDevLabel${count}" class="switch acceptedByDev ${project.acceptedByDeveloper ? "" : "disabled"}" for="acceptedByDev${count}">Accepted by Developer: ${project.acceptedByDeveloper ? "Yes" : "No"}
                                <span class="slider"><span class="ball"></span></span>
                                <input type="checkbox" class="settingInput" ${project.acceptedByDeveloper ? "checked" : ""} id="acceptedByDev${count}">
                                <span class="slider"><span class="ball"></span></span>
                            </label>
                            <label id="completedByDevLabel${count}" class="switch completedByDev ${project.completedByDeveloper ? "" : "disabled"}" for="completedByDev">Completed By Developer: ${project.completedByDeveloper ? "Yes" : "No"}
                                <span class="slider"><span class="ball"></span></span>
                                <input type="checkbox" class="settingInput" ${project.completedByDeveloper ? "checked" : ""} id="completedByDev${count}">
                                <span class="slider"><span class="ball"></span></span>
                            </label>
                            <p class="acceptedByCustomer" id="acceptedByCustomer${count}">Accepted By You: ${project.acceptedByCustomer ? "Yes" : "No"}</p>
                            <p class="completedByCustomer" id="completedByCustomer${count}">Completed By You: ${project.completedByCustomer ? "Yes" : "No"}</p>
                            ${project.status === "In Progress" ? `
                                        <a href='#cancelProjectContainer${count}' class='cancelProject' onclick="openProjectCancellation('cancelProjectContainer${count}')">Cancel Project</a>
                                        <div class="cancel-project-hide" id="cancelProjectContainer${count}">
                                            <p class="warning"><span class="attention-span">Attention: </span>
                                                Cancelling a project while a developer has already accepted it and began to work on it may lead to violation of our terms and conditions. In such a case, you will have to pay the developer the respected money he deserves by hour. You will be notified by email should this happen. By clicking 'Accept' you agree to this statement.
                                            </p>
                                            <a href="/project/customer/cancelProject/${project._id}" class="confirm">Accept</a>
                                            <a class="back" onclick="closeProjectCancellation('cancelProjectContainer${count}')">Back</a>
                                        </div>

                            ` : ""}
                    </div>
        `;
        HTMLcontainer.insertAdjacentHTML('beforeend', projectElement);
        ExpandProjectDescription('expandButton' + count, 'projectContainer' + count);
        ChangeProjectsVisibility(project._id, `projectVisibilitySpan${count}`, `projectVisibility${count}`);
        ChangeOfferVisibility(project._id, `offerVisibilitySpan${count}`, `offerVisibility${count}`);
        ChangeAcceptedByCustomer(project._id, `acceptedByDevLabel${count}`, `acceptedByCustomer${count}`, `acceptedByDev${count}`);
        ChangeCompletedByCustomer(project._id , `completedByDevLabel${count}` , `completedByCustomer${count}` , `completedByDev${count}`)
    });
}

showProjects().then(() => {
    try {
        let anchorID = window.location.href;
        anchorID = anchorID.split("#")[1];
        location.hash = "#" + anchorID;
    } catch (e) {}
});

function ExpandProjectDescription(expandButtonID, projectContainerID) {
    document.querySelector(`#${expandButtonID}`).addEventListener('click', () => {
        let projectContainer = document.querySelector(`#${projectContainerID}`);
        if (projectContainer.classList.contains('project-expand-description')) {
            projectContainer.classList.remove('project-expand-description')
            document.querySelector(`#${expandButtonID}`).innerHTML = "Expand";
        } else {
            projectContainer.classList.add('project-expand-description');
            document.querySelector(`#${expandButtonID}`).innerHTML = "Shrink";
        }
    })
}

function ChangeProjectsVisibility(projectID, spanID, inputID) {
    let input = document.querySelector(`#${inputID}`);
    input.addEventListener('click', () => {
        MakeFetchRequestForChanges(`/project/changeProjectsVisibility/${projectID}/${input.checked === true ? "Public" : "Private"}`);
        document.querySelector(`#${spanID}`).innerHTML = `${input.checked === true ? "Public" : "Private"}`;
    });
}

function ChangeOfferVisibility(projectID, spanID, inputID) {
    let input = document.querySelector(`#${inputID}`);
    input.addEventListener('click', () => {
        MakeFetchRequestForChanges(`/project/changeOfferVisibility/${projectID}/${input.checked === true ? "Visible" : "Hidden"}`);
        document.querySelector(`#${spanID}`).innerHTML = `${input.checked === true ? "Visible" : "Hidden"}`
    });
}

function ChangeAcceptedByCustomer(projectID, labelID, paragraphID, inputID) {
    let input = document.querySelector(`#${inputID}`);
    let label = document.querySelector(`#${labelID}`);
    input.addEventListener('click', (e) => {
        if (label.classList.contains("disabled")) {
            e.preventDefault();
        } else {
            MakeFetchRequestForChanges(`/project/changeAcceptedByCustomer/${projectID}/${input.checked === true ? true : false}`);
            document.querySelector(`#${paragraphID}`).innerHTML = `${input.checked === true ? "Yes" : "No"}`;
        }
    })
}

function ChangeCompletedByCustomer(projectID, labelID, paragraphID, inputID) {
    let input = document.querySelector(`#${inputID}`);
    let label = document.querySelector(`#${labelID}`);
    input.addEventListener('click', (e) => {
        if (label.classList.contains("disabled")) {
            e.preventDefault();
        } else {
            MakeFetchRequestForChanges(`/project/changeCompletedByCustomer/${projectID}/${input.checked === true ? true : false}`);
            document.querySelector(`#${paragraphID}`).innerHTML = `${input.checked === true ? "Yes" : "No"}`;
        }
    })
}

function openProjectCancellation(containerID){
    document.querySelector(`#${containerID}`).classList.add("cancel-project-show");
}

function closeProjectCancellation(containerID){
    document.querySelector(`#${containerID}`).classList.remove("cancel-project-show");
}

async function MakeFetchRequestForChanges(fetchLink) {
    try {
        let fetchRequest = await fetch(fetchLink);
        let response = await fetchRequest.json();
        if (response.message === "Change was successful");
        else {
            alert("An error occured.Sorry fam.");
        }
    } catch (error) {
        alert("An error occured.Sorry fam.");
    }
}














document.querySelector('#ProjectsTab').classList.add('selectedTab');
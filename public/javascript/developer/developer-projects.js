async function getProjects() {
    try {
        let requestData = await fetch("/developer/getProjects");
        let projects = await requestData.json();
        return projects;
    } catch (error) {
        console.error(error);
    }
}



function addExpansionOption(linkID, descriptionID) {
    document.querySelector(`#${linkID}`).addEventListener('click', (event) => {
        event.preventDefault();
        let descriptionParagraph = document.querySelector(`#${descriptionID}`);
        let expandButton = document.querySelector(`#${linkID}`);
        if (expandButton.innerHTML === "Expand") {
            expandButton.innerHTML = "Minimize";
            descriptionParagraph.classList.add('project-description-expand');
        } else {
            expandButton.innerHTML = "Expand";
            descriptionParagraph.classList.remove('project-description-expand');
        }
    });
}

function addTermsAndConditionsFunctionality(showTACbutton, showTACcontainer, agreeTAC, finalizeTAC, cancelTAC) {
    document.querySelector(`#${showTACbutton}`).addEventListener('click', (event) => {
        document.querySelector(`#${showTACcontainer}`).style.display = "block";
        document.querySelector(`#${agreeTAC}`).addEventListener('click', (e) => {
            if (document.querySelector(`#${agreeTAC}`).checked === true)
                document.querySelector(`#${finalizeTAC}`).classList.add('finalizeProject-ready');
            else
                document.querySelector('.finalizeProject-waiting').classList.remove('finalizeProject-ready');

        });
        document.querySelector(`#${cancelTAC}`).addEventListener('click', () => {
            document.querySelector(`#${showTACcontainer}`).style.display = "none";
        });
    });
}

async function showProjects() {
    let projects = await getProjects();
    let HTMLcontainer = document.querySelector('.projects-container');
    if (projects.length === 0) {
        let heading = "<h4>Seems like you have not embarked on any projects yet. Try to look in the marketplace and see if anything fits you.</h4>"
        HTMLcontainer.insertAdjacentHTML("afterbegin", heading);
        return
    }
    projects.forEach((project, count) => {
        let HTMLproject = `
            <div class="project" id="${"project-container" + count}">
                <p class="project-price">Price: ${project.offer}$</p>
                <h2 class="project-title">${project.title}</h2>
                <p class="project-date">Date: ${project.date.split("T")[0]}</p>
                <div class="project-descriptionTitle">
                    <h4>Description</h4>
                    <a href="#" class="expand" id=${"project"+count}>Expand</a>
                </div>
                <p class="project-description" id=${"projectDescription"+count}>${project.description}</p>
                <div class="project-technologies">
                    <h4>Technologies:</h4>
                    <p>${project.technologies}</p>
                </div>
                <p class="project-category">${project.category}</p>
                <p class="project-subcategory">${project.subcategory}</p>`;
        if (project.status === "In Progress") {
            HTMLproject += `
                <div class='project-status project-status-progress'>
                    <svg>
                    <use href="../symbol-defs.svg#icon-notice"></use>
                </svg>
                    <p>
                        Project Status: ${project.status}
                    </p>
                </div>
                <div class="project-actions">
                    <a href="#cancelTAC" class="complete-project" id=${"showTACbutton"+count}>Complete Project</a>
                    <a href="/developer/cancelProject/${project._id}" class="cancel-project">Cancel Project</a>
                </div>
                <div class="complete-project-terms" id=${"showTACcontainer" + count}>
                    <p class="complete-project-text">
                        <span class="attention">Attention:</span> Should the project not be finished or not be meeting the customer's 
                        final and agreed requirements, any payments that have been made will be undone, your account will be temporarily suspended and it might even get permanently locked. <span class="attention2">Depending on the case, the customer may have the right to prosecute a lawsuit against you!</span>
                    </p>
                    <input type="checkbox" name="agreementCheckbox" id="${"agreeTAC" + count}">
                    <label for="${"agreeTAC" + count}">By ticking the box you agree to the above statement and/or to further consequences.</label>
                    <a href="/project/developer/completeProject/${project._id}" class="finalizeProject-waiting" id="${"finalize"+count}">Continue</a>
                    <a href="#${"project-container" + count}" class="cancel-terms" id="${"cancelTAC" + count}">Cancel</a>
                </div>
            </div>`;
        } else if (project.status === "Cancelled")
            HTMLproject += `
                <div class='project-status project-status-cancelled'>
                    <svg>
                        <use href="../symbol-defs.svg#icon-notice"></use>
                    </svg>
                    <p>
                        Project Status: ${project.status}
                    </p>
                </div>
            </div>`;

        else
            HTMLproject += `
                <div class='project-status project-status-completed'>
                    <svg>
                        <use href="../symbol-defs.svg#icon-notice"></use>
                    </svg>
                    <p>
                        Project Status: ${project.status}
                    </p>
                </div>
            </div>`;
        HTMLcontainer.insertAdjacentHTML("beforeend", HTMLproject);
        addExpansionOption("project" + count, "projectDescription" + count);
        if (project.status === "In Progress")
            addTermsAndConditionsFunctionality("showTACbutton" + count, "showTACcontainer" + count, "agreeTAC" + count, "finalize" + count, "cancelTAC" + count);
    });
    HTMLcontainer.insertAdjacentHTML("beforeend", `
    <div class="options">
        <a href="/developer/offers" class="navLink">View the Offers you have made</a>
        <a href="/developer/general" class="navLink">Return to General tab</a>
    </div>`);
}

showProjects().then( () => {
    try{
        let anchorID = window.location.href;
        anchorID = anchorID.split("#")[1];
        location.hash = "#" + anchorID;
    }
    catch(e){}
});

document.querySelector('#ProjectsTab').classList.add('selectedTab');
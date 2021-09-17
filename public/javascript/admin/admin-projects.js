async function GetProjects() {
    try {
        let fetchRequest = await fetch("/admin/getProjects");
        let response = await fetchRequest.json();
        return response;
    } catch (error) {
        console.error(error);
    }
}

async function showProjects() {
    try {
        let projects = await GetProjects();
        projects = projects.projects;
        let projectContainer = document.querySelector('.customer-profiles-container')
        if(projects.length > 0){
            projects.forEach(project => {
                projectContainer.insertAdjacentHTML('beforeend' , `
                    <div class="customer">
                        <figure class="customer-figure">
                            <img src="../images/project.png" alt="ProjectImage">
                        </figure>
                        <p>Title: ${project.title}</p>
                        <p>Project Owner: ${project.projectOwner}</p>
                        <p>Category: ${project.category}</p>
                        <p>Subcategory: ${project.subcategory}</p>
                        <a href="/admin/deleteProject/${project._id}" class="delete-link">Delete</a>
                    </div>
                `);
            });
        }
        else {
            projectContainer.innerHTML = `
            <h2 style="text-align:center;">No projects were found.</h2>
            `
        }
    } catch (error) {
        console.log(error);
    }
}

showProjects();

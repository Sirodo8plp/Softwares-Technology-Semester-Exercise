async function getNotifications() {
    try {
        let fetchRequest = await fetch("/customer/getNotifications");
        let notifications = await fetchRequest.json();
        return notifications;
    } catch (error) {
        console.log(error)
    }
}

async function showNotifications() {
    let notifications = await getNotifications();
    document.querySelector('#NotificationsContainerTitle').innerHTML = `Notifications(${notifications.length})`;
    let container = document.querySelector('#notifications-container');
    if (notifications.length === 0) {
        container.innerHTML = "<h2 style='text-align:center'>You do not have any notifications.</h2>"
        return;
    }
    notifications.forEach(notification => {
        container.insertAdjacentHTML('beforeend' , `
        <div class="notification">
            <div class="notification-minor-info">
                <p>
                    <svg class="p-svg">
                        <use href="../symbol-defs.svg#icon-profile"></use>
                    </svg>
                    From: ${notification.fromUser}
                </p>
                <p>
                    <svg class="p-svg">
                        <use href="../symbol-defs.svg#icon-calendar"></use>
                    </svg>
                    ${notification.date}
                </p>
            </div>
            <p class="notification-text">${notification.notification}</p>
            ${notification.actions}
        </div>`);
    });
}

async function getProjects() {
    try {
        let fetchRequest = await fetch("/customer/getProjects");
        let projects = await fetchRequest.json();
        return projects;
    } catch (error) {
        console.log(error)
    }
}

async function showProjects() {
    let projects = await getProjects();
    console.log("projects: " + projects);
    document.querySelector('#ProjectsContainerTitle').innerHTML = `Projects(${projects.length})`;
    let projectsContainer = document.querySelector('#projects-container');
    if (projects.length === 0) {
        projectsContainer.innerHTML = "<h2 style='text-align:center'>You have not created any projects yet.</h2>"
        return;
    }
    projects.forEach((project, count) => {
        projectsContainer.insertAdjacentHTML("beforeend", `
        <div class="container">
            <p>
                <svg class="p-svg">
                    <use href="../symbol-defs.svg#icon-calendar"></use>
                </svg>
                ${project.date}
            </p>
            <h2>
                <abbr title="${project.title}">${project.title.substring(0,8)}</abbr>
            </h2>
            <p>
                <svg class="p-svg">
                    <use href="../symbol-defs.svg#icon-info"></use>
                </svg>
                Status: ${project.status}
            </p>
            <a href="/customer/projects#${"project-container"+count}" class="view-link">View</a>
        </div>
        `);
    });
}

showNotifications();
showProjects();









document.querySelector('#GeneralTab').classList.add('selectedTab');
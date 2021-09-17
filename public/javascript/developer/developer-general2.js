document.querySelector('#GeneralTab').classList.add('selectedTab');

/***********************************************************/
/***********************GET THE DATA***********************/
/*********************************************************/

async function getDataFromServer(link) {
    try {
        let requestData = await fetch(link);
        let projects = await requestData.json();
        return projects;
    } catch (error) {
        console.error(error);
    }
}

async function showProjects() {
    let projects = await getDataFromServer("/developer/getProjects");
    let projectsContainer = document.querySelector('#projects-container');
    if (projects.length === 0) {
        projectsContainer.previousElementSibling.previousElementSibling.innerHTML = "Projects(0)";
    } else
        projects.forEach((project, count) => {
            projectsContainer.insertAdjacentHTML("beforeend", `
        <div class="container">
            <p>
                <svg class="p-svg">
                    <use href="../symbol-defs.svg#icon-calendar"></use>
                </svg>
                ${project.date.split("T")[0]}
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
            <a href="/developer/projects#${"project-container"+count}" class="view-link">View</a>
        </div>
        `);
        });
}

async function showComments() {
    let comments = await getDataFromServer("/developer/getComments");
    comments = comments.comments;
    let commentsContainer = document.querySelector('#comments-container');
    if (comments.length === 0) {
        commentsContainer.previousElementSibling.previousElementSibling.innerHTML = "Comments(0)";
    } else
        comments.forEach((comment, count) => {
            commentsContainer.insertAdjacentHTML("beforeend", `
        <div class="container">
            <p>
                <svg class="p-svg">
                    <use href="../symbol-defs.svg#icon-chat"></use>
                </svg>
                ${comment.date}
            </p>
            <p>${comment.comment}</p>
            <p>
                <svg class="p-svg">
                    <use href="../symbol-defs.svg#icon-info"></use>
                </svg>
                By : ${comment.fromUser}
            </p>
        </div>
        `);
        });
}

async function showRatings() {
    let ratings = await getDataFromServer("/developer/getRatings");
    ratings = ratings.ratings
    let ratingsContainer = document.querySelector('#ratings-container');
    if (ratings.length === 0) {
        ratingsContainer.previousElementSibling.previousElementSibling.innerHTML = "Ratings(0)";
    } else
    ratings.forEach((rating, count) => {
            ratingsContainer.insertAdjacentHTML("beforeend", `
        <div class="container">
            <p>
                <svg class="p-svg">
                    <use href="../symbol-defs.svg#icon-chat"></use>
                </svg>
                ${rating.date}
            </p>
            <p>${rating.rating}</p>
            <p>
                <svg class="p-svg">
                    <use href="../symbol-defs.svg#icon-info"></use>
                </svg>
                By : ${rating.fromUser}
            </p>
        </div>
        `);
        });
}

async function showNotifications() {
    let notifications = await getDataFromServer("/developer/getNotifications");
    let container = document.querySelector('#notifications-container');
    if (notifications.length === 0) {
        container.previousElementSibling.previousElementSibling.innerHTML = "Notifications(0)";
    } else
        notifications.forEach(notification => {
            container.insertAdjacentHTML('beforeend', `
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

async function showAllData() {
    await showProjects();
    await showNotifications();
    await showComments();
    await showRatings();
}

showAllData();
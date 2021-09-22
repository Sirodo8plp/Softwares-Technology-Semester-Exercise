require('dotenv').config();
const Project = require(__dirname + "/../models/project").projectModel;
const Notification = require(__dirname + "/../models/notification").notificationModel;

module.exports.checkExistence = async (req, res) => {
    try {
        let project = await Project.find({
            title: req.params.title
        });
        if (project.title == undefined) {
            res.json({
                message: "No project exists with this title."
            });
            return;
        }
        res.json({
            message: "Project With this Title already exists."
        });
    } catch (error) {
        console.error(error);
        res.json({
            message: "An error occured with the database. Please try again later!"
        });
    }
}

module.exports.completeProject = async (req, res) => {
    try {
        let project = new Project({
            projectOwner: res.app.locals.user.username,
            developer: "",
            acceptedByDeveloper: false,
            acceptedByCustomer: false,
            completedByDeveloper: false,
            completedByCustomer: false,
            title: req.body.title,
            description: req.body.description,
            date: new Date().toLocaleDateString(),
            offer: req.body.price,
            technologies: req.body.tags,
            projectVisibility: req.body.type,
            offerVisibility: req.body.visibility,
            category: req.body.category,
            subcategory: req.body.subcategory,
            status: "In Progress",
            paymentType: req.body.paymentType,
            offerDuration: req.body.offerDuration,
            projectDevelopmentDuration: req.body.duration,
            offers: [],
            oldOffer: ""
        });

        await project.save();
        res.json({
            message: "Project has successfully been registered."
        });
    } catch (error) {
        console.error(error);
        res.json({
            message: "An error has occured with the Database."
        });
    }
}

module.exports.changeProjectsVisibility = async (req, res) => {
    try {
        await Project.findByIdAndUpdate({
            _id: req.params.id
        }, {
            projectVisibility: req.params.newValue
        });
        res.json({
            message: "Change was successful"
        });
    } catch (error) {
        res.json({
            message: "An error occured with the database. Please try again later."
        });
    }
}

module.exports.changeOfferVisibility = async (req, res) => {
    try {
        await Project.findByIdAndUpdate({
            _id: req.params.id
        }, {
            offerVisibility: req.params.newValue
        });
        res.json({
            message: "Change was successful"
        });
    } catch (error) {
        res.json({
            message: "An error occured with the database. Please try again later."
        });
    }
}

module.exports.changeAcceptedByCustomer = async (req, res) => {
    try {
        await Project.findByIdAndUpdate({
            _id: req.params.id
        }, {
            acceptedByCustomer: req.params.newValue
        });
        res.json({
            message: "Change was successful"
        });
    } catch (error) {
        res.json({
            message: "An error occured with the database. Please try again later."
        });
    }
}

module.exports.changeCompletedByCustomer = async (req, res) => {
    try {
        await Project.findByIdAndUpdate({
            _id: req.params.id
        }, {
            completedByCustomer: req.params.newValue
        });
        res.json({
            message: "Change was successful"
        });
    } catch (error) {
        res.json({
            message: "An error occured with the database. Please try again later."
        });
    }
}

module.exports.cancelProjectCustomer = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);
        console.log(project);
        if (project.developer !== "") {
            let notification = new Notification({
                fromUser: req.app.locals.user.username,
                toUser: project.developer,
                notification: `${req.app.locals.user.username} cancelled the project called '${project.title}'`,
                date: new Date().toLocaleDateString(),
                projectInvolved: project.title,
                actions: `
                    <a class="view-link" href="/developer/removeNotification/${req.app.locals.user.username}" 
                    style='text-align:center'>Remove</a>`
            });
            await notification.save();
        }
        await Project.findByIdAndUpdate({
            _id: req.params.id,
        }, {
            status: "Cancelled"
        });
        res.redirect("/customer/projects");
    } catch (error) {
        console.error(error)
    }
}

module.exports.getFreeTags = async (req, res) => {
    try {
        let projectsTechnologyTagsRaw = await Project.find({}, "technologies");
        let tagsRaw = [];
        counter = 0;
        projectsTechnologyTagsRaw.forEach((tagObj) => {
            tagObj.technologies.split(",").forEach(tech => {
                tagsRaw[counter] = tech;
                counter++;
            });
        });
        let tags = [...new Set(tagsRaw)];
        res.json(tags);
    } catch (error) {
        res.json({
            message: "An error occured with the database."
        });
    }
}

module.exports.marketplaceGetProjects = async (req, res) => {
    try {
        let projects = await Project.find({
            acceptedByCustomer: false
        });
        let userType;
        try {
            userType = req.app.locals.user.type;
        } catch (error) {
            userType = "Guest";
        }
        res.json({
            projects,
            userType
        });
    } catch (error) {
        console.error(error);
        res.json({
            message: "An error occured with the database."
        });
    }
}

module.exports.applyFilters = async (req, res) => {
    let category = req.body.category;
    let subcategory = req.body.subcategory;
    let technologies = req.body.technologies;

    if (category === "")
        category = /[a-zA-Z]/i;
    else
        category = new RegExp(category, 'i');

    if (subcategory === "")
        subcategory = /[a-zA-Z]/i;
    else
        subcategory = new RegExp(subcategory, 'i');

    let filters = {
        category,
        subcategory,
        acceptedByCustomer: false
    };
    let projects = await Project.find(filters);
    if (technologies !== "") {
        technologies = technologies.split(",");
        projects = projects.filter((project) => {
            if (project.technologies === "") return false;
            let projectsTechnologies = project.technologies.split(",");
            for (let i = 0; i < technologies.length; i++)
                if (!projectsTechnologies.includes(technologies[i]))
                    return false;
            return true;
        });
    }

    let userType;
    try {
        userType = req.app.locals.user.type;
    } catch (error) {
        userType = "Guest";
    }
    res.json({
        projects,
        userType
    });
}

module.exports.insertOffer = async (req, res) => {
    let projectID = req.params.id;
    let developerUsername = req.app.locals.user.username;
    let project = await Project.findOne({
        _id: projectID
    });
    let flag = false;
    let newOffers = project.offers
    newOffers.forEach(offer => {
        if (offer.username === developerUsername) {
            offer.offer = req.body.developerOffer;
            flag = true;
        }
    });
    if (!flag) {
        newOffers.push({
            username: developerUsername,
            offer: req.body.developerOffer,
            accepted: false
        });
    }
    let newProject = await Project.findOneAndUpdate({
        _id: projectID
    }, {
        offers: newOffers
    }, {
        new: true
    });
    //The end: Project is Updated. Now fix notifications
    await Notification.deleteMany({
        fromUser: developerUsername,
        projectInvolved: newProject.title
    });
    let notification = new Notification({
        fromUser: developerUsername,
        toUser: newProject.projectOwner,
        notification: `${developerUsername} has made an offer to your project called '${newProject.title}'`,
        date: new Date().toLocaleDateString(),
        projectInvolved: newProject.title,
        actions: `
            <a class="view-link" href="/project/acceptOffer/${developerUsername}/${newProject.title.replace(/\s/g,"_")}" style='text-align:center'>Accept Offer</a>
            <a class="view-link" href="/customer/removeNotification/${developerUsername}" style='text-align:center'>Remove</a>
        `
    });
    await notification.save();
    res.redirect("/home/marketplace");
}

module.exports.acceptOffer = async (req, res) => {
    let projectTitle = req.params.projectTitle;
    projectTitle = projectTitle.replace(/_/g, " ");

    let developerUsername = req.params.username;
    let project = await Project.findOne({
        title: projectTitle
    });
    project.offers.forEach(offer => {
        if (offer.username === developerUsername) {
            offer.accepted = true;
        }
    });
    project.acceptedByCustomer = true;
    project.markModified('offers');
    await project.save();
    await Notification.deleteMany({
        projectInvolved: project.title
    });
    let notification = new Notification({
        fromUser: req.app.locals.user.username,
        toUser: developerUsername,
        notification: `${project.projectOwner} has accepted your offer in '${project.title}'.Seal the deal!`,
        date: new Date().toLocaleDateString(),
        projectInvolved: project.title,
        actions: `
        <a class="view-link" href="/project/DeveloperCompletesOffer/${developerUsername}/${project.title.replace(/\s/g,"_")}" style='text-align:center'>Accept Project</a>
        <a class="view-link" href="/project/DeveloperCancellsOffer/${developerUsername}/${project.title.replace(/\s/g,"_")}" style='text-align:center'>Cancel Offer</a>`
    });
    await notification.save();
    res.redirect('/customer/general');
}

module.exports.DeveloperCompletesOffer = async (req, res) => {
    try {
        let developerUsername = req.params.developerUsername;
        let projectTitle = req.params.projectTitle;
        projectTitle = projectTitle.replace(/_/g, " ");
        let project = await Project.findOne({
            title: projectTitle
        });
        console.log(project);
        let oldOffer = project.offer;
        let finalOffer = "";
        for (let i = 0; i < project.offers.length; i++) {
            if (project.offers[i].username === developerUsername) {
                finalOffer = project.offers[i].offer;
                project.offers = project.offers.slice(i);
                break;
            }
        }
        project.markModified('offers');
        await Project.findOneAndUpdate({
            title: projectTitle
        }, {
            offer: finalOffer,
            acceptedByDeveloper: true,
            developer: developerUsername,
            oldOffer: oldOffer
        });
        await Notification.deleteMany({
            projectInvolved: project.title
        });
        let notification = new Notification({
            fromUser: req.app.locals.user.username,
            toUser: project.projectOwner,
            notification: `${developerUsername} has accepted the offer and is ready to commence development in '${project.title}'`,
            date: new Date().toLocaleDateString(),
            projectInvolved: project.title,
            actions: `
        <a class="view-link" href="/customer/removeNotification/${developerUsername}" style='text-align:center'>Remove</a>
    `
        });
        await notification.save();
        res.redirect("/developer/general");
    } catch (error) {
        console.error(error);
    }
}

module.exports.DeveloperCancellsOffer = async (req, res) => {
    try {
        let developerUsername = req.params.username
        let projectTitle = req.params.projectTitle;
        projectTitle = projectTitle.replace(/_/g, " ");
        let project = await Project.findOne({
            title: projectTitle
        });
        let newOffers = project.offers
        newOffers.forEach((offer, count) => {
            if (offer.username === developerUsername)
                newOffers.slice(count, 1);
        });
        await Project.findOneAndUpdate({
            title: projectTitle
        }, {
            offer: project.oldOffer,
            offers: newOffers,
            developer: "",
            acceptedByCustomer: false,
            acceptedByDeveloper: false,
            oldOffer: ""
        });

        await Notification.deleteMany({
            projectInvolved: project.title
        });

        let notification = new Notification({
            fromUser: developerUsername,
            toUser: project.projectOwner,
            notification: `${developerUsername} has cancelled their offer in '${project.title}'`,
            date: new Date().toLocaleDateString(),
            link: `/customer/removeNotification/${developerUsername}`,
            projectInvolved: project.title,
            actions: `
        <a class="view-link" href="/customer/removeNotification/${developerUsername}" style='text-align:center'>Remove</a>
    `
        });
        await notification.save();
        res.redirect("/developer/general");
    } catch (error) {
        console.error(error);
    }
}

module.exports.recommendProject = async (req, res) => {
    let developerUsername = req.params.developerUsername;
    let projectID = req.params.projectID;
    let project = await Project.findOne({
        _id: projectID
    });

    let notification = new Notification({
        fromUser: req.app.locals.user.username,
        toUser: developerUsername,
        notification: `${req.app.locals.user.username} has recommended '${project.title}' to you!`,
        date: new Date().toLocaleDateString(),
        actions: `
        <a class="view-link" href="/home/viewProject/${projectID}" style='text-align:center'>View Project</a>
        <a class="view-link" style='text-align:center' href="/developer/removeNotification/${req.app.locals.user.username}" style='text-align:center'>Remove</a>`
    });
    await notification.save();
    res.redirect('/home/marketplace');
}

module.exports.viewDetails = async (req, res) => {
    let projectID = req.params.projectID;
    let project = await Project.findOne({
        _id: projectID
    });
    res.render(
        "viewSearchResult/viewProject", {
            project
        });
}

module.exports.devCompletedProject = async (req, res) => {
    let projectID = req.params.projectID;
    const filter = {
        _id: projectID,
    }
    const update = {
        status: "Completed",
        completedByDeveloper: true
    }
    let project = await Project.findOne(filter);

    await Notification.deleteMany({projectInvolved: project.title});
    
    let notification = new Notification({
        fromUser: req.app.locals.user.username,
        toUser: project.projectOwner,
        notification: `${req.app.locals.user.username} has completed '${project.title}'`,
        date: new Date().toLocaleDateString(),
        projectInvolved: project.title,
        actions: `
        <a class="view-link" href="/project/customer/completeProject/${projectID}" 
        style='text-align:center'>Agree to completion</a>
        <a class="view-link" href="/customer/removeNotification/${req.app.locals.user.username}" 
        style='text-align:center'>Remove</a>`
    });
    await notification.save();
    await Project.findOneAndUpdate(filter, update);
    res.redirect('/developer/projects');
}

module.exports.custCompletedProject = async (req,res) => {
    let projectID = req.params.projectID;
    const filter = {
        _id: projectID,
    }
    const update = {
        status: "Completed",
        completedByCustomer: true
    }
    let project = await Project.findOne(filter);

    await Notification.deleteMany({projectInvolved: project.title});

    let notification = new Notification({
        fromUser: req.app.locals.user.username,
        toUser: project.developer,
        notification: `${req.app.locals.user.username} has agreed to complete '${project.title}'.`,
        date: new Date().toLocaleDateString(),
        projectInvolved: project.title,
        actions: `
        <a class="view-link" href="/developer/removeNotification/${req.app.locals.user.username}" 
        style='text-align:center'>Remove</a>`
    });
    await notification.save();
    await Project.findOneAndUpdate(filter, update);
    res.redirect('/customer/projects');
}
require('dotenv').config();
const express = require("express");
const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const login = require('./routers/loginRoutes');
const validateUser = require('./routers/verifyUser');
const userSignsInToContact = require('./routers/userSignsInToContact');
const DeveloperRoutes = require('./routers/DeveloperRoutes');
const CustomerRoutes = require("./routers/customerRoutes");
const homeRoutes = require('./routers/homeRoutes');
const contactPNroutes = require('./routers/contactPNroutes');
const ProjectRoutes = require('./routers/ProjectRoutes');
const AdminRoutes = require("./routers/AdminRoutes");

let mongoOptions = {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
};
const mongoose = require('mongoose');

app.listen(3000, async () => {
    console.clear();
    console.log("Server started");
    await mongoose.connect(process.env.MONGO_CONNECTION_URL, mongoOptions);
});

app.get('/exceptionRaised', (req, res) => {
    res.render('errors/exceptionOccured');
});

app.use(homeRoutes);
app.use(login);
app.use(DeveloperRoutes);
app.use(CustomerRoutes);
app.use('/loginForContact', userSignsInToContact);
app.use('/verifyEmailAddress', validateUser);
app.use(contactPNroutes);
app.use(ProjectRoutes);
app.use(AdminRoutes);


app.get('/a1', (req, res) => {
    res.render('viewSearchResult/viewProject');
});

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected on app termination');
        process.exit(0);
    });
});

app.get('*', (req, res) => {
    res.render('errors/notfound');
});
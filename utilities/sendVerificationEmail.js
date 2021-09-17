const nodemailer = require("nodemailer");
const hiddenData = require(__dirname + "/../data.js");
let DATA = new hiddenData();

// async..await is not allowed in global scope, must use a wrapper
async function main(clientEmail,clientUsername) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: DATA.getEmailAddress(),
            pass: DATA.getEmailPassword()
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"ProjectsNest 👻" <projects@nest.com>', // sender address
        to: clientEmail, // list of receivers
        subject: `Welcome ${clientUsername}, please verify your email address!`,
        text: "Click the link below to verify your account in projectsNest.com", // plain text body
        html: `<b>ProjectsNest </b><br> Create anything as soon as possible 👽<br><br><br> Click the link below to verify your email address: <a href="localhost:3000/verifyEmailAddress/${clientUsername}">Verification link for ${clientUsername}</a>.`
    });
    console.log("Message sent: %s", info.messageId);
}

module.exports = main;
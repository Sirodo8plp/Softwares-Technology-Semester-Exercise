const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage( {
    destination: './public/cvs',
    limits: {fileSize: 100000000},
    fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    },
    filename: function(req,file,cb) {
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

//Check File Type

function checkFileType(file, cb){
    // Allow ext
    const filetypes = /docx|doc|txt|pdf/;
    //Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //check mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    }
    else {
        cb('Error: Documents Only!');
    }
}

//Init Upload
const upload = multer({
    storage: storage
}).single('cv');

module.exports = upload;
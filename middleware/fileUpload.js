const util = require("util");
const multer = require("multer");

const DIR = './public/uploads/';

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    },
});

let upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: (req, file, cb) => {
        if ( file.mimetype.includes("excel") || file.mimetype.includes("spreadsheetml")) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Please upload only excel file.'));
        }
    }
}).single("file");

let fileUploadMiddleware = util.promisify(upload);

module.exports = fileUploadMiddleware;
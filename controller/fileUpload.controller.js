const upload = require("../middleware/fileUpload");

const URL = "http://localhost:8090/get-cfiles/";
const fs = require("fs");
const readXlsxFile = require('read-excel-file/node');
const sheetsSchema = require('./scheduleTemplateSchema');

const uploadFile = async (req, res) => {
  try {
    await upload(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Choose a file to upload" });
    }
    readXlsxFile(fs.createReadStream('./public/uploads/'+req.file.originalname), { getSheets: true }).then((sheets) => {
      if(sheets.length == 0 && sheets[0].name == "Guests" && sheets[1].name == "Stages" && sheets[0].name == "Schedule"){
        res.status(500).send({
          message: `Error occured: The excel file has incorrect number of sheets or names of sheets`,
        });
      }
    })

    // Readable Stream.
    readXlsxFile(fs.createReadStream('./public/uploads/'+req.file.originalname), {schema: sheetsSchema.Guest, sheet: "Guest"}).then(({ rows, errors }) => {
      if(errors.length != 0){
        res.status(500).send({
          message: `Error occured: The excel sheet Guest has incorrect format`,
        });
      }  
      
    })

    res.status(200).send({
      message: "File uploaded successfully: " + req.file.originalname,
    });
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size should be less than 5MB",
      });
    }

    res.status(500).send({
      message: `Error occured: ${err}`,
    });
  }
};

const getFilesList = (req, res) => {
  const path = __basedir + "/public/uploads/";

  fs.readdir(path, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Files not found.",
      });
    }

    let filesList = [];

    files.forEach((file) => {
      filesList.push({
        name: file,
        url: URL + file,
      });
    });

    res.status(200).send(filesList);
  });
};

const downloadFiles = (req, res) => {
    const fileName = req.params.name;
    const path = __basedir + "/public/uploads/";
  
    res.download(path + fileName, (err) => {
      if (err) {
        res.status(500).send({
          message: "File can not be downloaded: " + err,
        });
      }
    });
};

module.exports = { uploadFile, downloadFiles, getFilesList };
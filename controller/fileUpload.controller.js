const upload = require("../middleware/fileUpload");

const URL = "http://localhost:8090/get-cfiles/";
const fs = require("fs");
const readXlsxFile = require('read-excel-file/node');
const sheetsSchema = require('./scheduleTemplateSchema');
const sqlInsert = require('./sqlInsertController');
const errorHandling = require('../ErrorHandling/errorHandling');

const uploadFile = async (req, res) => {
  console.log("Hit");
  try {
    message = ""
    await upload(req, res);

    if (req.file == undefined) {
      return res.status(400).json({ message: "Choose a file to upload" });
    }

    await readXlsxFile(fs.createReadStream('./public/uploads/'+req.file.originalname), { getSheets: true }).then((sheets) => {
      if(sheets.length == 3 && sheets[0].name == "Guests" && sheets[1].name == "Stages" && sheets[2].name == "Schedule"){
        
      }
      else{
        message += `Error occured: The excel file has incorrect number of sheets or names of sheets \n`;
        console.log(message)
      }
    })

    // TODO: excel error thingy
    // Readable Stream.
    async function kill(){
      let arr = ["Guests","Stages"]
      for (cnti in arr){
        elem = arr[cnti]
        await readXlsxFile(fs.createReadStream('./public/uploads/'+req.file.originalname), {schema: sheetsSchema[elem], sheet: elem}).then(async({ rows, errors }) => {
          if(errors.length != 0){
            message += `Error occured: The excel ${elem} has incorrect format \n`
            console.log(errors)
          }  
          else{
            await sqlInsert.insertIntoTable(elem)(rows);
          }
        })
      }
    }

    await kill()

    await readXlsxFile(fs.createReadStream('./public/uploads/'+req.file.originalname), {schema: sheetsSchema.Schedule, sheet: "Schedule"}).then(async({ rows, errors }) => {
      if(errors.length != 0){
          message +=  `Error occured: The excel sheet Schedule has incorrect format \n`
          console.log(errors)
      }  
      else{
        sqlInsert.insertIntoTable("Schedule")(rows).then(x => 
          console.log(x)
          // sqlInsert.insertIntoTable("ArtistSchedule")(rows)
        );
      }
    })  

    await readXlsxFile(fs.createReadStream('./public/uploads/'+req.file.originalname), {schema: sheetsSchema.Schedule, sheet: "Schedule"}).then(async({ rows, errors }) => {
      if(errors.length != 0){
          message +=  `Error occured: The excel sheet Schedule has incorrect format \n`
          console.log(errors)
      }  
      else{
        sqlInsert.insertIntoTable("ArtistSchedule")(rows);
      }
    })
  
    if(message == ""){
      message = "File uploaded successfully: " + req.file.originalname
    }
    res.json({message})
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).json({
        message: "File size should be less than 5MB",
      });
    }
    return res.status(500).json({
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
var ExcelReader = require('node-excel-stream').ExcelReader;
let fs = require('fs');
let eventArr = []

let dataStream = fs.createReadStream('data.xlsx');
let reader = new ExcelReader(dataStream, {
    sheets: [{
        name: 'Sheet1',
        rows: {
            headerRow: 1,
            allowedHeaders: [{
                name: 'EventTypeName',
                key: 'name'
            }]
        }
    }]
})
console.log('starting parse');
reader.eachRow((rowData, rowNum, sheetSchema) => {
    eventArr.push(rowData);
})
.then(() => {
    console.log('done parsing');
});

module.exports = eventArr
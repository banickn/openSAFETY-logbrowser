// Reference to the open file button
const fileManagerBtn = document.getElementById('openFile');

// Module to open a dialog from the renderer process
const {dialog} = require('electron').remote;

// Checkbox ids
const severities = ["chkbx-info", "chkbx-warn", "chkbx-error"];

// Apply Filter button id
const applyFilterBtn = document.getElementById('applyFilters');


fileManagerBtn.addEventListener('click', function (event) {
  openFile();
})

applyFilterBtn.addEventListener('click', function (event) {
  readFile(files);
})

var selectedSeverities = [];
parseErrorCodes();

/**
 * Select error level severities
 */
function selectSeverities() {
   selectedSeverities = [];
   severities.forEach(function(elem) {
     var element = document.getElementById(elem);
     if (element.checked)
         selectedSeverities.push(element.value);
 })
}

/**
 * Checkbox selected
 */
function isSelected(arr, val) {
   var found = false;
   arr.forEach(function(elem) {
     if (elem == val) {;
       found = true;
       return found;
   }
})

   return found;
}

/**
 * open File dialog for SL log
 */
function openFile () {
  dialog.showOpenDialog(
  {
    title: 'Select a file',
    filters: [
    { name: 'All files', extensions: ['*'] }
    ],
    properties: [openFile]
},
readFile
);
}

/**
 * Read the SL log file
 */
var fs = require('fs');
function readFile(fileNames) {
    if (fileNames === undefined)
      return;
    else
        files = fileNames;

    var fileName = fileNames[0];
    fs.readFile(fileName, 'utf-8', function (err, data) {

    var obj = JSON.parse(data);
    parseJson(obj);
});
}

/**
 * Parse the openSAFETY error codes and push into map object
 */
var errorCodeMap = new Map();
function parseErrorCodes() {
    $.getJSON("errorcodes.json", function(data) {
        $.each(data, function(i, item) {
            errorCodeMap.set(item.id, item.desc);
        });
    });
}

/**
 * Parse SL log json file and build table
 */
function parseJson(input) {
    $("table > tbody").empty();

    for (var i = 0, len = input.length; i < len; i++) {

        var dt = eval(input[i].TimeStamp);
        var timestamp = new Date(dt);
        var row;

        selectSeverities();

        if (isSelected(selectedSeverities, input[i].Level))
        {
            if(input[i].Level == "Warning"){ 
                row = "<tr class=\"warning\">";}
                else if(input[i].Level == "Error"){
                    row = "<tr class=\"danger\">";}
                    else{
                        row = "<tr>"
                    }

                    row += "<td>" + input[i].Nr + "</td><td>" + input[i].EntryNr + "</td><td>" + timestamp.toLocaleString() + "</td>";

            //  Hexadecimal and decimal representation
            var decError = parseInt(input[i].ErrorCode, 16);
            var hexError = input[i].ErrorCode.toUpperCase();
            hexErrorIndex = "0x" + hexError; 
            console.log(errorCodeMap.get(hexErrorIndex));
            //var textError = code[hexErrorIndex].desc;
            row += "<td>" + errorCodeMap.get(hexErrorIndex) + "</td><td>"+ decError + " / 0x1"+ hexError +" </td>";

            // error level icons
            row += "<td>0x" + input[i].ErrorInfo1 + "</td><td>0x" + input[i].ErrorInfo2 + "</td>";
            if(input[i].Level == "Warning"){ 
              row += "<td><span class=\"glyphicon glyphicon-warning-sign\" aria-hidden=\"true\"></span>";}
              else if(input[i].Level == "Error"){
                  row += "<td><span class=\"glyphicon glyphicon-remove-sign\" aria-hidden=\"true\"></span>";}
                  else{
                      row += "<td>"
                  }

                  row += " " + input[i].Level + "</td></tr>";
            // build table from new to old entries
            $('table').prepend(row); 
        }
    }
}
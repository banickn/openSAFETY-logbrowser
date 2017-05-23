// Reference to the open file button
const fileManagerBtn = document.getElementById('openFile');
// Module to open a dialog from the renderer process
const {dialog} = require('electron').remote;
// Add an onclick listener to the button
fileManagerBtn.addEventListener('click', function (event) {
  openFile();
})


const applyFilterBtn = document.getElementById('applyFilters');

applyFilterBtn.addEventListener('click', function (event) {
  readFile(files);
})


const severities = ["chkbx-info", "chkbx-warn", "chkbx-error"];
var selectedSeverities = [];


function selectSeverities() {
 selectedSeverities = [];
 severities.forEach(function(elem) {
   var element = document.getElementById(elem);
   if (element.checked)
       selectedSeverities.push(element.value);
})
}
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

var fs = require('fs');
function readFile(fileNames) {
  if (fileNames === undefined)
      return;
  else
    files = fileNames;

var fileName = fileNames[0];
fs.readFile(fileName, 'utf-8', function (err, data) {
    if (err) 

 var obj = JSON.parse(data);
 parseJsonNew(obj);
});
}

function parseJsonNew(input) {
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
            //console.log(hcode[hexErrorIndex].desc);
            //var textError = code[hexErrorIndex].desc;
            row += "<td>" + " </td><td>"+ decError + " / 0x1"+ hexError +" </td>";

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

function parseJson(input) {
    $.getJSON(input, function( data ) {
        console.log(input);
        var tr;
        if($.isEmptyObject(data))
        {
          row = "<tr><td colspan=\"7\"><p class=\"lead\">No openSAFETY SL log entries available.</td></tr>";
          $('table').append(row);
      }
      else
      {
        $.each(data, function(i, item) {
          var dt = eval(data[i].TimeStamp);
          var timestamp = new Date(dt);
          var row;


          if(data[i].Level == "Warning"){ 
            row = "<tr class=\"warning\">";}
            else if(data[i].Level == "Error"){
                row = "<tr class=\"danger\">";}
                else{
                    row = "<tr>"
                }
          // Get error description for the error code
          $.getJSON("errorcodes.json", function(code) {

            row += "<td>" + data[i].Nr + "</td><td>" + data[i].EntryNr + "</td><td>" + timestamp.toLocaleString() + "</td>";

            //  Hexadecimal and decimal representation
            var decError = parseInt(data[i].ErrorCode, 16);
            var hexError = data[i].ErrorCode.toUpperCase();
            hexErrorIndex = "0x" + hexError; 
            //console.log(hcode[hexErrorIndex].desc);
            var textError = code[hexErrorIndex].desc;
            row += "<td>" + textError + " </td><td>"+ decError + " / 0x1"+ hexError +" </td>";

            // error level icons
            row += "<td>0x" + data[i].ErrorInfo1 + "</td><td>0x" + data[i].ErrorInfo2 + "</td>";
            if(data[i].Level == "Warning"){ 
              row += "<td> <i class=\"small material-icons\">warning</i></td>";}
              else if(data[i].Level == "Error"){
                  row += "<td> <i class=\"small material-icons\">not_interested</i></td>";}
                  else{
                      row += "<td>"
                  }

                  row += " " + data[i].Level + "</td></tr>";
            // build table from new to old entries
            $('table').prepend(row);

        });
      });
    }});
}

function doGet(e) {
  var template = HtmlService.createTemplateFromFile('index'); 
  var html = template.evaluate()
    .setTitle('RC Labels');
 
 var htmlOutput = HtmlService.createHtmlOutput(html);   
 htmlOutput.addMetaTag('viewport', 'width=device-width, initial-scale=1');   
 
 return htmlOutput
}

function getScriptURL() {
  return ScriptApp.getService().getUrl();
}

let ss = SpreadsheetApp.openById("19Bw0lliNfx16gnJsvuEGwVXxP116FIwf92gVyoqqPAU");
let s = ss.getSheetByName("Data");
let d = s.getDataRange().getValues();
let item = {};
let todaysDate = new Date();
let today = todaysDate.toLocaleDateString();
let expDate = new Date();
expDate.setDate(expDate.getDate() + 7);
let useByDate = expDate.toLocaleDateString();
let headers = 1;
let column = 0;


function addItemToDB(objToAdd) {
  s.appendRow([objToAdd.name, objToAdd.category, objToAdd.useBy, objToAdd.timeAmt, objToAdd.denom, objToAdd.initials])
}

function getExpDate(countInDays) {
  let expDate = new Date();
  expDate.setDate(expDate.getDate() + countInDays);
  return expDate.toLocaleDateString();
}

function getCountOfDays(amount, denom) {
  let days = amount;
  let denomLower = denom.toLowerCase();
  if (denomLower === "weeks") {
    days *= 7;
  } else if (denomLower === "months") {
    days *= 30;
  } else if (denomLower === "years") {
    days *= 365;
  }
  return days;
}

function getItems() {
    var items = [];
  for (var row=headers; row < d.length; row++) {
    items.push(d[row][column]);
  } return( items );
}

function getRowSet(formResult, printAmt, initials) {
  let item = {};
  d.forEach(r => {
    if (r[0] === formResult) {
      item = {
        "itemName" : r[0],
        "itemCat" : r[1],
        "printDate" : today,
        "expDate" : getExpDate(getCountOfDays(r[3], r[4])),
        "useBy" : r[2],
        "printAmt" : printAmt,
        "userInitials" : initials
      };

    // } else {
    //   item = {
    //     "itemName" : formResult,
    //     "itemCat" : "",
    //     "printDate" : today,
    //     "expDate" : "",
    //     "useBy" : "",
    //     "printAmt" : printAmt,
    //     "userInitials" : initials
    //   }
    }
  })
  return item
}

let zplTest = "^XA^A0,,100,100^FB400,2,,L,50^FDHello World^PS^XZ"



function sendPrintRequest(zpl, snFromUser) {
  var apiKey = 'q3je3ATd633bIFzwQefiw9XZnKY6eZRQ';
  var tenantAccountNumber = 'e9318948fca45f8f55558c03d1b76a87';
  var printerSerialNumber = snFromUser;
  Logger.log(zpl)
  var zplFile = Utilities.newBlob(zpl,'text/plain', "zplTest.txt");

  // Construct the URL
  var url = 'https://api.zebra.com/v2/devices/printers/send';

  var payload = {
    'sn': printerSerialNumber,
    'zpl_file': zplFile
  };

  var options = {
    'method': 'post',
    'payload': payload,
    'headers': {
      'apikey': apiKey,
      'tenant' : tenantAccountNumber,
      'accept': 'text/plain'
    }
  };

  var response = UrlFetchApp.fetch(url, options);

  // Log the response for debugging
  Logger.log(response.getContentText());
  return response.getContentText();
}

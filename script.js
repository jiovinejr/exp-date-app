function buildTagList(items) {
    $( "#item" ).autocomplete({
      source: items
    });
    let val = document.getElementById("item").value;
    
  }
  
  function showAddForm() {
    let f = document.getElementById("addForm");
    if(f.style.display === "none") {
      f.style.display = "block";
    } else {
      f.style.display = "none";
    }
  }
  
  function showSpinner() {
    let spinners = document.getElementsByClassName("spinner");
    console.log(spinners);
    for(let i = 0; i < spinners.length; i++) {
      spinners[i].style.display = "";
    }
  }
  
  function hideSpinner() {
    let spinners = document.getElementsByClassName("spinner");
    for(let i = 0; i < spinners.length; i++) {
      spinners[i].style.display = "none";
    }
  }
  
  function retrieveData() {
    let val = document.getElementById("item").value;
    let copies = document.getElementById("printAmountInput").value;
    let initials = document.getElementById("init").value.toUpperCase();
    google.script.run.withSuccessHandler(success).getRowSet(val, copies, initials);
    document.getElementById("item").value = "";
    document.getElementById("init").value = ""
    document.getElementById("printAmountInput").value = 1;
  }
  function success(val) {
    let zplStr = buildZplFile(val);
    let sn = getSnFromBtn();
    let res = google.script.run.withSuccessHandler(didItPrint).sendPrintRequest(zplStr, sn);
    showSpinner();
  }
  
  function didItPrint(res) {
    hideSpinner();
    $("#addModal").modal('hide');
    console.log(JSON.stringify(res));
  }
  
  function buildZplFile(obj) {
    let zpl = `^XA^FB405,3,-35,C^FO10,10^A0,130,50^FD ${obj.itemName} ^FS^FB400,,,C^FO5,250^A0,30^FDPrinted On: ${obj.printDate}  ${obj.userInitials}^FS^FB300,1,0,R^FO50,320^A0,90,60^FD ${obj.expDate} ^FS^FB100,,,C^FO40,270^A0,20^TBB,100,100^FDUse By:^FS"^PQ ${obj.printAmt}^PS^XZ`;
    return zpl;
  }
  
  function addToDB() {
    let newItemName = document.getElementById("nameToAdd").value;
    let newItemCat = document.getElementById("catForNewItem").value;
    let newItemTimeAmt = document.getElementById("timeAmt").value;
    let newItemTimeDenom = document.getElementById("timeDenom").value;
    let newItemCreator = document.getElementById('addInit').value.toUpperCase();
    let itemToAdd = {
      "name" : newItemName,
      "category" : newItemCat,
      "useBy" : "Use By: ",
      "timeAmt" : newItemTimeAmt,
      "denom" : newItemTimeDenom,
      "initials" : newItemCreator
    }
    if (newItemName === '' || newItemCreator === '') {
      document.getElementById('addReq').style.display = "inline-block";
      if (newItemName === '') {
        document.getElementById("nameToAdd").style.border = "1px solid red";
        document.getElementById("nameToAdd").style.animation = "horizontal-shaking 0.35s";
      }
      if (newItemCreator === '') {
        document.getElementById("addInit").style.border = "1px solid red";
        document.getElementById("addInit").style.animation = "horizontal-shaking 0.35s";
      }
      return false;
    }
    else {
      google.script.run.withSuccessHandler(didItPrint).addItemToDB(itemToAdd);
      showSpinner();
      reLoad();
    }
  }
  
  function reLoad() {
         google.script.run
        .withSuccessHandler(function(url){
          window.open(url,'_top');
        })
        .getScriptURL();
  }
  
  
  function handleCustom() {
    let customName = document.getElementById("customName").value;
    let customExp = document.getElementById("customExp").value;
    let customMaker = document.getElementById("customInit").value.toUpperCase();
    let customPrintAmt = document.getElementById("customPrintAmt").value;
      let todaysDate = new Date();
      let today = todaysDate.toLocaleDateString();
      let formatExp = new Date(customExp);
      formatExp.setDate(formatExp.getDate() + 1);
  
    
    let item = {
      "itemName" : customName,
      "itemCat" : '',
      "printDate" : today,
      "expDate" : formatExp.toLocaleDateString(),
      "useBy" : '',
      "printAmt" : customPrintAmt,
      "userInitials" : customMaker
    };
  
    if(customMaker === '') {
      document.getElementById('customReq').style.display = "inline-block";
      document.getElementById("customInit").style.border = "1px solid red";
      document.getElementById("customInit").style.animation = "horizontal-shaking 0.35s";
      return false;
    }
    else {
      success(item);
      $("#customModal").modal('hide');
  
      document.getElementById("customName").value = '';
      document.getElementById("customExp").value = '';
      document.getElementById("customInit").value = '';
      document.getElementById("customPrintAmt").value = 1;
    }
  }
  
  
  function getSnFromBtn() {
    let sns = document.getElementsByName("printOptions");
    let snToUse = "";
    for(let i = 0; i < sns.length; i++) {
      if (sns[i].checked) {
        snToUse = sns[i].value;
      }
    }
    console.log(snToUse);
    return snToUse;
  }
  
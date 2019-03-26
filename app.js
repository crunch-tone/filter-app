function init() {
  resetFilters();
  addFilter();

  document.addEventListener(
    "DOMContentLoaded",
    function() {
      document.getElementById("add-condition").onclick = addFilter;
      document.getElementById("clear-filter").onclick = init;
      document.getElementById("apply").onclick = getData;
    },
    false
  );
}

//global variables
var mainDiv = document.getElementById("main"); //ref to main div with filters

//attributes for filter fields, they will be added during the creation of filters
var filterElementsTypes = ["select", "select", "input", "button"];
var filterElementsIds = [
  "textNumSelectMenu",
  "filterOptions",
  "searchField",
  "deleteFilter"
];
var filterElementsClassNames = [
  "custom-select custom-select-sm",
  "custom-select custom-select-sm",
  "form-control form-control-sm",
  "deleteFilter btn"
];
var textNumSelectMenuOptions = ["Text field", "Number field"];
var textFieldOptions = [
  "Containing",
  "Exactly matching",
  "Begins with",
  "Ends with"
];
var numberFieldOptions = ["Equal", "Greater than", "Less than"];
var filterAllowedIdsArr = [];
var rowsAmount = 10;
var finalData = { text: [], number: [] };

//creating filter and adding attributes
function createFilter() {
  var filter = document.createElement("div");
  filter.className = "form-inline";
  filter.id = filterAllowedIdsArr[0];
  filterAllowedIdsArr = filterAllowedIdsArr.slice(1);
  mainDiv.appendChild(filter);
  for (var i = 0; i < filterElementsTypes.length; i++) {
    var element = document.createElement(filterElementsTypes[i]);
    element.id = `${filterElementsIds[i]}-${filter.id}`;
    element.className = filterElementsClassNames[i].concat(" ", "fields-style");
    filter.appendChild(element);
    var menu = document.getElementById(element.id);
    //creating text num menu
    if (i == 0) {
      createSelectMenuOptions(textNumSelectMenuOptions, menu);
    }
    //creating options menu
    else if (i == 1) {
      createSelectMenuOptions(textFieldOptions, menu);
    }
    //adding icon to delete button
    else if (i == 3) {
      var icon = document.createElement("i");
      var deleteButton = document.getElementById(element.id);
      deleteButton.appendChild(icon);
      icon.className = "fas fa-times";
    }
  }

  //add eventlisteners to newly created elements
  document
    .getElementById(`${filterElementsIds[0]}-${filter.id}`)
    .addEventListener("change", redrawFilter);
  document
    .getElementById(`${filterElementsIds[3]}-${filter.id}`)
    .addEventListener("click", deleteFilter);
  document
    .getElementById(`${filterElementsIds[2]}-${filter.id}`)
    .addEventListener("keydown", checkInputIsNumeric);
  document
    .getElementById(`${filterElementsIds[2]}-${filter.id}`)
    .addEventListener("keyup", onKeyUp);

  canShowAddButton(); //check if we can show add button
  canShowDeleteButton(); //check if we can show delete button
}

function createSelectMenuOptions(array, menu) {
  for (var i = 0; i < array.length; i++) {
    var option = document.createElement("option");
    option.value = array[i];
    option.text = array[i];
    menu.appendChild(option);
  }
}

//check if we can add filter and add it
function addFilter() {
  if (filterAllowedIdsArr.length > 0) {
    createFilter();
  }
}

function deleteFilter() {
  filterAllowedIdsArr.push(this.parentNode.id);
  this.parentNode.parentNode.removeChild(this.parentNode);
  canShowAddButton();
  canShowDeleteButton();
}

function filterIdGenerator(num) {
  var filterIdArray = [];
  for (i = 0; i < num; i++) {
    filterIdArray.push(`filter-${i + 1}`);
  }
  return filterIdArray;
}

//redraw filter elements if we change the options
function redrawFilter() {
  var filterOptionsMenu = this.parentNode.childNodes[1];
  var inputField = this.parentNode.childNodes[2];
  while (filterOptionsMenu.firstChild) {
    filterOptionsMenu.removeChild(filterOptionsMenu.firstChild);
  }
  var textNum =
    this.value == textNumSelectMenuOptions[0]
      ? textFieldOptions
      : numberFieldOptions;
  createSelectMenuOptions(textNum, filterOptionsMenu);
  inputField.value = "";
}

//reset all filters, fields, console and generate new allowed IDs array
function resetFilters() {
  filterAllowedIdsArr = filterIdGenerator(rowsAmount);
  while (mainDiv.firstChild) {
    mainDiv.removeChild(mainDiv.firstChild);
  }
  finalData = { text: [], number: [] };
  console.clear();
}

function canShowAddButton() {
  if (filterAllowedIdsArr.length == 0) {
    document.getElementById("add-condition").disabled = true;
  } else {
    document.getElementById("add-condition").disabled = false;
  }
}

function canShowDeleteButton() {
  if (filterAllowedIdsArr.length < rowsAmount - 1) {
    document.getElementsByClassName("deleteFilter")[0].disabled = false;
  } else {
    document.getElementsByClassName("deleteFilter")[0].disabled = true;
  }
}

function checkInputIsNumeric(e) {
  if (e.keyCode >= 48 && e.keyCode <= 57) {
    return true;
  } else {
    return false;
  }
}

function onKeyUp(e) {
  var numericInputField =
    this.parentNode.childNodes[0].value == textNumSelectMenuOptions[1]
      ? true
      : false;

  if (!checkInputIsNumeric(e) && numericInputField) {
    this.value = this.value.slice(0, -1);
  }
}

function getData() {
  var usedRows = rowsAmount - filterAllowedIdsArr.length;
  for (i = 0; i < usedRows; i++) {
    var resultOperation = mainDiv.childNodes[
      i
    ].childNodes[1].value.toLowerCase();
    var resultValue = mainDiv.childNodes[i].childNodes[2].value;
    var resultText = { operation: resultOperation, value: resultValue };
    var resultNum = {
      operation: resultOperation,
      value: parseInt(resultValue)
    };
    if (
      mainDiv.childNodes[i].childNodes[0].value == textNumSelectMenuOptions[0]
    ) {
      finalData.text.push(resultText);
    } else if (
      mainDiv.childNodes[i].childNodes[0].value == textNumSelectMenuOptions[1]
    ) {
      finalData.number.push(resultNum);
    }
  }
  console.log(finalData);
  //var finalJSON = JSON.stringify(finalData);
  //console.log(finalJSON);
}

//let's go
init();

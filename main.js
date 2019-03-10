// Declare our constants
const operatorsList = ['clearElement', 'clear', 'back', 'div', 'mul', 'sub', 'add', 'sign', 'dot', 'equals'];

const keysToOperatorsDict = {
  "Escape": "clearElement",
  "Backspace": "back",
  "/": "div",
  "*": "mul",
  "-": "sub",
  "+": "add",
  ".": "dot",
  ",": "dot",
  "Enter": "equals",
  "=": "equals"
};

const operationsSymbolsDict = {
  "div": "/",
  "mul": "*",
  "sub": "-",
  "add": "+"
}

// Grab our screen elements
const prevValueScreen = document.getElementById('calculator__prev-value');
const operatorScreen = document.getElementById('calculator__operator');
const myScreen = document.getElementById('calculator__screen-value');

// Init our state
let prevValue = 0;
let currentValueString = "0";
let currentValue = 0;
let currentOperatorSymbol = null;
let hasInput = false;

// Init screen value
refreshScreen();

// Grab all our buttons
const buttons = document.getElementsByClassName("calculator__button");
for (let button of buttons) {
  // Receive click events
  button.addEventListener('click', processClick.bind(button));
}


// Receive keyboard inputs
document.addEventListener('keydown', handleKeyboard);


/////////////////////////////
//  Helper functions
//

/**
 * Refresh our screen with current values
 */
function refreshScreen() {
  if (currentOperatorSymbol == null) {
    prevValueScreen.textContent = "";
    operatorScreen.textContent = "";
  } else {
    prevValueScreen.textContent = prevValue.toString();
    operatorScreen.textContent = operationsSymbolsDict[currentOperatorSymbol];
  }

  myScreen.value = currentValueString;
}

/**
 * Process a click on one of our buttons. When called, 'this' is bound to the clicked button
 * 
 * @param {MouseEvent} event DOM event generated by the click
 */
function processClick(event) {
  const buttonValue = this.value;
  if (isOperator(buttonValue)) {
    processOperator(buttonValue);
  } else {
    processNumber(buttonValue);
  }
}

/**
 * Handles keypresses from user
 * @param {KeyboardEvent} event The input event
 */
function handleKeyboard(event) {
  let bHandled = false;
  if (keysToOperatorsDict[event.key] !== undefined) {
    const operator = keysToOperatorsDict[event.key];
    processOperator(operator);
    bHandled = true;
  } else if (isNumber(event.key)) {
    processNumber(event.key);
    bHandled = true;
  }

  if (bHandled) {
    event.preventDefault();
  }
}

/**
 * Process one of our calculator's operator
 * @param {any} operatorSymbol  The symbol of the operator to process
 */
function processOperator(operatorSymbol) {
  switch (operatorSymbol) {
    case 'add':
    case 'sub':
    case 'mul':
    case 'div':
      if (hasInput) {
        // Process input, new line
        if (currentOperatorSymbol != null) {
          // Process operation
          processCurrentOperation();
        } else {
          // Set previous value from current input
          prevValue = parseFloat(currentValueString);
        }

        // Update the currentOperator
        currentOperatorSymbol = operatorSymbol;
        // Set state to no input
        hasInput = false;
      } else {
        // Just change the currentOperator
        currentOperatorSymbol = operatorSymbol;
      }
      break;
    case 'equals':
      if (currentOperatorSymbol != null) {
        // Process operation
        processCurrentOperation();
        // Remove operator
        currentOperatorSymbol = null;
        // Copy (calculated) prev value back to currentValue
        currentValueString = prevValue.toString();
      }
      break;
    case 'clearElement':
      // Reinitialize input
      clear(false);
      break;
    case 'clear':
      // Reinitialize everything
      clear(true);
      break;
    case 'back':
      operatorBack();
      break;
    case 'dot':
      operatorDot();
      break;
    case 'sign':
      operatorSign();
      break;
  }

  // Refresh the screen
  refreshScreen();
}

/**
 * Remove last char from currentValueString. Clear input back to "0" if empty.
 */
function operatorBack() {
  // Remove last character of our currentValueString
  currentValueString = currentValueString.slice(0, currentValueString.length - 1);

  // If empty, set back to 0 (string)
  if (currentValueString.length == 0) {
    currentValueString = "0";
    hasInput = false;
  }
}

/**
 * Add a decimal symbol in our currentValueString, if not already present
 */
function operatorDot() {
  // Check if already decimal
  if (currentValueString.indexOf('.') > -1) {
    return;
  }
  // If not, add a . at the end of currentValueString
  currentValueString += ".";
  hasInput = true;
}

/**
 * Toggles a '-' symbol in front of our currentValueString
 */
function operatorSign() {
  if (!hasInput) {
    return;
  }
  // Check if has a sign
  if (currentValueString[0] === "-") {
    // Strip first character
    currentValueString = currentValueString.slice(1, currentValueString.length);
  } else {
    // Add a '-' before our string
    currentValueString = '-' + currentValueString;
  }
}

/**
 * Reset our calculator state
 * @param {any} bEverything Should we reset only the current element or everything
 */
function clear(bEverything) {
  currentValueString = "0";
  hasInput = false;

  if (bEverything) {
    prevValue = 0;
    currentOperatorSymbol = null;
  }
}

/**
 * Process the current operation. Update prevValue to (prevValue [currentOperator] currentValue)
 */
function processCurrentOperation() {
  const currentValue = parseFloat(currentValueString);

  switch (currentOperatorSymbol) {
    case 'add':
      prevValue = prevValue + currentValue;
      break;
    case 'sub':
      prevValue = prevValue - currentValue;
      break;
    case 'mul':
      prevValue = prevValue * currentValue;
      break;
    case 'div':
      prevValue = prevValue / currentValue;
      break;
    default:
      // Do nothing
  }
}

/**
 * Process a number input
 * @param {any} numberAsString  The input number as a string
 */
function processNumber(numberAsString) {
  if (!hasInput) {
    hasInput = true;
    currentValueString = numberAsString;
  } else {
    currentValueString += numberAsString;
  }
  
  refreshScreen();
}

/**
 * Check if symbol is an operator
 * 
 * @param {any} stringValue Test value
 * 
 * @returns {boolean} True if value is a known operator
 */
function isOperator(stringValue) {
  return operatorsList.indexOf(stringValue) > -1;
}

/**
 * Check if symbol is a number
 * 
 * @param {any} stringValue Test value
 * 
 * @returns {boolean} True if value is a number
 */
function isNumber(stringValue) {
  return !isNaN(parseFloat(stringValue));
}